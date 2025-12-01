<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Lookup Data
        $this->call(LookupSeeder::class);

        // 2. Create ONLY manual users (1 regular user + 1 admin)
        $this->call(UserSeeder::class);

        // 3. Create Articles and Campaigns using manual seeders
        $this->call(ArticleSeeder::class);
        $this->call(CampaignSeeder::class);
    }
}
