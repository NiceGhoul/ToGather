<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Jalankan seeder.
     */
    public function run(): void
    {
        // Admin User
        User::updateOrCreate(
            ['email' => 'admin@email.com'],
            [
                'nickname' => 'Admin',
                'address' => 'ToGather HQ',
                'password' => Hash::make('Admin1234'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );
        // Regular User
        User::updateOrCreate(
            ['email' => 'user@email.com'],
            [
                'nickname' => 'bas',
                'address' => 'bas home',
                'password' => Hash::make('User123123'),
                'role' => 'user',
                'status' => 'active',
            ]
        );
    }
}
