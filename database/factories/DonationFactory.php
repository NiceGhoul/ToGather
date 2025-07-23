<?php

namespace Database\Factories;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Donation>
 */
class DonationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $campaignId = Campaign::inRandomOrder()->first()->id ?? Campaign::factory()->create()->id;

        // 70% chance of having a user_id, 30% chance of being anonymous (null user_id)
        $isAnonymous = $this->faker->boolean(30);
        $userId = $isAnonymous ? null : (User::inRandomOrder()->first()->id ?? User::factory()->create()->id);

        return [
            'user_id' => $userId,
            'campaign_id' => $campaignId,
            'amount' => $this->faker->randomFloat(2, 10, 1000), // Donation amount between 10 and 1000
            'message' => $this->faker->boolean(70) ? $this->faker->sentence(rand(5, 15)) : null, // 70% chance of a message
            'anonymous' => $isAnonymous,
            'status' => $this->faker->randomElement(['completed', 'pending', 'failed']),
        ];
    }
    public function anonymous(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
            'anonymous' => true,
        ]);
    }

    /**
     * Indicate that the donation is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }
}
