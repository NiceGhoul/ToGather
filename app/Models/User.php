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

    protected $appends = [
        'profile_image_url',
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

    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    public function getProfileImageUrlAttribute()
    {
        if ($this->relationLoaded('images')) {
            $profileImage = $this->images->filter(function ($image) {
                return str_starts_with($image->path, 'profile/');
            })->first();
        } else {
            $profileImage = $this->images()->where('path', 'LIKE', 'profile/%')->first();
        }
        return $profileImage?->url;
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

    // A User can have many Notifications
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    // user can likes many campaigns
    public function likedItems()
    {
        return $this->hasMany(Likes::class);
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
