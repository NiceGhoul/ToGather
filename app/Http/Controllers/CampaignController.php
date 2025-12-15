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
        $baseStatuses = ['active', 'completed', 'rejected', 'banned', 'inactive'];
        $categories = Lookup::where('lookup_type', 'CampaignCategory')->pluck('lookup_value');
        $campaigns = Campaign::with(['user', 'verifier'])
            ->whereIn('status', $baseStatuses)
            ->when($request->input('status'), function ($query, $status) {
                return $query->where('status', $status);
            })
            ->get();

        return Inertia::render('Admin/Campaign/Campaign_List', [
            'campaigns' => $campaigns,
            'categories' => $categories,
            'filters' => $request->only(['status'])
        ]);
    }
    public function AdminVerification()
    {
        $categories = Lookup::where('lookup_type', 'CampaignCategory')->pluck('lookup_value');
        $campaigns = Campaign::with(['user', 'verifier'])->where('status', 'pending')->get();
        return Inertia::render('Admin/Campaign/Campaign_Verification', [
            'campaigns' => $campaigns,
            'categories' => $categories,
        ]);
    }

    public function AdminDelete($id)
    {
        $campaign = Campaign::find($id);
        $campaign->delete();

        NotificationController::notifyUser(
            $campaign->user_id,
            'campaign_deleted',
            'Campaign Deleted',
            "'{$campaign->title}' has been deleted by Admin.",
            ['campaign_id' => $campaign->id]
        );

        return redirect()->route('admin.campaign.adminIndex')->with('success', 'Campaign deleted!');

    }


    public function AdminChangeStatus(Request $request, $id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->update(['status' => $request->status]);
        if ($campaign->status === "pending" && $request->status === "active") {
            if (empty($campaign->start_campaign) && empty($campaign->end_campaign)) {
                $start = now();
                $end = now()->addDays((int) $campaign->duration);
                $campaign->update([
                    'start_campaign' => $start,
                    'end_campaign' => $end,
                ]);
            }
        }

        // Notify user about article approval
        NotificationController::notifyUser(
            $campaign->user_id,
            "campaign_{$request->status}",
            'campaign Approved',
            "Your Campaign '{$campaign->title}' status is now: {$request->status}!",
            ['campaign_id' => $campaign->id]
        );

        return redirect()->route('admin.campaign.verification')->with('success', `Campaign status changed to '{$request->status}' !`);
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
            // if ($usersCampaign) {
            //     if ($usersCampaign->status->value === 'pending') {
            //         return inertia('Campaign/CampaignPending');
            //         // If user already has a campaign with the status draft
            //     } else if ($usersCampaign->status->value === 'draft' || $usersCampaign->status->value === 'active') {
            //         $draft =  Campaign::where('id', $id)->where('user_id', Auth::id())->latest()->first();
            //         $location = Location::where('campaign_id', $id)->latest()->first();
            //         // dd($location);
            //         return Inertia::render('Campaign/Create', [
            //             'user_Id' => Auth::id(),
            //             'campaign' => $draft,
            //             'location' => $location,
            //         ]);
            //     }
            // } else {
            if ($id != null) {
                $location = Location::where('campaign_id', $id)->latest()->first();
                return Inertia::render('Campaign/Create', [
                    'user_Id' => Auth::id(),
                    'campaign' => $usersCampaign,
                    'location' => $location,
                ]);
            } else {

                return inertia::render('Campaign/Create', [
                    'user_Id' => Auth::user()->id,
                ]);
            }
            // }
        }

        // return inertia('Verification/Create');
    }


    public function showList()
    {
        $campaigns = Campaign::with('images')->whereIn('status', ['completed', 'active'])->get();
        $lookups = Lookup::all();

        return inertia::render('Campaign/CampaignList', [
            'campaigns' => $campaigns,
            'lookups' => $lookups,
        ]);
    }

    public function showLiked()
    {
        $liked = Likes::where('likes_type', 'App\Models\Campaign')->where('user_id', Auth::id())->pluck('likes_id');
        $campaigns = Campaign::whereIn('id', $liked)->with('images')->get()->map(function ($campaign) {
            // Extract thumbnail_url dari images relation
            $thumbnail = $campaign->images->first();
            $campaign->thumbnail_url = $thumbnail ? Storage::disk('minio')->url($thumbnail->path) : null;
            return $campaign;
        });

        return inertia('Campaign/LikedCampaign', [
            'likedCampaign' => $campaigns,
        ]);
    }

    public function getCampaignDetails($id)
    {
        $user = auth()->user();
        $donations = Donation::with(['user.images'])->where('campaign_id', $id)->where('status', 'successful')->get();
        if (!$user) {
            $likes = false;
        } else {
            $likes = $user->likedItems()->where('likes_id', $id)->where('likes_type', Campaign::class)->exists();
        }

        $campaignData = Campaign::where('id', $id)->with('images', 'locations')->with('user')->latest()->first();
        $content = CampaignContent::with('images', 'videos')->where('campaign_id', $campaignData->id)->get()->map(function ($data) {
            $imageMedia = $data->images->map(function ($img) {
                return [
                    'path' => $img->path,
                    'filetype' => 'image',
                    'url' => Storage::disk('minio')->url($img->path),
                ];
            });

            $videoMedia = $data->videos->map(function ($vid) {
                return [
                    'path' => $vid->path,
                    'filetype' => 'video',
                    'url' => Storage::disk('minio')->url($vid->path),
                ];
            });

            $media = collect($imageMedia)->merge(collect($videoMedia));

            if ($data->type === 'media' && $media->isEmpty()) {
                $media->push([
                    'path' => $data->content,
                    'filetype' => 'image', // You can detect extension too
                    'url' => Storage::disk('minio')->url($data->content),
                ]);
            }

            $data->setAttribute('media', $media);
            $data->unsetRelation('images');
            $data->unsetRelation('videos');

            return $data;
        });
        // dd($content);
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
        // if (auth()->user()->status->value === 'banned' || auth()->user()->status === 'banned') {
        //     return back()->with('error', 'Your account has been banned. You cannot create campaigns.');
        // }

        // $draft = Campaign::where('id', $request->id)->where('user_id', Auth::id())->first();
        // dd($draft);
        // if ($draft) {
        //     $draft->update($data);
        //     $campaign = $draft;
        // } else {
            //     $data['user_id'] = Auth::id();
            //     $data['status'] = 'draft';
            //     $campaign = Campaign::create($data);

            // }

        $data = $request->all();
        $campaign = Campaign::updateOrCreate(
            [
                'id' => $request->id,
                'user_id' => Auth::id(),
            ],
            array_merge($data, [
                'user_id' => Auth::id(),
                'status' => 'draft',
            ])
        );
        // if ($campaign && $request->has('location')) {
        //     $location = $request->input('location');
        //     $location['campaign_id'] = $campaign->id;

        //     $existingLocation = Location::where('campaign_id', $campaign->id)->first();

        //     if ($existingLocation) {
        //         $existingLocation->update($location);
        //     } else {
        //         Location::create($location);
        //     }
        // }

        if ($request->has('location')) {
            $locationData = $request->input('location');

            Location::updateOrCreate(
                [
                    'campaign_id' => $campaign->id,
                ],
                array_merge($locationData, [
                    'campaign_id' => $campaign->id,
                ])
            );
        }

        // Notify admins about new campaign
        NotificationController::notifyAdmins(
            'campaign_created',
            'New Campaign Submitted',
            "New campaign '{$campaign->title}' has been submitted by {$campaign->user->nickname} and a draft has been made.",
            ['campaign_id' => $campaign->id, 'user_id' => $campaign->user_id]
        );
        // dd($campaign);
        return redirect()->route('campaigns.createPreview', $campaign->id);
    }


    public function ToggleLike(Request $request)
    {
        $user = auth()->user();
        $isLiked = false;
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
            $usersCampaign = $user->campaigns()->with('images', 'donations', 'locations')
                ->where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();
            // dd($usersCampaign);
        } else {
            // $usersCampaign = $user->campaigns()
            //     ->whereIn('status', ['pending', 'draft', 'active', 'inactive'])
            //     ->with('images', 'locations')
            //     ->latest()
            //     ->first();
            return;
        }


        return inertia::render('Campaign/CreatePreview', [
            'campaign' => $usersCampaign,
            'user' => $user,
        ]);
    }

    public function getDetailsPreview($id)
    {
        $user = auth()->user();
        $donations = Donation::with(['user.images'])->where('campaign_id', $id)->where('status', 'successful')->get();

        if ($id != null) {
            $usersCampaign = $user->campaigns()->with('images', 'locations')
                ->where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();
        } else {
            // $usersCampaign = $user->campaigns()->with('images', 'locations')
            //     ->whereIn('status', ['pending', 'draft', 'active'])
            //     ->latest()
            //     ->first();
            return;
        }
        $content = [];
        if ($usersCampaign) {
            $content = CampaignContent::with('images', 'videos')->where('campaign_id', $usersCampaign->id)->get()->map(function ($data) {
                $imageMedia = $data->images->map(function ($img) {
                    return [
                        'path' => $img->path,
                        'filetype' => 'image',
                        'url' => Storage::disk('minio')->url($img->path),
                    ];
                });

                $videoMedia = $data->videos->map(function ($vid) {
                    return [
                        'path' => $vid->path,
                        'filetype' => 'video',
                        'url' => Storage::disk('minio')->url($vid->path),
                    ];
                });

                $media = collect($imageMedia)->merge(collect($videoMedia));

                if ($data->type === 'media' && $media->isEmpty()) {
                    $media->push([
                        'path' => $data->content,
                        'filetype' => 'image', // You can detect extension too
                        'url' => Storage::disk('minio')->url($data->content),
                    ]);
                }

                $data->setAttribute('media', $media);
                $data->unsetRelation('images');
                $data->unsetRelation('videos');

                return $data;
            });
        } else {
            $content = [];
        }
        // dd($content);
        return inertia::render('Campaign/CreateDetailsPreview', [
            'campaign' => $usersCampaign,
            'contents' => $content,
            'donations' => $donations,
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
            $campaigns = Campaign::with('images')->where('status', ['completed'])->get();
        } else if ($category === 'All') {
            $campaigns = Campaign::with('images')->whereIn('status', ['active', 'completed'])->get();

        } else {
            $campaigns = Campaign::with('images')->where('category', $category)->whereIn('status', ['active', 'completed'])->get();

        }

        return inertia::render('Campaign/CampaignList', [
            'campaigns' => $campaigns,
            'lookups' => $lookups,
        ]);
    }

    public function uploadSupportingMedia(Request $request)
    {
        // validate gambar
        $request->validate([
            'thumbnail' => ['required', 'mimetypes:image/*', 'max:4096'],
            'logo' => ['nullable', 'exclude_if:logo,null','mimetypes:image/*', 'max:4096'],
            'campaign_id' => 'required|integer|exists:campaigns,id',
        ], [
            'logo.mimetypes' => 'The logo must be a valid image (jpg, png, webp, avif).',
            'thumbnail.mimetypes' => 'The thumbnail must be a valid image (jpg, png, webp, avif).',
        ]);


        foreach (['thumbnail', 'logo'] as $data) {
            if ($request->hasFile($data)) {

                $urls = Image::where('imageable_id', $request->campaign_id)
                    ->where('path', 'like', "%_$data.%")
                    ->get();

                foreach ($urls as $path) {
                    Storage::disk('minio')->delete($path->path);
                    $path->delete();
                }

                $ext = $request->file($data)->getClientOriginalExtension();
                $filename = "campaign_{$request->campaign_id}_{$data}." . $ext;

                $path = $request->file($data)->storeAs('campaigns/image', $filename, 'minio');

                Image::create([
                    'path' => $path,
                    'imageable_id' => $request->campaign_id,
                    'imageable_type' => Campaign::class,
                ]);
            }
        }

        CampaignContent::with('images')->where('campaign_id', $request->campaign_id)->get()->map(function ($data) {
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

        return redirect()->route('campaigns.detailsPreview', $request->campaign_id);
        // return Inertia::render('Campaign/CreateDetailsPreview', [
        //     'campaign' => Campaign::with('images')->findOrFail($request->campaign_id),
        //     'co  ntents' => $content,
        //     'user' => $user,
        // ]);
    }

    public function finalizeCampaign($id)
    {
        $campaign = Campaign::find($id);

        if ($campaign) {
            $campaign->status = "pending";
            $campaign->save();
        }

        NotificationController::notifyAdmins(
            'campaign_created',
            'New Campaign Submitted',
            "New campaign '{$campaign->title}' has been submitted by {$campaign->user->nickname} and status has been changed to pending for staff review.",
            ['campaign_id' => $campaign->id, 'user_id' => $campaign->user_id]
        );

        return inertia::render('Campaign/CampaignPending');

    }

    public function deleteCampaignData($id)
    {

        CampaignContent::where('campaign_id', $id)->get()->each->delete();
        $campaign = Campaign::findOrFail($id);
        $campaign->delete();

        //blum ada apus minIO

        NotificationController::notifyUser(
            $campaign->user_id,
            'campaign_deleted',
            'Campaign Deleted',
            "'{$campaign->title}' has been successfully deleted.",
            ['campaign_id' => $campaign->id]
        );

        return redirect()->route('campaigns.showMyCampaigns')->with('success', 'Campaign deleted!');
    }

    public function deleteCampaignInfo($id)
    {
        $content = CampaignContent::find($id);
        $tab = match ($content->type) {
            'updates' => 2,
            'faqs' => 1,
            default => 0,
        };

        $content->delete();

        return redirect()->route('campaigns.detailsPreview', $content->campaign_id)->with('activeTab', $tab);
    }

    public function insertCampaignUpdate(Request $request)
    {
        $content = CampaignContent::updateOrCreate(['id' => $request->id], [
            'campaign_id' => $request->campaign_id,
            'type' => "updates",
            'content' => $request->input('content'),
        ]);



        if ($request->hasFile('media')) {

            $oldMedia = $content->images;

            if ($oldMedia->isNotEmpty()) {
                foreach ($oldMedia as $media) {
                    Storage::disk('minio')->delete($media->path);
                }

                $content->images()->delete();
            }

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

        return redirect()->route('campaigns.detailsPreview', ['id' => $content->campaign_id])->with('activeTab', 2);
    }

    public function insertFAQContent(Request $request)
    {
        // dd($request->all());
        $campaignId = 0;
        foreach ($request->all() as $dat) {
            CampaignContent::updateOrCreate(['id' => $dat['id']], $dat);
            $campaignId = $dat['campaign_id'];
        }

        return redirect()->route('campaigns.detailsPreview', $campaignId)->with('activeTab', 1);
    }

    public function insertAboutContent(Request $request)
    {
        // dd($request->all());
        foreach ($request->all() as $dat) {
            $payload = [
                'campaign_id' => $dat['campaign_id'],
                'type' => $dat['type'],
                'content' => null,
                'order_y' => $dat['order_y'],
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

                    $payload['content'] = $path;
                } else {
                    $payload['content'] = $dat['existing'];
                }
            } else {
                $payload['content'] = $dat['content'];
            }

            CampaignContent::updateOrCreate(
                ['id' => $dat['id'] ?? null],
                $payload
            );
        }
        // dd($request);
        return redirect()->route('campaigns.detailsPreview', $request->all()[0]['campaign_id'])->with('activeTab', 0);
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
