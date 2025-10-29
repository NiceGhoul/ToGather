<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleContent;
use App\Models\Image;
use App\Models\Lookup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\NotificationController;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $categories = Lookup::where('lookup_type', 'ArticleCategory')->pluck('lookup_value');
        //Get Query Params
        $filterCategory = $request->query('category');
        $sortOrder = $request->query('sort', 'desc');
        $searchQuery = $request->query('search');

        // Main Query
        $articles = Article::with(['user', 'contents.image', 'thumbnailImage'])
            ->where('status', 'approved')
            // Filter Category
            ->when($filterCategory, function ($q) use ($filterCategory) {
                $q->where('category', $filterCategory);
            })
            // Filter Search Query
            ->when($searchQuery, function ($q) use ($searchQuery) {
                $q->where(function ($qq) use ($searchQuery) {
                    $qq->where('title', 'like', "%{$searchQuery}%")
                        ->orWhereHas('contents', function ($qc) use ($searchQuery) {
                            $qc->where('type', 'text')
                                ->where('content', 'like', "%{$searchQuery}%");
                        });
                });
            })
            ->withCount('likes')
            ->orderBy('created_at', $sortOrder)
            ->get()
            // Transform articles to include image URLs and like status
            ->map(function ($article) {
                // Add image URLs
                if ($article->thumbnailImage) {
                    $article->thumbnail_url = $article->thumbnailImage->url;
                }
                $article->contents->transform(function ($content) {
                    if ($content->type === 'image' && $content->image) {
                        $content->image_url = $content->image->url;
                    }
                    return $content;
                });
                
                // Add like status
                $article->is_liked_by_user = auth()->check()
                    ? $article->likes()->where('user_id', auth()->id())->exists()
                    : false;
                    
                return $article;
            });

        return inertia('Article/Index', [
            'articles' => $articles,
            'categories' => $categories,
            'selectedCategory' => $filterCategory,
            'sortOrder' => $sortOrder,
            'searchQuery' => $searchQuery,
        ]);
    }



    public function toggleLike($id)
    {
        $article = Article::findOrFail($id);
        $user = auth()->user();

        // check if user already liked
        $existingLike = $article->likes()->where('user_id', $user->id)->first();

        if ($existingLike) {
            // if already like
            $existingLike->delete();
            $isLiked = false;
        } else {
            // if havent like
            $article->likes()->create(['user_id' => $user->id]);
            $isLiked = true;
        }

        // count all like
        $likeCount = $article->likes()->count();

        return response()->json([
            'isLiked' => $isLiked,
            'likeCount' => $likeCount,
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
            $categories = Lookup::where('lookup_type', 'ArticleCategory')->pluck('lookup_value');
            return inertia('Article/Create', [
                'categories' => $categories,
            ]);
        }

        return inertia('Verification/Create');
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        // Check if user is banned
        if (auth()->user()->status->value === 'banned' || auth()->user()->status === 'banned') {
            return back()->with('error', 'Your account has been banned. You cannot create articles.');
        }
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096',
            'contents' => 'required|array|min:1',
            'contents.*.type' => 'required|in:text,image',
            'contents.*.content' => 'nullable', //text or image path
            'contents.*.order_x' => 'required|integer',
            'contents.*.order_y' => 'required|integer',
        ]);

        // Save Thumbnail to images table
        $thumbnailImageId = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('article/thumbnail', 'minio');
            $thumbnailImage = Image::create([
                'path' => $thumbnailPath,
                'imageable_id' => null, // Will be set after article creation
                'imageable_type' => Article::class,
            ]);
            $thumbnailImageId = $thumbnailImage->id;
        }

        // Create Article
        $article = Article::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'category' => $validated['category'],
            'thumbnail' => $thumbnailImageId,
            'status' => 'pending',
        ]);

        // Update thumbnail image with article ID
        if ($thumbnailImageId) {
            Image::where('id', $thumbnailImageId)->update(['imageable_id' => $article->id]);
        }

        // Iterate every grid for content
        foreach ($request->input('contents') as $i => $block) {
            $type = $block['type'];

            $contentValue = null;

            // find image, if type is image
            if ($type === 'image' && $request->hasFile("contents.$i.content")) {
                $file = $request->file("contents.$i.content");
                $path = $file->store('article/image', 'minio');
                
                // Create image record
                $image = Image::create([
                    'path' => $path,
                    'imageable_id' => $article->id,
                    'imageable_type' => Article::class,
                ]);
                
                $contentValue = $image->id;
            } else {
                $contentValue = $block['content'] ?? null;
            }

            ArticleContent::create([
                'article_id' => $article->id,
                'type' => $type,
                'content' => $contentValue,
                'order_x' => $block['order_x'],
                'order_y' => $block['order_y'],
            ]);
        }

        // Notify admins about new article
        NotificationController::notifyAdmins(
            'article_created',
            'New Article Submitted',
            "New article '{$article->title}' has been submitted by {$article->user->nickname} and is pending review.",
            ['article_id' => $article->id, 'user_id' => $article->user_id]
        );
        
        return redirect()
            ->route('articles.create')
            ->with('success', 'Article created successfully!');
    }

    public function uploadContentImage(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:4096',
            'old_path' => 'nullable|string',
        ]);

        // Delete Old File if exists
        if ($request->old_path) {
            $relativePath = str_replace(asset('storage') . '/', '', $request->old_path);
            $fullPath = storage_path('app/public/' . $relativePath);

            if (file_exists($fullPath)) {
                @unlink($fullPath);
            }
        }
        $path = $request->file('file')->store('article/image', 'minio');
        
        // Create image record
        $image = Image::create([
            'path' => $path,
            'imageable_id' => null, // Will be set when article is created
            'imageable_type' => Article::class,
        ]);
        
        return response()->json([
            'url' => Storage::disk('minio')->url($path),
            'image_id' => $image->id,
        ]);
    }




    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $article = Article::with(['user', 'contents.image', 'thumbnailImage', 'likes'])
            ->withCount('likes')
            ->findOrFail($id);

        // Transform article to include image URLs and like status
        if ($article->thumbnailImage) {
            $article->thumbnail_url = $article->thumbnailImage->url;
        }
        $article->contents->transform(function ($content) {
            if ($content->type === 'image' && $content->image) {
                $content->image_url = $content->image->url;
            }
            return $content;
        });
        
        // Add like status
        $article->is_liked_by_user = auth()->check()
            ? $article->likes()->where('user_id', auth()->id())->exists()
            : false;

        return inertia('Article/Details', [
            'article' => $article,
        ]);
    }

    public function showMyArticles(Request $request)
    {
        $user = auth()->user();

        $articles = Article::with(['user', 'contents.image', 'thumbnailImage'])
            ->where('user_id', $user->id)
            ->withCount('likes')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($article) use ($user) {
                // Transform article to include image URLs
                if ($article->thumbnailImage) {
                    $article->thumbnail_url = $article->thumbnailImage->url;
                }
                $article->contents->transform(function ($content) {
                    if ($content->type === 'image' && $content->image) {
                        $content->image_url = $content->image->url;
                    }
                    return $content;
                });
                
                $article->is_liked_by_user = $article->likes()
                    ->where('user_id', $user->id)
                    ->exists();
                return $article;
            });

        return inertia('Article/MyArticle', [
            'articles' => $articles,
        ]);
    }




    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function userUpdate(Request $request, $id)
    {
        $article = Article::where('id', $id)
            ->where('user_id', auth()->id()) // pastikan hanya owner
            ->firstOrFail();

        $validated = $request->validate([
            'contents' => 'required|array|min:1',
            'contents.*.type' => 'required|in:text,image',
            'contents.*.content' => 'nullable',
            'contents.*.order_x' => 'required|integer',
            'contents.*.order_y' => 'required|integer',
        ]);

        DB::transaction(function () use ($request, $article, $validated) {
            // reset status agar masuk review lagi
            $article->update(['status' => 'pending']);

            // hapus semua konten lama
            $article->contents()->delete();

            // simpan ulang konten baru
            foreach ($request->input('contents', []) as $i => $block) {
                $type = $block['type'];
                $contentValue = null;

                if ($type === 'image' && $request->hasFile("contents.$i.content")) {
                    $file = $request->file("contents.$i.content");
                    $path = $file->store('articleImageContent', 'public');
                    $contentValue = $path;
                } else {
                    $contentValue = $block['content'] ?? null;
                }

                ArticleContent::create([
                    'article_id' => $article->id,
                    'type' => $type,
                    'content' => $contentValue,
                    'order_x' => $block['order_x'],
                    'order_y' => $block['order_y'],
                ]);
            }
        });

        // Notify user about article update
        NotificationController::notifyUser(
            $article->user_id,
            'article_resubmitted',
            'Article Resubmitted',
            "Your article '{$article->title}' has been updated and resubmitted for review. It is now pending admin approval.",
            ['article_id' => $article->id]
        );
        
        // Notify admins about article update
        NotificationController::notifyAdmins(
            'article_updated',
            'Article Updated',
            "Article '{$article->title}' has been updated by {$article->user->nickname} and is pending review again.",
            ['article_id' => $article->id, 'user_id' => $article->user_id]
        );
        
        return back()->with('success', 'Your article has been updated and sent for review again!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        //
    }

    /**
     * Upload files and return the file URLs.
     */
    public function upload(Request $request)
    {
        if ($request->hasFile('files')) {
            $file = $request->file('files')[0];
            $path = $file->store('public/images');
            $url = asset(str_replace('public/', 'storage/', $path));
            return response()->json([
                'files' => [$url]
            ]);
        }
        return response()->json(['error' => 'No file uploaded'], 400);
    }

    public function serveImage($path)
    {
        if (!Storage::disk('minio')->exists($path)) {
            abort(404);
        }
        
        $file = Storage::disk('minio')->get($path);
        $mimeType = Storage::disk('minio')->mimeType($path);
        
        return response($file, 200)->header('Content-Type', $mimeType);
    }

    public function adminIndex(Request $request)
    {

        $category = $request->query('category');
        $status = $request->query('status');
        $search = $request->query('search');
        if ($status === 'rejected') {
            $articles = Article::with(['user', 'thumbnailImage'])
                ->whereIn('status', ['rejected',])
                ->when($category, fn($q) => $q->where('category', $category))
                ->when($status, fn($q) => $q->where('status', $status))
                ->when(
                    $search,
                    fn($q) =>
                    $q->where('title', 'like', "%{$search}%")
                )
                ->orderByDesc('created_at')
                ->get();
        } else {
            $articles = Article::with(['user', 'thumbnailImage'])
                ->whereIn('status', ['approved', 'disabled'])
                ->when($category, fn($q) => $q->where('category', $category))
                ->when($status, fn($q) => $q->where('status', $status))
                ->when(
                    $search,
                    fn($q) =>
                    $q->where('title', 'like', "%{$search}%")
                )
                ->orderByDesc('created_at')
                ->get();
        }



        $categories = Lookup::where('lookup_type', 'ArticleCategory')->pluck('lookup_value');

        return inertia('Admin/Article/Article_List', [
            'articles' => $articles,
            'categories' => $categories,
            'filters' => [
                'category' => $category,
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    public function adminRequestIndex()
    {
        $articles = Article::with('user')
            ->where('status', 'pending')
            ->orderByDesc('created_at')
            ->get();

        return inertia('Admin/Article/Article_Verification', [
            'articles' => $articles,
            'viewType' => 'requests',
        ]);
    }

    public function adminViewArticle($id)
    {
        // Eager-load contents so the view can build the full grid.
        // Also order contents by row (order_y) then column (order_x) for predictable layout.
        $article = Article::with([
            'user',
            'contents.image',
            'thumbnailImage',
            'contents' => function ($q) {
                $q->orderBy('order_y')->orderBy('order_x');
            },
        ])->findOrFail($id);

        // Transform article to include image URLs
        if ($article->thumbnailImage) {
            $article->thumbnail_url = $article->thumbnailImage->url;
        }
        $article->contents->transform(function ($content) {
            if ($content->type === 'image' && $content->image) {
                $content->image_url = $content->image->url;
            }
            return $content;
        });

        return inertia('Admin/Article/Article_View', [
            'article' => $article,
        ]);
    }

    public function adminApprove($id)
    {
        $article = Article::findOrFail($id);
        $article->update(['status' => 'approved']);
        
        // Notify user about article approval
        NotificationController::notifyUser(
            $article->user_id,
            'article_approved',
            'Article Approved',
            "Your article '{$article->title}' has been approved and is now published!",
            ['article_id' => $article->id]
        );

        return back()->with('success', 'Article approved!');
    }

    public function adminDisable($id)
    {
        $article = Article::findOrFail($id);
        $article->update(['status' => 'disabled']);
        
        // Notify user about article being disabled
        NotificationController::notifyUser(
            $article->user_id,
            'article_disabled',
            'Article Disabled',
            "Your article '{$article->title}' has been disabled and is no longer visible to the public.",
            ['article_id' => $article->id]
        );

        return back()->with('success', 'Article disabled!');
    }

    public function adminReject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);
        $article = Article::findOrFail($id);
        $article->update([
            'status' => 'rejected',
            'rejected_reason' => $request->reason,
            'rejected_at' => now(),
        ]);
        
        // Notify user about article rejection
        NotificationController::notifyUser(
            $article->user_id,
            'article_rejected',
            'Article Rejected',
            "Your article '{$article->title}' has been rejected. Reason: {$request->reason}",
            ['article_id' => $article->id, 'reason' => $request->reason]
        );

        return back()->with('success', 'Article rejected!');
    }

    public function adminDelete($id)
    {
        $article = Article::findOrFail($id);
        $article->delete();

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'Article deleted!');
    }

    // Bulk actions: expect request with { ids: [1,2,3] }
    public function adminBulkApprove(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|distinct|exists:articles,id',
        ]);

        $articles = Article::whereIn('id', $validated['ids'])->get();
        
        // Notify each user about their article approval
        foreach ($articles as $article) {
            NotificationController::notifyUser(
                $article->user_id,
                'article_approved',
                'Article Approved',
                "Your article '{$article->title}' has been approved and is now published!",
                ['article_id' => $article->id]
            );
        }
        
        Article::whereIn('id', $validated['ids'])->update(['status' => 'approved']);

        return back()->with('success', 'Selected articles approved!');
    }

    public function adminBulkDisable(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|distinct|exists:articles,id',
        ]);

        $articles = Article::whereIn('id', $validated['ids'])->get();
        
        // Notify each user about their article being disabled
        foreach ($articles as $article) {
            NotificationController::notifyUser(
                $article->user_id,
                'article_disabled',
                'Article Disabled',
                "Your article '{$article->title}' has been disabled and is no longer visible to the public.",
                ['article_id' => $article->id]
            );
        }
        
        Article::whereIn('id', $validated['ids'])->update(['status' => 'disabled']);

        return back()->with('success', 'Selected articles disabled!');
    }

    public function adminBulkReject(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|distinct|exists:articles,id',
        ]);

        $articles = Article::whereIn('id', $validated['ids'])->get();
        
        // Notify each user about their article being rejected
        foreach ($articles as $article) {
            NotificationController::notifyUser(
                $article->user_id,
                'article_rejected',
                'Article Rejected',
                "Your article '{$article->title}' has been rejected during bulk review.",
                ['article_id' => $article->id]
            );
        }
        
        Article::whereIn('id', $validated['ids'])->update(['status' => 'rejected']);

        return back()->with('success', 'Selected articles rejected!');
    }

    public function adminBulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|distinct|exists:articles,id',
        ]);

        DB::transaction(function () use ($validated) {
            Article::whereIn('id', $validated['ids'])->delete();
        });

        return redirect()->route('admin.articles.index')->with('success', 'Selected articles deleted!');
    }

    public function adminEdit($id)
    {
        $article = Article::with([
            'user',
            'contents' => function ($q) {
                $q->orderBy('order_y')->orderBy('order_x');
            }
        ])->findOrFail($id);

        $categories = Lookup::where('lookup_type', 'ArticleCategory')->pluck('lookup_value');

        return inertia('Admin/Article/Article_Edit', [
            'article' => $article,
            'categories' => $categories,
        ]);
    }

    public function adminUpdate(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096',
            'contents' => 'required|array|min:1',
            'contents.*.type' => 'required|in:text,image',
            'contents.*.content' => 'nullable',
            'contents.*.order_x' => 'required|integer',
            'contents.*.order_y' => 'required|integer',
        ]);

        DB::transaction(function () use ($request, $article, $validated) {
            // update thumbnail if provided
            if ($request->hasFile('thumbnail')) {
                $path = $request->file('thumbnail')->store('article/thumbnail', 'minio');
                $article->thumbnail = $path;
            }

            $article->title = $validated['title'];
            $article->category = $validated['category'];
            $article->save();

            // Replace contents: remove old then create new blocks
            $article->contents()->delete();

            // Use $request->input('contents') for data and check $request->hasFile for each index to store image files
            $incomingContents = $request->input('contents', []);
            foreach ($incomingContents as $i => $block) {
                $type = $block['type'];
                $contentValue = null;

                if ($type === 'image' && $request->hasFile("contents.$i.content")) {
                    $file = $request->file("contents.$i.content");
                    $path = $file->store('article/image', 'minio');
                    $contentValue = $path;
                } else {
                    // content may be a path string (existing) or HTML string for text
                    $contentValue = $block['content'] ?? null;
                }

                ArticleContent::create([
                    'article_id' => $article->id,
                    'type' => $type,
                    'content' => $contentValue,
                    'order_x' => $block['order_x'],
                    'order_y' => $block['order_y'],
                ]);
            }
        });

        return redirect()
            ->route('admin.articles.view', ['id' => $article->id])
            ->with('success', 'Article updated!');
    }

}
