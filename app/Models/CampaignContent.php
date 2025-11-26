<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignContent extends Model
{
    use HasFactory;

     protected $fillable = [
        'campaign_id',
        'type',
        'content',
        'order_y',
    ];

    protected static function booted()
    {
        static::deleting(function ($content) {
            $content->images()->delete();
            $content->videos()->delete();
        });
    }

    // campaign content belongs to campaign model
    public function campaign()
    {
        return $this->belongsTo(Article::class);
    }

    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
    public function videos()
    {
        return $this->morphMany(Video::class, 'videoable');
    }
}
