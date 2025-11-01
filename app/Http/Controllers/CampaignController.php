<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCampaignRequest;
use App\Http\Requests\UpdateCampaignRequest;
use App\Models\Campaign;
use App\Models\Donation;
use App\Models\Likes;
use App\Models\Location;
use App\Models\Lookup;
use App\Models\User;
use COM;
use Illuminate\Container\Attributes\Log;
// use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log as FacadesLog;
use Inertia\Inertia;

/*Bakal tambah 1 table untuk yg campaign sma verification request yaitu rejection reason
 tapi harus buat create untuk campaign dlu bru lanjut buat yang it */


class CampaignController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Home');
    }

    public function AdminCampaign(Request $request)
    {
        $baseStatuses = ['active', 'completed', 'rejected', 'banned'];
        $campaigns = Campaign::with(['user', 'verifier'])
            ->whereIn('status', $baseStatuses)
            ->when($request->input('status'), function ($query, $status) {
                return $query->where('status', $status);
            })
            ->get();

        return Inertia::render('Admin/Campaign/Campaign_List', [
            'campaigns' => $campaigns,
            'filters' => $request->only(['status'])
        ]);
    }
    public function AdminVerification()
    {
        $campaigns = Campaign::with(['user', 'verifier'])->where('status', 'pending')->get();
        return Inertia::render('Admin/Campaign/Campaign_Verification', [
            'campaigns' => $campaigns,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();

        $verificationRequest = $user->verificationRequests()->latest()->first();

        if (!$verificationRequest) {
            // No verification request - show verification form
            return inertia('Verification/Create');
        }

        if ($verificationRequest->status->value === 'pending') {
            // Pending verification - show pending status
            return inertia('Verification/Pending');
        }

        if ($verificationRequest->status->value === 'rejected') {
            // Rejected verification - show rejection message
            return inertia('Verification/Rejected');
        }

        if ($verificationRequest->status->value === 'accepted') {
            // Accepted verification - show campaign create form
            return inertia::render('Campaign/Create', [
            'user_Id' => Auth::user()->id,
        ]);
        }

        return inertia('Verification/Create');
    }

    public function showList()
    {
        $campaigns = Campaign::all();
        $lookups = Lookup::all();

        return inertia('Campaign/CampaignList', [
            'campaigns' => $campaigns,
            'lookups' => $lookups,
        ]);
    }

    public function showCreate()
    {
        return inertia::render('Campaign/Create', [
            'user_Id' => Auth::user()->id,
        ]);
    }

    public function getCampaignDetails($id)
    {
        $user = auth()->user();
        $donations = Donation::with([ 'user' ])->where('campaign_id', $id)->where('status', 'successful')->get();
        $likes = $user->likedItems()->where('likes_id', $id)->where('likes_type', Campaign::class)->exists();
        $campaignData = Campaign::findOrFail($id);
        return inertia::render('Campaign/CampaignDetails', [
            'campaign' => $campaignData,
            'donations' => $donations,
            'liked' => $likes,
        ]);
    }

    public function createNewCampaign(Request $request)
    {
        $data = $request->all();
        $data['user_id'] = Auth::id();
        $data['status'] = 'pending';
        $campaign = Campaign::create($data);

        if($campaign && $request->has('location')){
            $location = $request->input('location');
            $location['campaign_id'] = $campaign->id;
        }
        Location::create($location);
        return redirect()->back()->with('success', 'Campaign created successfully!');
    }


    public function ToggleLike(Request $request)
    {
        $user = auth()->user();
        $campaignId = $request->campaign_id;

        $existing = $user->likedItems()->where('likes_id', $campaignId)->where('likes_type', Campaign::class)->first();

        if ($existing) {
            $existing->delete();
        } else {
            $user->likedItems()->create([
                'likes_id' => $campaignId,
                'likes_type' => Campaign::class,
            ]);
        }
    }

    public function getCreateSupportingMediaData(Request $request){
        $content = $request->all();

        return inertia::render('Campaign/createSupportingMedia');
    }

    public function getCampaignListData(Request $request)
    {
        // inRandomOrder() -> to
        $lookups = Lookup::all();
        $category = $request->input('category');

        // get campaigns where they are not banned or rejected and is still pending
        if(!$category){
            return response()->json(['error' => 'Category parameter is required'], 400);
        }
        if ($category === 'All' || $category === null) {
            $campaigns = Campaign::where('status', ['active'])->get();

        }else{
            $campaigns = Campaign::where('category', $category)->where('status', ['active'])->get();

        }

        return inertia::render('Campaign/CampaignList', [
            'campaigns' => $campaigns,
            'lookups' => $lookups,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCampaignRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Campaign $campaign)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Campaign $campaign)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCampaignRequest $request, Campaign $campaign)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Campaign $campaign)
    {
        //
    }
}
