<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;

class DonationController extends Controller
{
    public function create(Request $request)
    {
        $campaign = null;

        if ($request->has('campaign_id')) {
            $campaign = Campaign::find($request->campaign_id);
        }

        return Inertia::render('Donation/Create', [
            'campaign' => $campaign,
            'campaigns' => Campaign::select('id', 'title')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'campaign_id' => 'required|exists:campaigns,id',
            'amount' => 'required|numeric|min:1000',
            'message' => 'nullable|string|max:500',
            'anonymous' => 'boolean',
        ]);

        // Configure Midtrans
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = env('MIDTRANS_IS_SANITIZED', true);
        Config::$is3ds = env('MIDTRANS_IS_3DS', true);

        $donation = Donation::create([
            'user_id' => auth()->id(),
            'campaign_id' => $request->campaign_id,
            'amount' => $request->amount,
            'message' => $request->message,

            'anonymous' => $request->boolean('anonymous'),
            'status' => 'pending',
        ]);
        $campaign = Campaign::find($request->campaign_id);
        $user = auth()->user();
        $campaign->collected_amount += $request->amount;
        $campaign->save();

        // Midtrans transaction parameters
        $params = [
            'transaction_details' => [
                'order_id' => 'DONATE-'.$donation->id.'-'.time(),
                'gross_amount' => (int) $request->amount,
            ],
            'customer_details' => [
                'first_name' => $user->full_name ?? 'Anonymous',
                'email' => $user->email,
                'phone' => $user->phone ?? '08111222333',
            ],
            'item_details' => [[
                'id' => 'donation-'.$campaign->id,
                'price' => (int) $request->amount,
                'quantity' => 1,
                'name' => 'Donation for '.$campaign->title,
            ]],
            'callbacks' => [
                'finish' => url('/donate?success=1'),
                'unfinish' => url('/donate?cancelled=1'),
                'error' => url('/donate?error=1'),
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            NotificationController::notifyUser(
                $user->id,
                'donation_initiated',
                'Donation Initiated',
                'Your donation of Rp '.number_format($request->amount, 0, ',', '.')." to '{$campaign->title}' has been initiated. Please complete the payment process.",
                ['donation_id' => $donation->id, 'campaign_id' => $campaign->id]
            );

            return response()->json([
                'snap_token' => $snapToken,
                'donation_id' => $donation->id,
            ]);
        } catch (\Exception $e) {
            // This logs the full exception (message, stack trace, etc.) to your log files.
            Log::error('Payment initialization failed.', [
                'exception' => $e,
                'user_id' => auth()->id() ?? 'guest', // Optional: add context
            ]);

            return response()->json([
                'error' => 'Payment initialization failed',
                'message' => 'Please check the server logs for details.',
            ], 500);
        }
    }

    public function searchCampaigns(Request $request)
    {
        $query = $request->get('q');

        $campaigns = Campaign::where('title', 'like', "%{$query}%")
            ->select('id', 'title')
            ->limit(10)
            ->get();

        return response()->json($campaigns);
    }

    public function adminIndex()
    {
        $donations = Donation::with(['user', 'campaign'])
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total_count' => Donation::count(),
            'total_amount' => Donation::sum('amount'),
            'successful_count' => Donation::where('status', 'successful')->count(),
            'pending_count' => Donation::where('status', 'pending')->count(),
        ];

        return Inertia::render('Admin/Transaction', [
            'donations' => $donations,
            'stats' => $stats,
        ]);
    }

    public function midtransCallback(Request $request)
    {
        $serverKey = env('MIDTRANS_SERVER_KEY');
        $hashed = hash('sha512', $request->order_id.$request->status_code.$request->gross_amount.$serverKey);

        if ($hashed !== $request->signature_key) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $orderId = $request->order_id;
        $donationId = explode('-', $orderId)[1];
        $donation = Donation::find($donationId);

        if (! $donation) {
            return response()->json(['message' => 'Donation not found'], 404);
        }

        $transactionStatus = $request->transaction_status;

        if ($transactionStatus == 'settlement' || $transactionStatus == 'capture') {
            $donation->update(['status' => 'successful']);

            // Update campaign collected amount
            $campaign = $donation->campaign;
            $campaign->increment('collected_amount', $donation->amount);
            
        } elseif ($transactionStatus == 'cancel' || $transactionStatus == 'expire' || $transactionStatus == 'failure') {
            $donation->update(['status' => 'failed']);
        }

        return response()->json(['message' => 'OK']);
    }
}
