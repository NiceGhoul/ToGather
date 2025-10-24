<?php

namespace Database\Factories;

use App\Models\Article;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ArticleContent>
 */
class ArticleContentFactory extends Factory
{
    public function definition(): array
    {
        $type = $this->faker->randomElement(['text', 'image']);
        $dummyImages = [
            'articleImageContent/dummy-1.jpg',
            'articleImageContent/dummy-2.jpg',
            'articleImageContent/dummy-3.jpg',
            'articleImageContent/dummy-4.jpg',
            'articleImageContent/dummy-5.jpg',
        ];

        $content = $type === 'text'
            ? $this->faker->paragraphs(rand(1, 3), true)
            : $this->faker->randomElement($dummyImages);

        $orderX = $this->faker->numberBetween(1, 2);
        $orderY = $this->faker->numberBetween(1, 5);

        return [
            'article_id' => Article::factory(),
            'type' => $type,
            'content' => $content,
            'order_x' => $orderX,
            'order_y' => $orderY,
        ];
    }
    public function firstTextBlock()
    {
        return $this->state(fn () => [
            'type' => 'text',
            'order_x' => 1,
            'order_y' => 1,
            'content' => $this->faker->paragraph(2),
        ]);
    }

    /**
     * Membuat beberapa blok tambahan setelah (1,1)
     * (acak text / image, mulai dari order_y = 1,2,...)
     */
    public function randomAdditionalBlocks($count = 3)
    {
        return collect(range(1, $count))->map(function ($i) {
            $type = $this->faker->randomElement(['text', 'image']);
            return [
                'type' => $type,
                'content' => $type === 'text'
                    ? $this->faker->paragraphs(rand(1, 2), true)
                    : 'images/dummy-' . $this->faker->numberBetween(1, 5) . '.jpg',
                'order_x' => $this->faker->numberBetween(1, 2),
                'order_y' => $i + 1, // mulai dari baris 2 ke atas
            ];
        })->toArray();
    }
}
