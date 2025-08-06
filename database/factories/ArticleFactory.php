<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Image;
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
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'title' => $this->faker->sentence(rand(5, 10)),
            'content' => $this->faker->paragraphs(rand(5, 15), true),
        ];
    }
    
    public function configure(): static
    {
        return $this->afterCreating(function (Article $article) {
            Image::factory(rand(1,3))->create([
                'imageable_id' => $article->id,
                'imageable_type' => Article::class,
            ]);
        });
    }
}
