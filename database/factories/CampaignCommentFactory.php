<?php

namespace Database\Factories;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CampaignComment>
 */
class CampaignCommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $campaignId = Campaign::inRandomOrder()->first()->id ?? Campaign::factory()->create()->id;
        $userId = User::inRandomOrder()->first()->id ?? User::factory()->create()->id;

        return [
            'campaign_id' => $campaignId,
            'user_id' => $userId,
            'content' => $this->faker->paragraph(rand(1, 3)),
        ];
    }
}
