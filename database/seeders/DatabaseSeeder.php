<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Campaign;
use App\Models\Article;
use App\Models\CampaignComment;
use App\Models\CampaignReply;
use App\Models\ArticleComment;
use App\Models\ArticleReply;
use App\Models\Image;
use App\Models\Donation;
use App\Models\VerificationRequest;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->count(10)->create(); 
        $users = User::all();
        Image::factory()->count(20)->create();
        $images = Image::all();
        Campaign::factory()->count(10)->create();
        Campaign::factory()->count(5)->active()->create();
        Campaign::factory()->count(5)->completed()->create();
        $campaigns = Campaign::all();
        Article::factory()->count(15)->create();
        $articles = Article::all();
        $campaigns->each(function ($campaign) use ($images) {
            // Attach 1 to 3 random images to each campaign
            $campaign->images()->attach(
                $images->random(rand(1, min(3, $images->count())))->pluck('id')->toArray()
            );
        });
        $articles->each(function ($article) use ($images) {
            // Attach 1 to 2 random images to each article
            $article->images()->attach(
                $images->random(rand(1, min(2, $images->count())))->pluck('id')->toArray()
            );
        });
        $profileImages = Image::factory()->count(5)->profile()->create(); // Create 5 specific profile images
        $users->take(5)->each(function ($user, $index) use ($profileImages) {
            if (isset($profileImages[$index])) {
                $user->profileImagePivot()->create(['image_id' => $profileImages[$index]->id]);
            }
        });
        CampaignComment::factory()->count(50)->create();
        $campaignComments = CampaignComment::all();

        CampaignReply::factory()->count(100)->create(); 

        ArticleComment::factory()->count(40)->create();
        $articleComments = ArticleComment::all();

        ArticleReply::factory()->count(80)->create();

        Donation::factory()->count(70)->create();
        Donation::factory()->count(10)->anonymous()->create(); 
        Donation::factory()->count(20)->completed()->create();
        VerificationRequest::factory()->count(15)->create();
        VerificationRequest::factory()->count(5)->approved()->create();
        VerificationRequest::factory()->count(3)->rejected()->create();
    }
}
