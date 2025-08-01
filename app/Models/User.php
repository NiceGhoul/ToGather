<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Enums\UserRole;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'nickname',
        'email',
        'address',
        'password',
        'role',
        'status'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function campaigns()
    {
        return $this->hasMany(Campaign::class, 'user_id');
    }

    // A User can verify many Campaigns (as the 'verified_by' user)
    public function verifiedCampaigns()
    {
        return $this->hasMany(Campaign::class, 'verified_by');
    }

    // A User can create many Articles
    public function articles()
    {
        return $this->hasMany(Article::class, 'user_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // A User can have many Donations
    public function donations()
    {
        return $this->hasMany(Donation::class, 'user_id');
    }

    // Add to User.php
    public function profileImage(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    // A User can have many Verification Requests
    public function verificationRequests()
    {
        return $this->hasMany(VerificationRequest::class, 'user_id');
    }

    // A User can review many Verification Requests (as the 'reviewed_by' user)
    public function reviewedVerificationRequests()
    {
        return $this->hasMany(VerificationRequest::class, 'reviewed_by');
    }


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'status' => UserStatus::class,
        ];
    }
}
