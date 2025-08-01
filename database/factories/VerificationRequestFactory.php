<?php

namespace Database\Factories;

use App\Enums\VerificationStatus;
use App\Models\User;
use App\Models\VerificationImage;
use App\Models\VerificationRequest;
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
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'status' => $this->faker->randomElement(VerificationStatus::cases()), // Use Enum cases
            'reviewed_by' => null,
        ];
    }
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => VerificationStatus::Approved,
            'reviewed_by' => User::factory(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => VerificationStatus::Rejected,
            'reviewed_by' => User::factory(),
        ]);
    }

    public function configure(): static
    {
        return $this->afterCreating(function (VerificationRequest $request) {
            // Create the associated verification images
            VerificationImage::factory()->create([
                'verification_request_id' => $request->id,
            ]);
        });
    }
}
