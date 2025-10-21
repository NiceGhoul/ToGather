<?php

namespace Database\Factories;

use App\Enums\CampaignStatus;
use App\Models\Campaign;
use App\Models\Image;
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
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'verified_by' => null,
            'title' => $this->faker->sentence(rand(3, 7)),
            'goal_amount' => $this->faker->randomFloat(2, 1000, 100000),
            'category' => $this->faker->randomElement(['Foods & Beverage', 'Beauty & Cosmetic', 'Clothes & Fashion', 'Services', 'Lifestyle', 'Logistics']),
            'status' => $this->faker->randomElement(CampaignStatus::cases()), // Use Enum
            'description' => $this->faker->paragraphs(rand(2, 5), true),
            'collected_amount' => $this->faker->randomFloat(2, 0, 50000),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => CampaignStatus::Active,
            'verified_by' => User::factory(),
        ]);
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Campaign $campaign) {
            // Create a random number of images for the campaign
            Image::factory(rand(1, 4))->create([
                'imageable_id' => $campaign->id,
                'imageable_type' => Campaign::class,
            ]);
        });
    }
}

