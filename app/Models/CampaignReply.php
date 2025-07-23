<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignReply extends Model
{
    use HasFactory;
    protected $fillable = [
        'campaign_comment_id',
        'user_id',
        'content',
    ];

    // A Reply belongs to a CampaignComment
    public function campaignComment()
    {
        return $this->belongsTo(CampaignComment::class, 'campaign_comment_id');
    }

    // A Reply belongs to a User (replier)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
