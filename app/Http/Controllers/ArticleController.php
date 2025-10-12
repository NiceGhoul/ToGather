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
        'content' => 'required|string',
        'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'category' => 'required|string|max:100',
        'attachment' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
    ]);
    $filePath = null;
    if ($request->hasFile('attachment')) {
        $filePath = $request->file('attachment')->store('article', 'public');
    }

    $thumbnailPath = null;

    if ($request->hasFile('thumbnail')) {
        $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
    }

    $article = Article::create([
        'user_id' => auth()->id(),
        'title' => $validated['title'],
        'content' => $validated['content'],
        'thumbnail' => $thumbnailPath,
        'category' => $validated['category'],
        'attachment' => $filePath,
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
        ->findOrFail($id, ['id', 'title', 'content', 'thumbnail', 'user_id', 'created_at']);

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
}
