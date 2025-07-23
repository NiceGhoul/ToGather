<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VerificationRequest>
 */
class VerificationRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $userId = User::inRandomOrder()->first()->id ?? User::factory()->create()->id;
        // 50% chance of being reviewed
        $reviewedBy = $this->faker->boolean(50) ? (User::inRandomOrder()->first()->id ?? User::factory()->create()->id) : null;

        return [
            'user_id' => $userId,
            'id_type' => $this->faker->randomElement(['KTP', 'Passport', 'Driving License']),
            'selfie_with_id' => $this->faker->imageUrl(400, 300, 'id', true, 'selfie'),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
            'reviewed_by' => $reviewedBy,
        ];
    }
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'reviewed_by' => User::inRandomOrder()->first()->id ?? User::factory()->create()->id, // Ensure it has a reviewer
        ]);
    }

    /**
     * Indicate that the request is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'reviewed_by' => User::inRandomOrder()->first()->id ?? User::factory()->create()->id, // Ensure it has a reviewer
        ]);
    }
}
