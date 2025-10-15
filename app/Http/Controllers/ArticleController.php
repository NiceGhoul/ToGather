<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Lookup;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $categories = Lookup::where('lookup_type', 'ArticleCategory')->pluck('lookup_value');
        $filterCategory = $request->query('category');
        $sortOrder = $request->query('sort', 'desc');
        $searchQuery = $request->query('search');


        $articles = Article::with('user')
            ->where('status', 'approved')
            ->when($filterCategory, fn($query) => $query->where('category', $filterCategory))
            ->when($searchQuery, fn($query) =>
                $query->where(function ($q) use ($searchQuery) {
                    $q->where('title', 'like', "%{$searchQuery}%")
                      ->orWhere('content', 'like', "%{$searchQuery}%");
                })
            )
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
    // Validate Title n Content
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'category' => 'required|string|max:100',
        'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'content' => 'required_without:attachment|string|nullable',
        'attachment' => 'required_without:content|nullable|file|mimes:pdf|max:5120',


    ]);
    $filePath = null;
    if ($request->hasFile('attachment')) {
        $filePath = $request->file('attachment')->store('articleAttachment', 'public');
    }

    $thumbnailPath = null;

    if ($request->hasFile('thumbnail')) {
        $thumbnailPath = $request->file('thumbnail')->store('articleThumbnail', 'public');
    }

    $article = Article::create([
        'user_id' => auth()->id(),
        'title' => $validated['title'],
        'content' => $validated['content'],
        'thumbnail' => $thumbnailPath,
        'category' => $validated['category'],
        'attachment' => $filePath,
        'status' => 'pending',
    ]);

    return redirect()
        ->route('articles.create')
        ->with('success', 'Article created successfully!');
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
    $article = Article::with('user')
        ->findOrFail($id, ['id', 'title', 'content', 'thumbnail', 'attachment','user_id', 'created_at']);

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

    public function adminApprovedIndex(Request $request)
    {
        $category = $request->query('category');
        $status = $request->query('status');
        $search = $request->query('search');

        $articles = Article::with('user')
        ->whereIn('status', ['approved', 'disabled'])
        ->when($category, fn($q) => $q->where('category', $category))
        ->when($status, fn($q) => $q->where('status', $status))
        ->when($search, fn($q) =>
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
    $article = Article::with('user')->findOrFail($id);
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

}
