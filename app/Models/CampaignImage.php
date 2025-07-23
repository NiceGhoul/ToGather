<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class CampaignImage extends Pivot
{
    protected $fillable = [
        'campaign_id',
        'image_id',
    ];

    // A CampaignImage record belongs to a Campaign
    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }

    // A CampaignImage record belongs to an Image
    public function image()
    {
        return $this->belongsTo(Image::class, 'image_id');
    }
}
