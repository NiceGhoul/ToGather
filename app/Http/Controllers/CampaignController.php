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
use App\Http\Controllers\NotificationController;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;

use function PHPUnit\Framework\isEmpty;

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
        // Check if user is banned first
        if ($user->status->value === 'banned' || $user->status === 'banned') {
            return inertia('Verification/Banned');
        }

        $verificationRequest = $user->verificationRequests()->latest()->first();
        $usersCampaign = $user->campaigns()->whereIn('status', ['pending', 'draft'])->with('images')->latest()->first();
        // dd($usersCampaign);
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
            // if ($usersCampaign->contains(fn($c) => $c->status->value === 'pending')) {
            if ($usersCampaign->status->value === 'pending') {
                return inertia('Campaign/CampaignPending');
            // If user already has a campaign with the status draft
            // } else if ($usersCampaign->contains(fn($c) => $c->status->value === 'draft')) {
            } else if ($usersCampaign->status->value === 'draft') {

                if ($usersCampaign->images->isNotEmpty()) {
                    return Inertia::render('Campaign/CreateDetailsPreview', [
                        'campaign' => $usersCampaign,
                        'user' => $user,
                    ]);
                } else {
                    return inertia::render('Campaign/CreatePreview', [
                        'campaign' => $usersCampaign->first(),
                        'user' => $user,
                    ]);
                }
            }
            else {
                return inertia::render('Campaign/Create', [
                    'user_Id' => Auth::user()->id,
                ]);
            }
        }

        return inertia('Verification/Create');
    }

    public function editCampaign($id)
    {
        $draft =  Campaign::where('id', $id)->where('user_id', Auth::id())
        ->where('status', 'draft')->first();
        $location = Location::where('campaign_id', $id)->first();
        return Inertia::render('Campaign/Create', [
        'user_Id' => Auth::id(),
        'campaign' => $draft,
        'location' => $location,
    ]);
    }

    public function showList()
    {
        $campaigns = Campaign::where('status', ['active'])->get();
        $lookups = Lookup::all();

        return inertia('Campaign/CampaignList', [
            'campaigns' => $campaigns,
            'lookups' => $lookups,
        ]);
    }

    public function showLiked(){
        $liked = Likes::where('likes_type', 'App\Models\Campaign')->where('user_id', Auth::id())->pluck('likes_id');
        $campaigns = Campaign::whereIn('id', $liked)->get();

        return inertia('Campaign/LikedCampaign', [
            'likedCampaign' => $campaigns,
        ]);
    }

    public function getCampaignDetails($id)
    {
        $user = auth()->user();
        $donations = Donation::with(['user'])->where('campaign_id', $id)->where('status', 'successful')->get();
        $likes = $user->likedItems()->where('likes_id', $id)->where('likes_type', Campaign::class)->exists();
        $campaignData = Campaign::findOrFail($id);
        return inertia::render('Campaign/CampaignDetails', [
            'campaign' => $campaignData,
            'donations' => $donations,
            'liked' => $likes,
            'user' => $user,
        ]);
    }

    public function createNewCampaign(Request $request)
    {
        // Check if user is banned
        if (auth()->user()->status->value === 'banned' || auth()->user()->status === 'banned') {
            return back()->with('error', 'Your account has been banned. You cannot create campaigns.');
        }

        $draft = Campaign::where('user_id', Auth::id())->where('status', 'draft')->first();
        $data = $request->all();

        if ($draft) {
            $draft->update($data);
            $campaign = $draft;
        } else {
            $data['user_id'] = Auth::id();
            $data['status'] = 'draft';
            $campaign = Campaign::create($data);

        }

        if ($campaign && $request->has('location')) {
            $location = $request->input('location');
            $location['campaign_id'] = $campaign->id;

            $existingLocation = Location::where('campaign_id', $campaign->id)->first();

            if ($existingLocation) {
                $existingLocation->update($location);
            } else {
                Location::create($location);
            }
        }

        // Notify admins about new campaign
        NotificationController::notifyAdmins(
            'campaign_created',
            'New Campaign Submitted',
            "New campaign '{$campaign->title}' has been submitted by {$campaign->user->nickname} and is pending review.",
            ['campaign_id' => $campaign->id, 'user_id' => $campaign->user_id]
        );

        return inertia::render('Campaign/CreatePreview', [
                    'campaign' => $data,
                    'user' => auth()->user(),
                ]);
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

    public function getDetailsPreview(Request $request){
         $user = auth()->user();
        $content = $request->all();

        return inertia::render('Campaign/CreateDetailsPreview', [
            'campaign' => $content,
            'user' => $user,
        ]);
    }

    public function getCampaignListData(Request $request)
    {
        // inRandomOrder() -> to
        $lookups = Lookup::all();
        $category = $request->input('category');

        // get campaigns where they are not banned or rejected and is still pending
        if (!$category) {
            return response()->json(['error' => 'Category parameter is required'], 400);
        }

        if ($category === 'Completed') {
            $campaigns = Campaign::where('status', ['completed'])->get();
        }

        else if ($category === 'All') {
            $campaigns = Campaign::where('status', ['active'])->get();

        } else {
            $campaigns = Campaign::where('category', $category)->where('status', ['active'])->get();

        }

        return inertia::render('Campaign/CampaignList', [
            'campaigns' => $campaigns,
            'lookups' => $lookups,
        ]);
    }

    public function uploadSupportingMedia(Request $request)
    {
        $request->validate([
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif|max:4096',
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:4096',
            'campaign_id' => 'required|integer|exists:campaigns,id',
        ]);

        $urls = Image::where('imageable_id', $request->campaign_id)->get();

        if($urls->isNotEmpty()){

            foreach($urls as $path){
                Storage::disk('minio')->delete($path->path);
                $path->delete();
            };
        };

        foreach (['thumbnail', 'logo'] as $data) {
            if ($request->hasFile($data)) {
                $ext = $request->file($data)->getClientOriginalExtension();
                $filename = "campaign_{$request->campaign_id}_{$data}." . $ext;
                $path = $request->file($data)->storeAs('campaigns/image', $filename,'minio');

                $image = Image::create([
                    'path' => $path,
                    'imageable_id' => $request->campaign_id,
                    'imageable_type' => Campaign::class,
                ]);
            }
        }

        return Inertia::render('Campaign/CreateDetailsPreview', [
            'campaign' => Campaign::with('images')->findOrFail($request->campaign_id),
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
