<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Image>
 */
class ImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Generates a placeholder image URL.
            'image_path' => $this->faker->imageUrl(640, 480, 'abstract', true, 'Faker'),
        ];
    }
    public function profile(): static
    {
        return $this->state(fn (array $attributes) => [
            'image_path' => $this->faker->imageUrl(200, 200, 'people', true, 'profile'),
        ]);
    }

    /**
     * Indicate that the image is for a campaign.
     */
    public function campaign(): static
    {
        return $this->state(fn (array $attributes) => [
            'image_path' => $this->faker->imageUrl(800, 600, 'fundraising', true, 'campaign'),
        ]);
    }

    /**
     * Indicate that the image is for an article.
     */
    public function article(): static
    {
        return $this->state(fn (array $attributes) => [
            'image_path' => $this->faker->imageUrl(700, 500, 'news', true, 'article'),
        ]);
    }
}
