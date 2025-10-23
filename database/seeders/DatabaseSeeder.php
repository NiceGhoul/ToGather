<?php

namespace Database\Seeders;

use App\Enums\CampaignStatus;
use App\Models\User;
use App\Models\Campaign;
use App\Models\Article;
use App\Models\ArticleContent;
use App\Models\CampaignComment;
use App\Models\CampaignReply;
use App\Models\ArticleComment;
use App\Models\ArticleReply;
use App\Models\Comment;
use App\Models\Image;
use App\Models\Donation;
use App\Models\VerificationRequest;
use App\Models\Lookup;
use Database\Seeders\LookupSeeder;
use Database\Seeders\UserSeeder;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Creata Lookup Data
        $this->call(LookupSeeder::class);

        // 2. Create exactly 20 Users first. This is now the only place users are created.
        User::factory(15)->create();
        User::factory(5)->admin()->create();
        $this->call(UserSeeder::class);

        // 3. Create Articles and Campaigns.
        // Their factories will now automatically pick from the 20 existing users.
        $articles = Article::factory(20)->create()->each(function ($article) {
            // blok pertama wajib teks (1,1)
            ArticleContent::factory()
                ->firstTextBlock()
                ->create(['article_id' => $article->id]);

            // 3 blok tambahan acak
            ArticleContent::factory()
                ->count(3)
                ->create([
                    'article_id' => $article->id,
                    // order_x dan order_y akan diacak
                ]);
        });
        $campaigns = Campaign::factory(20)->create();

        // 4. Create Comments and Replies Polymorphically
        $commentable = $articles->merge($campaigns);

        foreach ($commentable as $model) {
            Comment::factory(rand(2, 5))->create([
                'commentable_id' => $model->id,
                'commentable_type' => get_class($model),
            ]);
        }

        $comments = Comment::all();
        foreach ($comments as $comment) {
            if (rand(0, 1)) {
                Comment::factory(rand(1, 3))->create([
                    'commentable_id' => $comment->commentable_id,
                    'commentable_type' => $comment->commentable_type,
                    'parent_id' => $comment->id,
                ]);
            }
        }

        // 5. Create Donations
        Donation::factory(100)->create();

        // 6. Create Verification Requests
        VerificationRequest::factory(15)->create();



    }
}
