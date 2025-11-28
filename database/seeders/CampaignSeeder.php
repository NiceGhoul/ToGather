<?php

namespace Database\Seeders;

use App\Models\Campaign;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Campaign::create([
             [
                'user_id'           => 1,
                'verified_by'       => 22,
                'title'             => 'From My Cambodian Kitchen: Home Recipes from the Heart',
                'description'       => `A cookbook preserving Cambodia's heritage with authentic family recipes, vibrant flavors, and stories of culture.`,
                'category'          => 'Education',
                'start_campaign'    => now(),
                'end_campaign'      => now()->addDays(30),
                'address'           => 'Bandung, West Java',
                'status'            => 'active',
                'goal_amount'       => 50000000,
                'collected_amount'  => 2000000,
                'duration'          => 30,
                'rejected_reason'   => null,
                'created_at'        => now(),
                'updated_at'        => now(),
             ],
        ]);
    }
}
