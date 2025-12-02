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
use App\Models\Likes;

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

        if ($filterCategory === 'All' || !$filterCategory || $filterCategory == '') {
            $filterCategory = null;
        }

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
                // Thumbnail from Article table (fallback)
                if ($article->thumbnail) {
                    $article->thumbnail_url = Storage::disk('minio')->url($article->thumbnail);
                }

                // Thumbnail from images morph (if exists)
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


    public function showLiked()
    {
        $user = auth()->user();
        // $articles = Article::All();
        // $likes = $articles->likes()->where('user_id', $user->id())->where('likes_id', $articles->id())->get();

        $liked = Likes::with(['user', 'contents.image', 'thumbnailImage', 'likes'])->where('likes_type', 'App\Models\Article')->where('user_id', $user->id)->pluck('likes_id');
        $articles = Article::whereIn('id', $liked)->withCount('likes')->with('user')->get()->map(function ($articles) {

            if ($articles->thumbnail) {
                $articles->thumbnail_url = Storage::disk('minio')->url($articles->thumbnail);
            }

            // Thumbnail from images morph (if exists)
            if ($articles->thumbnailImage) {
                $articles->thumbnail_url = $articles->thumbnailImage->url;
            }
            if ($articles->user->nickname) {
                $articles->nickname = $articles->user->nickname;
            }
            $articles->contents->transform(function ($content) {
                if ($content->type === 'image' && $content->image) {
                    $content->image_url = $content->image->url;
                }
                return $content;
            });
            return $articles;
        });
        return inertia('Article/LikedArticle', [
            'likedArticles' => $articles,
        ]);
    }

    public function toggleLike($id)
    {
        $user = auth()->user();
        dd($user);
        if (!$user) {
            return inertia('Login/Login');
        }
        $article = Article::findOrFail($id);

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

    public function store(Request $request)
    {
        if (auth()->user()->status->value === 'banned' || auth()->user()->status === 'banned') {
            return back()->with('error', 'Your account has been banned. You cannot create articles.');
        }

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

        DB::transaction(function () use ($request, $validated) {
            // 🟣 1. Save thumbnail (optional)
            $thumbnailImageId = null;
            if ($request->hasFile('thumbnail')) {
                $thumbnailPath = $request->file('thumbnail')->store('article/thumbnails', 'minio');
                $thumbnailImage = Image::create(['path' => $thumbnailPath]);
                $thumbnailImageId = $thumbnailImage->id;
            }

            // 🟣 2. Create article
            $article = Article::create([
                'user_id' => auth()->id(),
                'title' => $validated['title'],
                'category' => $validated['category'],
                'thumbnail' => $thumbnailImageId,
                'status' => 'pending',
            ]);

            // 🟣 3. Save contents
            foreach ($request->input('contents') as $i => $block) {
                $type = $block['type'];
                $content = ArticleContent::create([
                    'article_id' => $article->id,
                    'type' => $type,
                    'content' => $type === 'text' ? $block['content'] ?? null : null,
                    'order_x' => $block['order_x'],
                    'order_y' => $block['order_y'],
                ]);

                if ($type === 'image' && $request->hasFile("contents.$i.content")) {
                    $path = $request->file("contents.$i.content")->store('article/content', 'minio');
                    $content->image()->create(['path' => $path]);
                }
            }

            // 🟣 4. Notify admins
            NotificationController::notifyAdmins(
                'article_created',
                'New Article Submitted',
                "New article '{$article->title}' has been submitted by {$article->user->nickname} and is pending review.",
                ['article_id' => $article->id, 'user_id' => $article->user_id]
            );

            // 🟣 5. Notify user (article creator)
            NotificationController::notifyUser(
                $article->user_id,
                'article_submitted',
                'Article Submitted Successfully',
                "Your article '{$article->title}' has been submitted and is pending review by admins.",
                ['article_id' => $article->id]
            );
        });

        return redirect()->route('articles.create')->with('success', 'Article created successfully!');
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


        // Thumbnail from Article table (fallback)
        if ($article->thumbnail) {
            $article->thumbnail_url = Storage::disk('minio')->url($article->thumbnail);
        }

        // Thumbnail from images morph (if exists)
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

        // --- ambil semua kategori (biar bisa muncul di dropdown MyArticle.jsx)
        $categories = Lookup::where('lookup_type', 'ArticleCategory')->pluck('lookup_value');

        // --- ambil query params
        $filterCategory = $request->query('category');
        $sortOrder = $request->query('sort', 'desc');
        $searchQuery = $request->query('search');

        if ($filterCategory === 'All' || !$filterCategory || $filterCategory == '') {
            $filterCategory = null;
        }

        // --- query utama untuk artikel milik user
        $articles = Article::with(['user', 'contents.image', 'thumbnailImage'])
            ->where('user_id', $user->id)
            ->when($filterCategory, function ($q) use ($filterCategory) {
                $q->where('category', $filterCategory);
            })
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
            ->map(function ($article) use ($user) {
                if ($article->thumbnail) {
                    $article->thumbnail_url = Storage::disk('minio')->url($article->thumbnail);
                }

                // Thumbnail from images morph (if exists)
                if ($article->thumbnailImage) {
                    $article->thumbnail_url = $article->thumbnailImage->url;
                }

                // transform content image URL
                $article->contents->transform(function ($content) {
                    if ($content->type === 'image' && $content->image) {
                        $content->image_url = $content->image->url;
                    }
                    return $content;
                });

                // status like per user
                $article->is_liked_by_user = $article->likes()
                    ->where('user_id', $user->id)
                    ->exists();

                return $article;
            });


        return inertia('Article/MyArticle', [
            'articles' => $articles,
            'categories' => $categories,
            'selectedCategory' => $filterCategory,
            'sortOrder' => $sortOrder,
            'searchQuery' => $searchQuery,
        ]);
    }
    public function showMyArticleDetails($id)
    {
        $article = Article::with(['user', 'contents.image', 'thumbnailImage', 'likes'])
            ->withCount('likes')
            ->findOrFail($id);

        if ($article->thumbnail) {
            $article->thumbnail_url = Storage::disk('minio')->url($article->thumbnail);
        }

        // Thumbnail from images morph (if exists)
        if ($article->thumbnailImage) {
            $article->thumbnail_url = $article->thumbnailImage->url;
        }
        $article->contents->transform(function ($content) {
            return [
                'id' => $content->id,
                'type' => $content->type,
                'content' => $content->content,  // WAJIB!
                'order_x' => (int) $content->order_x,
                'order_y' => (int) $content->order_y,
                'image_url' => $content->type === 'image' && $content->image
                    ? $content->image->url
                    : null,
            ];
        });

        // Add like status
        $article->is_liked_by_user = auth()->check()
            ? $article->likes()->where('user_id', auth()->id())->exists()
            : false;

        return inertia('Article/MyArticleDetails', [
            'article' => $article,
        ]);
    }

    public function userEdit($id)
    {
        $article = Article::with(['user', 'contents.image', 'thumbnailImage'])
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // tambahkan URL gambar
        if ($article->thumbnailImage) {
            $article->thumbnail_url = $article->thumbnailImage->url;
        }
        $article->contents->transform(function ($content) {
            if ($content->type === 'image' && $content->image) {
                $content->image_url = $content->image->url;
            }
            return $content;
        });

        return inertia('Article/Edit', [
            'article' => $article,
        ]);
    }



    public function userUpdate(Request $request, $id)
    {
        $article = Article::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();
        $wasRejected = $article->status === 'rejected';
        $updateData = [];

        $validated = $request->validate([
            'contents' => 'required|array|min:1',
            'contents.*.type' => 'required|in:text,image,paragraph',
            'contents.*.content' => 'nullable',
            'contents.*.order_x' => 'required|integer',
            'contents.*.order_y' => 'required|integer',
        ]);

        DB::transaction(function () use ($request, $article, $wasRejected, $updateData) {
            $article->update(['status' => 'pending']);
            $article->contents()->delete();
            if ($wasRejected) {
                $updateData['resubmitted_at'] = now();
            }
            $article->update($updateData);



            foreach ($request->input('contents', []) as $i => $block) {
                $type = $block['type'];

                if ($type === 'text') {
                    $type = 'paragraph';
                }

                $content = ArticleContent::create([
                    'article_id' => $article->id,
                    'type' => $type,
                    'content' => in_array($type, ['text', 'paragraph'])
                        ? ($block['content'] ?? null)
                        : null,
                    'order_x' => $block['order_x'],
                    'order_y' => $block['order_y'],
                ]);

                if ($type === 'image') {

                    // CASE 1 — Upload New Image
                    if ($request->hasFile("contents.$i.content")) {

                        $path = $request->file("contents.$i.content")
                            ->store('article/content', 'minio');

                        $content->image()->create([
                            'path' => $path
                        ]);
                    }

                    // CASE 2 — Existing Image
                    else if (!empty($block['content'])) {

                        $url = $block['content'];


                        $relativePath = preg_replace('/^https?:\/\/[^\/]+\/togather\//', '', $url);

                        $content->image()->create([
                            'path' => $relativePath
                        ]);
                    }
                }
            }



        });

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

        $articles = Article::with(['user', 'thumbnailImage'])
            ->whereIn('status', ['approved', 'disabled', 'rejected'])
            ->when($category, fn($q) => $q->where('category', $category))
            ->when($status, fn($q) => $q->where('status', $status))
            ->when(
                $search,
                fn($q) =>
                $q->where('title', 'like', "%{$search}%")
            )
            ->orderByDesc('created_at')
            ->get();




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

        if ($article->thumbnail) {
            $article->thumbnail_url = Storage::disk('minio')->url($article->thumbnail);
        }

        // Thumbnail from images morph (if exists)
        if ($article->thumbnailImage) {
            $article->thumbnail_url = $article->thumbnailImage->url;
        }
        $article->contents->transform(function ($content) {
            if ($content->type === 'image' && $content->image) {
                $content->image_url = $content->image->url;
            }

            // Tambahkan ini supaya TEXT dikirim
            if ($content->type === 'text' || $content->type === 'paragraph') {
                $content->content = $content->content;  // pastikan tetap dikirim
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

    public function adminEnable($id)
    {
        $article = Article::findOrFail($id);
        $article->update(['status' => 'approved']);

        // Notify user about article approval
        NotificationController::notifyUser(
            $article->user_id,
            'article_approved',
            'Article Approved',
            "Your article '{$article->title}' has been enabled by Admin and is now visible to the public!",
            ['article_id' => $article->id]
        );

        return back()->with('success', 'Article Enabled!');
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
            "Your article '{$article->title}' has been disabled by Admin and is no longer visible to the public.",
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

    public function adminDelete($id, Request $request)
    {
        $article = Article::findOrFail($id);
        $article->delete();

        // Notify user about article deletetion
        NotificationController::notifyUser(
            $article->user_id,
            'article_deleted',
            'Article Deleted',
            "Your article '{$article->title}' has been deleted by Admin.",
            ['article_id' => $article->id]
        );

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
            'reason' => 'nullable|string|max:500',
        ]);
        // dd($validated);
        $articles = Article::whereIn('id', $validated['ids'])->get();
        // dd($articles);

        foreach ($articles as $article) {
            // update status + simpan alasan
            $article->update([
                'status' => 'rejected',
                'rejected_reason' => $validated['reason'] ?? null,
            ]);

            // kirim notifikasi ke user
            NotificationController::notifyUser(
                $article->user_id,
                'article_rejected',
                'Article Rejected',
                "Your article '{$article->title}' has been rejected." .
                ($validated['reason']
                    ? " Reason: {$validated['reason']}"
                    : ""),
                ['article_id' => $article->id]
            );
        }

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
            'contents.*.type' => 'required|in:text,image,paragraph',
            'contents.*.content' => 'nullable',
            'contents.*.order_x' => 'required|integer',
            'contents.*.order_y' => 'required|integer',
        ]);

        DB::transaction(function () use ($request, $article, $validated) {
            if ($request->hasFile('thumbnail')) {
                $path = $request->file('thumbnail')->store('article/thumbnails', 'minio');
                $thumb = Image::create(['path' => $path]);
                $article->thumbnail = $thumb->id;
            }

            $article->update([
                'title' => $validated['title'],
                'category' => $validated['category'],
            ]);

            $article->contents()->delete();

            foreach ($request->input('contents', []) as $i => $block) {
                $type = $block['type'];
                $content = ArticleContent::create([
                    'article_id' => $article->id,
                    'type' => $type,
                    'content' => in_array($type, ['text', 'paragraph'])
                        ? ($block['content'] ?? null)
                        : null,

                    'order_x' => $block['order_x'],
                    'order_y' => $block['order_y'],
                ]);

                if ($type === 'image') {

                    // CASE 1 — Upload New Image
                    if ($request->hasFile("contents.$i.content")) {

                        $path = $request->file("contents.$i.content")
                            ->store('article/content', 'minio');

                        $content->image()->create([
                            'path' => $path
                        ]);
                    }

                    // CASE 2 — Existing Image
                    else if (!empty($block['content'])) {

                        $url = $block['content'];


                        $relativePath = preg_replace('/^https?:\/\/[^\/]+\/togather\//', '', $url);

                        $content->image()->create([
                            'path' => $relativePath
                        ]);
                    }
                }

            }
        });

        return redirect()->route('admin.articles.view', ['id' => $article->id])
            ->with('success', 'Article updated!');
    }


}
