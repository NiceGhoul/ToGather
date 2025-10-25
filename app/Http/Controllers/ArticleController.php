<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleContent;

use App\Models\Lookup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        $articles = Article::with(['user', 'contents'])
            ->where('status', 'approved')
            // Filter Category
            ->when($filterCategory, function ($q) use ($filterCategory) {
                $q->where('category', $filterCategory);
            })
            // Filter Search Qeuery
            ->when($searchQuery, function ($q) use ($searchQuery) {
                $q->where(function ($qq) use ($searchQuery) {
                    $qq->where('title', 'like', "%{$searchQuery}%")
                        ->orWhereHas('contents', function ($qc) use ($searchQuery) {
                            $qc->where('type', 'text')
                                ->where('content', 'like', "%{$searchQuery}%");
                        });
                });
            })
            // Sort Order
            ->orderBy('created_at', $sortOrder)
            ->get();
        return inertia('Article/Index', [
            'articles' => $articles,
            'categories' => $categories,
            'selectedCategory' => $filterCategory,
            'sortOrder' => $sortOrder,
            'searchQuery' => $searchQuery,
        ]);
    }

    public function ToggleLike(Request $request)
    {
        $user = auth()->user();
        $campaignId = $request->campaign_id;

        $existing = $user->likedItems()->where('likes_id', $campaignId)->where('likes_type', Article::class)->first();

        if ($existing) {
            $existing->delete();
        } else {
            $user->likedItems()->create([
                'likes_id' => $campaignId,
                'likes_type' => Article::class,
            ]);
        }
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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096',
            'contents' => 'required|array|min:1',
            'contents.*.type' => 'required|in:text,image',
            'contents.*.content' => 'nullable', //teks or image path
            'contents.*.order_x' => 'required|integer',
            'contents.*.order_y' => 'required|integer',
        ]);

        // Save Thumbnail
        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('articleThumbnail', 'public');
        }

        // Create Article
        $article = Article::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'category' => $validated['category'],
            'thumbnail' => $thumbnailPath,
            'status' => 'pending',
        ]);

        // Iterate every grid for content
        foreach ($request->input('contents') as $i => $block) {
            $type = $block['type'];

            $contentValue = null;

            // find image path, if type is image
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
        $path = $request->file('file')->store('articleImageContent', 'public');
        return response()->json([
            'url' => asset('storage/' . $path),
        ]);
    }




    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $article = Article::with(['user', 'contents'])
            ->findOrFail($id, ['id', 'title', 'thumbnail', 'user_id', 'category', 'created_at']);

        return inertia('Article/Details', [
            'article' => $article,
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
    public function update(Request $request, Article $article)
    {
        //
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

    public function adminIndex(Request $request)
    {

        $category = $request->query('category');
        $status = $request->query('status');
        $search = $request->query('search');
        if ($status === 'rejected') {
            $articles = Article::with('user')
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
            $articles = Article::with('user')
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
            'contents' => function ($q) {
                $q->orderBy('order_y')->orderBy('order_x');
            },
        ])->findOrFail($id);

        return inertia('Admin/Article/Article_View', [
            'article' => $article,
        ]);
    }

    public function adminApprove($id)
    {
        $article = Article::findOrFail($id);
        $article->update(['status' => 'approved']);

        return back()->with('success', 'Article approved!');
    }

    public function adminDisable($id)
    {
        $article = Article::findOrFail($id);
        $article->update(['status' => 'disabled']);

        return back()->with('success', 'Article disabled!');
    }

    public function adminReject($id)
    {
        $article = Article::findOrFail($id);
        $article->update(['status' => 'rejected']);

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

        Article::whereIn('id', $validated['ids'])->update(['status' => 'approved']);

        return back()->with('success', 'Selected articles approved!');
    }

    public function adminBulkDisable(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|distinct|exists:articles,id',
        ]);

        Article::whereIn('id', $validated['ids'])->update(['status' => 'disabled']);

        return back()->with('success', 'Selected articles disabled!');
    }

    public function adminBulkReject(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|distinct|exists:articles,id',
        ]);

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
                $path = $request->file('thumbnail')->store('articleThumbnail', 'public');
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
                    $path = $file->store('articleImageContent', 'public');
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
