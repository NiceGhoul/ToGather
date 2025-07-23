<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    public function comments()
    {
        return $this->hasMany(CampaignComment::class, 'campaign_id');
    }

    // A Campaign can have many Donations
    public function donations()
    {
        return $this->hasMany(Donation::class, 'campaign_id');
    }

    // A Campaign can have many Images (many-to-many relationship)
    public function images()
    {
        return $this->belongsToMany(Image::class, 'campaign_images', 'campaign_id', 'image_id')
                    ->withTimestamps(); // If your pivot table has created_at/updated_at
    }
}
