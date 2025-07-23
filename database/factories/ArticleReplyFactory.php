<?php

namespace Database\Factories;

use App\Models\ArticleComment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ArticleReply>
 */
class ArticleReplyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $articleCommentId = ArticleComment::inRandomOrder()->first()->id ?? ArticleComment::factory()->create()->id;
        $userId = User::inRandomOrder()->first()->id ?? User::factory()->create()->id;

        return [
            'article_comment_id' => $articleCommentId,
            'user_id' => $userId,
            'content' => $this->faker->sentence(rand(5, 15)),
        ];
    }
}
