<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Image;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected static ?string $password;
    
    public function definition(): array
    {
        return [
            'nickname' => $this->faker->unique()->userName(),
            'email' => $this->faker->unique()->safeEmail(),
            'address' => $this->faker->address(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => UserRole::User, // Use Enum
            'status' => UserStatus::Active, // Use Enum
            'remember_token' => Str::random(10),
        ];
    }
    public function admin(): static
    {
        return $this->state(fn(array $attributes) => [
            'role' => UserRole::Admin, // Use Enum
        ]);
    }

    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => UserStatus::Unverified, // Use Enum
        ]);
    }

    public function configure(): static
    {
        return $this->afterCreating(function (User $user) {
            // Create a profile image for the user
            Image::factory()->create([
                'imageable_id' => $user->id,
                'imageable_type' => User::class,
            ]);
        });
    }
}
