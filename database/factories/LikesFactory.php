<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Campaign;
use App\Models\Likes;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Likes>
 */
class LikesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Likes::class;

    public function definition(): array
    {
         // Randomly decide whether the save belongs to a Campaign or Article
        $likedType = $this->faker->randomElement([Campaign::class, Article::class]);

        // Get a random existing ID of that type
        $likedId = $likedType::inRandomOrder()->first()?->id ?? $likedType::factory()->create()->id;

        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'likes_id' => $likedId,
            'likes_type' => $likedType,
            'created_at' => now(),
        ];
    }
}
