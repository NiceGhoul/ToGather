<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Donation;
use App\Models\Article;
use App\Models\User;
use App\Models\VerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
         $user = auth()->user();
        $stats = [
            'total_users' => User::count(),
            'total_campaigns' => Campaign::count(),
            'total_articles' => Article::count(),
            'total_donations' => Donation::whereIn('status', ['successful', 'pending'])->sum('amount'),
            'pending_verifications' => VerificationRequest::where('status', 'pending')->count(),
            'pending_campaigns' => Campaign::where('status', 'pending')->count(),
            'pending_articles' => Article::where('status', 'pending')->count(),
        ];

        $dailyStart = request('daily_start');
        $dailyEnd = request('daily_end');

        $dailyQuery = Donation::whereIn('status', ['successful', 'pending']);

        if ($dailyStart && $dailyEnd) {
            $dailyQuery->whereBetween('created_at', [
                Carbon::parse($dailyStart)->startOfDay(),
                Carbon::parse($dailyEnd)->endOfDay()
            ]);
        } else {
            $dailyQuery->whereBetween('created_at', [
                Carbon::now()->startOfWeek(),
                Carbon::now()->endOfWeek()
            ]);
        }

        $dailyDonations = $dailyQuery
        ->select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(amount) as total_amount'),
            DB::raw('COUNT(*) as total_count')
        )
        ->groupBy('date')
        ->orderBy('date')
        ->get()
        ->map(function($item) {
            return [
                'date' => Carbon::parse($item->date)->format('M d'),
                'amount' => $item->total_amount,
                'count' => $item->total_count,
            ];
        });

        $currentMonth = request('weekly_month', Carbon::now()->month);
        $currentYear = request('weekly_year', Carbon::now()->year);

        $weeklyDonations = Donation::whereIn('status', ['successful', 'pending'])
        ->whereYear('created_at', $currentYear)
        ->whereMonth('created_at', $currentMonth)
        ->select(
            DB::raw('LEAST(CEILING(DAY(created_at) / 7), 4) as week_num'),
            DB::raw('SUM(amount) as total_amount'),
            DB::raw('COUNT(*) as total_count')
        )
        ->groupBy('week_num')
        ->orderBy('week_num')
        ->get()
        ->map(function($item) {
            return [
                'week' => 'Week ' . $item->week_num,
                'amount' => $item->total_amount,
                'count' => $item->total_count,
            ];
        });

        $monthlyDonations = Donation::whereIn('status', ['successful', 'pending'])
        ->where('created_at', '>=', Carbon::now()->subMonths(6))
        ->select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('SUM(amount) as total_amount'),
            DB::raw('COUNT(*) as total_count')
        )
        ->groupBy('month')
        ->orderBy('month')
        ->get()
        ->map(function($item) {
            return [
                'month' => Carbon::createFromFormat('Y-m', $item->month)->format('M Y'),
                'amount' => $item->total_amount,
                'count' => $item->total_count,
            ];
        });

        $yearlyDonations = Donation::whereIn('status', ['successful', 'pending'])
        ->where('created_at', '>=', Carbon::now()->subYears(3))
        ->select(
            DB::raw('YEAR(created_at) as year'),
            DB::raw('SUM(amount) as total_amount'),
            DB::raw('COUNT(*) as total_count')
        )
        ->groupBy('year')
        ->orderBy('year')
        ->get()
        ->map(function($item) {
            return [
                'year' => $item->year,
                'amount' => $item->total_amount,
                'count' => $item->total_count,
            ];
        });

        $recentDonations = Donation::with(['user', 'campaign'])
        ->whereIn('status', ['successful', 'pending'])
        ->latest()
        ->take(10)
        ->get()
        ->map(function($donation) {
            return [
                'id' => $donation->id,
                'donor' => $donation->anonymous ? 'Anonymous' : $donation->user->nickname,
                'campaign' => $donation->campaign->title,
                'amount' => $donation->amount,
                'message' => $donation->message,
                'created_at' => $donation->created_at->format('M d, Y H:i'),
            ];
        });

        $userStats = [
            'verified_users' => User::whereHas('verificationRequests', function($query) {
                $query->where('status', 'accepted');
            })->count(),
            'banned_users' => User::where('status', 'banned')->count(),
            'active_users' => User::where('status', 'active')->count(),
        ];

        $campaignStats = Campaign::select('status', DB::raw('count(*) as count'))
        ->groupBy('status')
        ->get()
        ->mapWithKeys(function($item) {
            return [$item->status->value => $item->count];
        });

        $articleStats = Article::select('status', DB::raw('count(*) as count'))
        ->groupBy('status')
        ->get()
        ->mapWithKeys(function($item) {
            return [$item->status => $item->count];
        });

        return Inertia::render('Admin/Dashboard', [
            'user' => $user,
            'stats' => $stats,
            'dailyDonations' => $dailyDonations,
            'weeklyDonations' => $weeklyDonations,
            'monthlyDonations' => $monthlyDonations,
            'yearlyDonations' => $yearlyDonations,
            'recentDonations' => $recentDonations,
            'userStats' => $userStats,
            'campaignStats' => $campaignStats,
            'articleStats' => $articleStats,
        ]);
    }
}
