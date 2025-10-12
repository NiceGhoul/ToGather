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
                'lookup_description' => 'Article Category Business',
                'lookup_value' => 'Business',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'lookup_type' => 'ArticleCategory',
                'lookup_code' => 'TECH',
                'lookup_description' => 'Article Category Technology',
                'lookup_value' => 'Technology',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'lookup_type' => 'ArticleCategory',
                'lookup_code' => 'EDU',
                'lookup_description' => 'Article Category Education',
                'lookup_value' => 'Education',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
