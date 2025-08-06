<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Campaign;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'content' => $this->faker->paragraph(rand(1, 4)),
            'parent_id' => null, // Default to a top-level comment
        ];
    }

    // State for attaching to an Article
    public function forArticle(Article $article): static
    {
        return $this->state(fn (array $attributes) => [
            'commentable_id' => $article->id,
            'commentable_type' => Article::class,
        ]);
    }

    // State for attaching to a Campaign
    public function forCampaign(Campaign $campaign): static
    {
        return $this->state(fn (array $attributes) => [
            'commentable_id' => $campaign->id,
            'commentable_type' => Campaign::class,
        ]);
    }
}
