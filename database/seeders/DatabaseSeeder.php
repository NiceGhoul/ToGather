<?php

namespace Database\Seeders;

use App\Enums\CampaignStatus;
use App\Models\User;
use App\Models\Campaign;
use App\Models\Article;
use App\Models\CampaignComment;
use App\Models\CampaignReply;
use App\Models\ArticleComment;
use App\Models\ArticleReply;
use App\Models\Comment;
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
        // 1. Create exactly 20 Users first. This is now the only place users are created.
        User::factory(15)->create();
        User::factory(5)->admin()->create();

        // 2. Create Articles and Campaigns.
        // Their factories will now automatically pick from the 20 existing users.
        $articles = Article::factory(20)->create();
        $campaigns = Campaign::factory(20)->create();

        // 3. Create Comments and Replies Polymorphically
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

        // 4. Create Donations
        Donation::factory(100)->create();

        // 5. Create Verification Requests
        VerificationRequest::factory(15)->create();
    }
}
