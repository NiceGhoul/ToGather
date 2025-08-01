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
        'goal_amount',
        'status',
        'description',
        'collected_amount',
    ];

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
    protected $casts = [
        'status' => CampaignStatus::class, // 2. Add the cast
    ];
}
