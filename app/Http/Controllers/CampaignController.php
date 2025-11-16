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
use App\Models\CampaignContent;
use App\Models\Image;
use App\Models\video;
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
    public function create($id = null)
    {
        $user = auth()->user();

        // Check if user is banned first
        if ($user->status->value === 'banned' || $user->status === 'banned') {
            return inertia('Verification/Banned');
        }

        $verificationRequest = $user->verificationRequests()->latest()->first();

        if ($id != null) {
            $usersCampaign = $user->campaigns()->with('images')
                ->where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();
                // dd($usersCampaign);
        } else {
            $usersCampaign = $user->campaigns()
                ->whereIn('status', ['pending', 'draft'])
                ->with('images')
                ->latest()
                ->first();
        }
        $content = [];
        // if($usersCampaign){
        //     $content = CampaignContent::with('images', 'videos')->where('campaign_id', $usersCampaign->id)->get()->map(function($data){
        //         $imageMedia = $data->images->map(function ($img) {
        //             return [
        //                 'path' => $img->path,
        //                 'filetype' => 'image',
        //                 'url' => $img->url,
        //             ];
        //         });

        //         $videoMedia = $data->videos->map(function ($vid) {
        //             return [
        //                 'path' => $vid->path,
        //                 'filetype' => 'video',
        //                 'url' => $vid->url,
        //             ];
        //         });

        //         $media = collect($imageMedia)->merge(collect($videoMedia));

        //         $data->setAttribute('media', $media);
        //         $data->unsetRelation('images');
        //         $data->unsetRelation('videos');

        //         return $data;
        //     });
        // }else{
        //     $content = [];
        // }
        // dd($content);
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
            // dd($usersCampaign);
            if ($usersCampaign) {
                if ($usersCampaign->status->value === 'pending') {
                    return inertia('Campaign/CampaignPending');
                    // If user already has a campaign with the status draft
                } else if ($usersCampaign->status->value === 'draft' || $usersCampaign->status->value === 'active') {
                    // dd($usersCampaign);
                    // if ($usersCampaign->images->isNotEmpty()) {
                    //     return Inertia::render('Campaign/CreateDetailsPreview', [
                    //         'campaign' => $usersCampaign,
                    //         'contents' => $content,
                    //         'user' => $user,
                    //     ]);
                    // } else {
                    //     return inertia::render('Campaign/CreatePreview', [
                    //         'campaign' => $usersCampaign,
                    //         'user' => $user,
                    //     ]);
                    // }
                    $draft =  Campaign::where('id', $id)->where('user_id', Auth::id())
                        ->where('status', 'draft')->first();
                    $location = Location::where('campaign_id', $id)->first();
                    return Inertia::render('Campaign/Create', [
                        'user_Id' => Auth::id(),
                        'campaign' => $draft,
                        'location' => $location,
                    ]);
                }
            } else {
                return inertia::render('Campaign/Create', [
                    'user_Id' => Auth::user()->id,
                ]);
            }
        }

        // return inertia('Verification/Create');
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
        $donations = Donation::with(['user.images'])->where('campaign_id', $id)->where('status', 'successful')->get();
        $likes = $user->likedItems()->where('likes_id', $id)->where('likes_type', Campaign::class)->exists();
        $campaignData = Campaign::where('id', $id)->with('images')->latest()->first();
        $content = CampaignContent::with('images', 'videos')->where('campaign_id', $id)->get()->map(function($data){

            $imageMedia = $data->images->map(function ($img) {
                return [
                    'path' => $img->path,
                    'filetype' => 'image',
                    'url' => $img->url,
                ];
            });
            $videoMedia = $data->videos->map(function ($vid) {
                return [
                    'path' => $vid->path,
                    'filetype' => 'video',
                    'url' => $vid->url,
                ];
            });
            $media = $imageMedia->merge($videoMedia);

            $data->setAttribute('media', $media);
            $data->unsetRelation('images');
            $data->unsetRelation('videos');

            return $data;
        });

        return inertia::render('Campaign/CampaignDetails', [
            'campaign' => $campaignData,
            'contents' => $content,
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
        // dd($request->all());
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

        return redirect()->route('campaigns.createPreview',$campaign->id);
    }


    public function ToggleLike(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Please log in first.',
            ], 401);
        }

        $campaignId = $request->campaign_id;

        $existing = $user->likedItems()->where('likes_id', $campaignId)->where('likes_type', Campaign::class)->first();

        if ($existing) {
            $existing->delete();
        } else {
            $user->likedItems()->create([
                'likes_id' => $campaignId,
                'likes_type' => Campaign::class,
            ]);
            $isLiked = true;
        }
        return response()->json([
            'success' => true,
            'isLiked' => $isLiked,
        ]);
    }

    public function getCreateSupportingMediaData($id)
    {
         $user = auth()->user();

        if ($id != null) {
            $usersCampaign = $user->campaigns()->with('images')
                ->where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();
            // dd($usersCampaign);
        } else {
            $usersCampaign = $user->campaigns()
                ->whereIn('status', ['pending', 'draft'])
                ->with('images')
                ->latest()
                ->first();
        }


        return inertia::render('Campaign/CreatePreview', [
            'campaign' => $usersCampaign,
            'user' => $user,
        ]);
    }

    public function getDetailsPreview($id)
    {
         $user = auth()->user();

        if ($id != null) {
            $usersCampaign = $user->campaigns()->with('images')
                ->where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();
                // dd($usersCampaign);
        } else {
            $usersCampaign = $user->campaigns()
                ->whereIn('status', ['pending', 'draft'])
                ->with('images')
                ->latest()
                ->first();
        }
        $content = [];
        if($usersCampaign){
            $content = CampaignContent::with('images', 'videos')->where('campaign_id', $usersCampaign->id)->get()->map(function($data){
                $imageMedia = $data->images->map(function ($img) {
                    return [
                        'path' => $img->path,
                        'filetype' => 'image',
                        'url' => $img->url,
                    ];
                });

                $videoMedia = $data->videos->map(function ($vid) {
                    return [
                        'path' => $vid->path,
                        'filetype' => 'video',
                        'url' => $vid->url,
                    ];
                });

                $media = collect($imageMedia)->merge(collect($videoMedia));

                $data->setAttribute('media', $media);
                $data->unsetRelation('images');
                $data->unsetRelation('videos');

                return $data;
            });
        }else{
            $content = [];
        }

        return inertia::render('Campaign/CreateDetailsPreview', [
            'campaign' => $usersCampaign,
            'contents' => $content,
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
        $user = auth()->user();
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
                Image::create([
                    'path' => $path,
                    'imageable_id' => $request->campaign_id,
                    'imageable_type' => Campaign::class,
                ]);
            }
        }

        $content = CampaignContent::with('images')->where('campaign_id', $request->campaign_id)->get()->map(function ($data) {
            $media = $data->images->map(function ($image) {
                return [
                    'path' => $image->path,
                    'filetype' => 'images',
                    'url' => $image->url,
                ];
            });
            $data->setAttribute('media', $media);
            $data->unsetRelation('images');

            return $data;
        });

        return Inertia::render('Campaign/CreateDetailsPreview', [
            'campaign' => Campaign::with('images')->findOrFail($request->campaign_id),
            'contents' => $content,
            'user' => $user,
        ]);
    }

    public function finalizeCampaign($id)
    {
        $campaign = Campaign::find($id);

        if ($campaign) {
            $campaign->status = "pending";
            $campaign->save();
        }

        return inertia::render('Campaign/CampaignPending');

    }

    public function deleteCampaignInfo(Request $request)
    {

        $content = CampaignContent::findOrFail($request->id);

        $tab = match ($content->type) {
        'updates' => 2,
        'faqs' => 1,
        default => 0,
    };

        $content->delete();

         return redirect()->route('campaigns.create')->with('activeTab', $tab);
    }

    public function insertCampaignUpdate(Request $request)
    {
        $content = CampaignContent::updateOrCreate(['id' => $request->id],[
            'campaign_id' => $request->campaign_id,
            'type' => "updates",
            'content' => $request->input('content'),
        ]);

        $oldMedia = $content->images;

        if ($oldMedia->isNotEmpty()) {
            foreach ($oldMedia as $media) {
                Storage::disk('minio')->delete($media->path);
            }

            $content->images()->delete();
        }

        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                // bikin minio dlu
                $path = $file->store('campaigns/updates/' . $content['campaign_id'], 'minio');
                $mime = $file->getMimeType();

                if (str_starts_with($mime, 'image/')) {
                    Image::create([
                    'path' => $path,
                    'imageable_id' => $content->id,
                    'imageable_type' => CampaignContent::class,
                ]);
                }

                if (str_starts_with($mime, 'video/')) {
                    Video::create([
                    'path' => $path,
                    'videoable_id' => $content->id,
                    'videoable_type' => CampaignContent::class,
                ]);
                }
            }
        }

        return redirect()->route('campaigns.create', ['id' => $content->first()->id])->with('activeTab', 2);
    }

    public function insertFAQContent(Request $request){
        // dd($request->all());
        $campaignId = 0;
        foreach ($request->all() as $dat) {
            CampaignContent::updateOrCreate(['id' => $dat['id']],$dat);
            $campaignId = $dat['id'];

        }

        return redirect()->route('campaigns.create',$campaignId)->with('activeTab', 1);
    }

    public function insertAboutContent(Request $request)
    {
        dd($request->all());
        foreach ($request->all() as $dat) {
            $payload = [
                'campaign_id' => $dat['campaign_id'],
                'type'=> $dat['type'],
                'content'=> null,
                'order_y'=>$dat['order_y'],
            ];

            if ($dat['type'] === 'media') {
                // dd($dat);
                if (isset($dat['content']) && $dat['content'] instanceof \Illuminate\Http\UploadedFile) {

                    if (!empty($dat['id'])) {
                        $existing = CampaignContent::find($dat['id']);
                        if ($existing && $existing->content) {
                            Storage::disk('minio')->delete($existing->content);
                        }
                    }

                    $path = Storage::disk('minio')->put("campaigns/about/" . $dat['campaign_id'], $dat['content']);

                    $payload['content'] = Storage::disk('minio')->url($path);
                } else {
                    $payload['content'] = $dat['content'];
                }
            } else {
                $payload['content'] = $dat['content'];
            }

            CampaignContent::updateOrCreate(
                ['id' => $dat['id'] ?? null],
                $payload
            );
        }

        return redirect()->route('campaigns.create')->with('activeTab', 0);
    }


    public function showMyCampaigns(Request $request)
    {
        $user = auth()->user();

        // Ambil parameter filter
        $category = $request->input('category', 'All');
        $search = $request->input('search', '');
        $sortOrder = $request->input('sort', 'desc');

        // Ambil semua kategori unik (untuk tombol filter di atas)
        $categories = Campaign::where('user_id', $user->id)
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        // Query utama campaign milik user
            $campaigns = Campaign::with('images')->where('user_id', $user->id)->when($category !== 'All', function ($query) use ($category) {
                $query->where('category', $category);
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', $sortOrder)
            ->get();

        return Inertia::render('Campaign/MyCampaign', [
            'campaigns' => $campaigns,
            'categories' => $categories,
            'sortOrder' => $sortOrder,
        ]);
    }

}
