<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Campaign;
use App\Models\Lookup;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    public function index()
    {

        $userId = auth()->id();
        // 🟣 Ambil campaign yang status-nya active (misal 6 teratas)
        $featuredCampaign = Campaign::with('user')
            ->where('status', 'active')
            ->withCount([
                'likes as likes_count' => function ($query) {
                    $query->where('likes_type', 'App\\Models\\Campaign');
                },
            ])
            ->orderByDesc('likes_count')
            ->first(['id', 'title', 'category', 'goal_amount', 'collected_amount', 'address', 'description', 'user_id']);


        // 🟣 Ambil recommended campaign (acak)
        $recommendedCampaigns = Campaign::with('user')
            ->where('status', 'active')
            ->inRandomOrder()
            ->take(18) // buat 3 page, 4 item per page
            ->get();

        // 🟣 Ambil kategori campaign dari lookup
        $categories = Lookup::where('lookup_type', 'CampaignCategory')
            ->take(6)
            ->get();

        // Tambahkan flag apakah user sudah like
        if ($featuredCampaign) {
            $featuredCampaign->is_liked = $userId
                ? $featuredCampaign->likes->contains('user_id', $userId)
                : false;
        }



        $recommendedArticles = Article::with([
            'user',
            'thumbnailImage',
            'contents' => fn($q) =>
                $q->where('type', 'paragraph')->orderBy('order_y')->limit(1)
        ])->where('status', 'approved')
            ->withCount('likes')
            ->orderByDesc('likes_count')
            ->take(4)
            ->get()
            ->map(function ($article) {
                if ($article->thumbnail) {
                    $article->thumbnail_url = Storage::disk('minio')->url($article->thumbnail);
                }
                if ($article->thumbnailImage) {
                    $article->thumbnail_url = $article->thumbnailImage->url;
                }
                return $article;
            });




        return Inertia::render('Home', [
            'featuredCampaign' => $featuredCampaign,
            'recommendedCampaigns' => $recommendedCampaigns,
            'categories' => $categories,
            'recommendedArticles' => $recommendedArticles,
        ]);
    }
}
