<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Image;
use App\Models\User;
use App\Models\Lookup;
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
        $thumbnails = [
            'thumbnails/petrik.jpg',
            'thumbnails/tempe.jpg',
            'thumbnails/chindoname.jpg',
        ];
        $categories = Lookup::where('lookup_type', 'ArticleCategory')->pluck('lookup_value')->toArray();
        $randomThumbnail = $this->faker->randomElement($thumbnails);
        $statuses = ['pending', 'approved', 'rejected'];
        $randomStatus = $this->faker->randomElement($statuses);
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'title' => $this->faker->sentence(rand(5, 10)),
            'content' => $this->faker->paragraphs(rand(5, 15), true),
            'thumbnail' => $randomThumbnail,
            'category' => $this->faker->randomElement($categories),
            'attachment' => null,
            'status' => $randomStatus,
            'created_at' => $this->faker->dateTimeBetween('-1 years', 'now'),
            'updated_at' => now(),
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
