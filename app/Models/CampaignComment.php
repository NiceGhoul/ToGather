<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignComment extends Model
{
    use HasFactory;
    protected $fillable = [
        'campaign_id',
        'user_id',
        'content',
    ];

    // A CampaignComment belongs to a Campaign
    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }

    // A CampaignComment belongs to a User (commenter)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // A CampaignComment can have many Replies
    public function replies()
    {
        return $this->hasMany(CampaignReply::class, 'campaign_comment_id');
    }
}
