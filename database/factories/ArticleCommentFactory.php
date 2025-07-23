<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ArticleComment>
 */
class ArticleCommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $articleId = Article::inRandomOrder()->first()->id ?? Article::factory()->create()->id;
        $userId = User::inRandomOrder()->first()->id ?? User::factory()->create()->id;

        return [
            'article_id' => $articleId,
            'user_id' => $userId,
            'content' => $this->faker->paragraph(rand(1, 3)),
        ];
    }
}
