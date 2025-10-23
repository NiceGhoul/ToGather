<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Midtrans\Snap;
use Midtrans\Config;

class DonationController extends Controller
{
    public function create(Request $request)
    {
        $campaign = null;
        
        // If campaign_id is provided, get the campaign
        if ($request->has('campaign_id')) {
            $campaign = Campaign::find($request->campaign_id);
        }
        
        return Inertia::render('Donation/Create', [
            'campaign' => $campaign,
            'campaigns' => Campaign::select('id', 'title')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'campaign_id' => 'required|exists:campaigns,id',
            'amount' => 'required|numeric|min:1000',
            'message' => 'nullable|string|max:500',
            'anonymous' => 'boolean'
        ]);

        // Configure Midtrans
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = env('MIDTRANS_IS_SANITIZED', true);
        Config::$is3ds = env('MIDTRANS_IS_3DS', true);

        // Create donation record
        $donation = Donation::create([
            'user_id' => auth()->id(),
            'campaign_id' => $request->campaign_id,
            'amount' => $request->amount,
            'message' => $request->message,
            'anonymous' => $request->boolean('anonymous'),
            'status' => 'pending'
        ]);

        $campaign = Campaign::find($request->campaign_id);
        $user = auth()->user();

        // Midtrans transaction parameters
        $params = [
            'transaction_details' => [
                'order_id' => 'DONATE-' . $donation->id . '-' . time(),
                'gross_amount' => (int) $request->amount,
            ],
            'customer_details' => [
                'first_name' => $user->full_name ?? 'Anonymous',
                'email' => $user->email,
                'phone' => $user->phone ?? '08111222333',
            ],
            'item_details' => [[
                'id' => 'donation-' . $campaign->id,
                'price' => (int) $request->amount,
                'quantity' => 1,
                'name' => 'Donation for ' . $campaign->title
            ]],
            'callbacks' => [
                'finish' => url('/donate?success=1'),
                'unfinish' => url('/donate?cancelled=1'),
                'error' => url('/donate?error=1')
            ]
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            
            return response()->json([
                'snap_token' => $snapToken,
                'donation_id' => $donation->id
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Payment initialization failed'], 500);
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


}
