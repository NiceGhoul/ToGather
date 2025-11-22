<?php

namespace App\Models;

use App\Enums\CampaignStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\MorphMany;

class Campaign extends Model
{
    /** @use HasFactory<\Database\Factories\CampaignFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'verified_by',
        'title',
        'description',
        'category',
        'start_campaign',
        'end_campaign',
        'address',
        'status',
        'goal_amount',
        'collected_amount',
        'duration',
        'rejected_reason',
    ];

    protected static function booted()
    {
        static::deleting(function ($campaign) {
            $campaign->images()->delete();
        });
    }

    // A Campaign belongs to a User (creator)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // A Campaign can be verified by a User
    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    // A Campaign can have many Comments
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable')->whereNull('parent_id');
    }

    // A Campaign can have many Donations
    public function donations()
    {
        return $this->hasMany(Donation::class, 'campaign_id');
    }

    // A Campaign can have many Images (many-to-many relationship)
    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    // 1 campaign can have many likes
    public function likes(){
        return $this->morphMany(Likes::class, 'likes');
    }

    // a campaign has one location set
    public function location()
{
    return $this->hasOne(Location::class);
}

    protected $casts = [
        'status' => CampaignStatus::class, // 2. Add the cast
    ];
}
