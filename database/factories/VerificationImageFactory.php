<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VerificationImage>
 */
class VerificationImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id_photo_path' => $this->faker->imageUrl(800, 600, 'id-card'),
            'selfie_with_id_path' => $this->faker->imageUrl(800, 450, 'selfie'),
        ];
    }
}
