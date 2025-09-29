<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['campaign_approved', 'campaign_rejected', 'donation_received', 'verification_approved']),
            'title' => fake()->sentence(3),
            'message' => fake()->sentence(),
            'data' => null,
            'read_at' => fake()->optional()->dateTime(),
        ];
    }
}
