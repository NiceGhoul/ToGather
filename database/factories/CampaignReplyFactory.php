<?php

namespace Database\Factories;

use App\Models\CampaignComment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CampaignReply>
 */
class CampaignReplyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $campaignCommentId = CampaignComment::inRandomOrder()->first()->id ?? CampaignComment::factory()->create()->id;
        $userId = User::inRandomOrder()->first()->id ?? User::factory()->create()->id;

        return [
            'campaign_comment_id' => $campaignCommentId,
            'user_id' => $userId,
            'content' => $this->faker->sentence(rand(5, 15)),
        ];
    }
}
