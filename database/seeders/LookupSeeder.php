<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lookup;

class LookupSeeder extends Seeder
{
    public function run(): void
    {
        // === Article Categories ===
        Lookup::insert([
            [
                'lookup_type' => 'ArticleCategory',
                'lookup_code' => 'BUSINESS',
                'lookup_description' => 'Article Category Dropdown Business',
                'lookup_value' => 'Business',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'lookup_type' => 'ArticleCategory',
                'lookup_code' => 'TECH',
                'lookup_description' => 'Article Category Dropdown Technology',
                'lookup_value' => 'Technology',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'lookup_type' => 'ArticleCategory',
                'lookup_code' => 'EDU',
                'lookup_description' => 'Article Category Dropdown Education',
                'lookup_value' => 'Education',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // campaigns
            ,
            [
                'lookup_type' => 'CampaignCategory',
                'lookup_code' => 'F&B',
                'lookup_description' => 'category for create or filter',
                'lookup_value' => 'Foods & Beverage',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'lookup_type' => 'CampaignCategory',
                'lookup_code' => 'B&C',
                'lookup_description' => 'category for create or filter',
                'lookup_value' => 'Beauty & Cosmetic',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'lookup_type' => 'CampaignCategory',
                'lookup_code' => 'C&F',
                'lookup_description' => 'category for create or filter',
                'lookup_value' => 'Clothes & Fashion',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'lookup_type' => 'CampaignCategory',
                'lookup_code' => 'SERVICE',
                'lookup_description' => 'category for create or filter',
                'lookup_value' => 'Services',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'lookup_type' => 'CampaignCategory',
                'lookup_code' => 'LIFE',
                'lookup_description' => 'category for create or filter',
                'lookup_value' => 'Lifestyle',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'lookup_type' => 'CampaignCategory',
                'lookup_code' => 'LOG',
                'lookup_description' => 'category for create or filter',
                'lookup_value' => 'Logistics',
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}
