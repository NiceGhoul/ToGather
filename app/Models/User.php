<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

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

    // A User can make many Campaign Comments
    public function campaignComments()
    {
        return $this->hasMany(CampaignComment::class, 'user_id');
    }

    // A User can make many Campaign Replies
    public function campaignReplies()
    {
        return $this->hasMany(CampaignReply::class, 'user_id');
    }

    // A User can make many Article Comments
    public function articleComments()
    {
        return $this->hasMany(ArticleComment::class, 'user_id');
    }

    // A User can make many Article Replies
    public function articleReplies()
    {
        return $this->hasMany(ArticleReply::class, 'user_id');
    }

    // A User can have many Donations
    public function donations()
    {
        return $this->hasMany(Donation::class, 'user_id');
    }

    // A User has one ProfileImage pivot record
    public function profileImagePivot()
    {
        return $this->hasOne(ProfileImage::class, 'user_id');
    }

    // A User has one actual Image as a profile picture (through the pivot)
    public function profilePicture()
    {
        return $this->hasOneThrough(Image::class, ProfileImage::class, 'user_id', 'id', 'id', 'image_id');
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
        ];
    }
}
