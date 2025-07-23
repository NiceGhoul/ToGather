<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Campaign>
 */
class CampaignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
            // Ensure there's at least one user to associate with
        $userId = User::inRandomOrder()->first()->id ?? User::factory()->create()->id;
        // 50% chance of being verified, ensuring a user exists for verification
        $verifierId = $this->faker->boolean(50) ? (User::inRandomOrder()->first()->id ?? User::factory()->create()->id) : null;
        return [

            'user_id' => $userId,
            'verified_by' => $verifierId,
            'title' => $this->faker->sentence(rand(3, 7)),
            'goal_amount' => $this->faker->randomFloat(2, 1000, 100000), // Goal between 1,000 and 100,000
            'status' => $this->faker->randomElement(['pending', 'active', 'completed', 'cancelled']),
            'description' => $this->faker->paragraphs(rand(2, 5), true), // 2-5 paragraphs
            'collected_amount' => $this->faker->randomFloat(2, 0, 50000), // Collected amount up to 50,000
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'verified_by' => User::inRandomOrder()->first()->id ?? User::factory()->create()->id, // Ensure it has a verifier
        ]);
    }

    /**
     * Indicate that the campaign is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'collected_amount' => $attributes['goal_amount'], // Collected amount equals goal
        ]);
    }
}
