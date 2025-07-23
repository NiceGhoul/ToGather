<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $userId = User::inRandomOrder()->first()->id ?? User::factory()->create()->id;

        return [
            'user_id' => $userId,
            'title' => $this->faker->sentence(rand(5, 10)),
            'content' => $this->faker->paragraphs(rand(5, 15), true), // 5-15 paragraphs of content
        ];
    }
}
