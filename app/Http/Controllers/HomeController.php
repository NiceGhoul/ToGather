<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Campaign;
use App\Models\Lookup;
use Inertia\Inertia;

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



        $recommendedArticles = Article::with(['user', 'thumbnailImage'])
            ->where('status', 'approved')
            ->withCount('likes') // hitung jumlah like
            ->orderByDesc('likes_count') // urutkan dari yang paling banyak disukai
            ->take(4)
            ->get()
            ->map(function ($article) {
                // Tambahkan field 'thumbnail_url'
                $article->thumbnail_url = $article->thumbnailImage
                    ? $article->thumbnailImage->url
                    : asset('images/articleBook.jpg');
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
