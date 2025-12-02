<?php

namespace Database\Factories;

use App\Enums\DonationStatus;
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
        $isAnonymous = $this->faker->boolean(30);

        return [
            'user_id' => $isAnonymous ? null : User::inRandomOrder()->first()->id,
            'campaign_id' => $this->faker->randomNumber(1, 11),
            'amount' => $this->faker->randomFloat(0, 10000, 50000000),
            'message' => $this->faker->boolean(70) ? $this->faker->sentence() : null,
            'anonymous' => $isAnonymous,
            'status' => $this->faker->randomElement(DonationStatus::cases()),
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
     * Indicate that the donation is completed/successful.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => DonationStatus::Successful, // Use the correct Enum case
        ]);
    }
}
