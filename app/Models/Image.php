<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;
    protected $fillable = [
        'image_path',
    ];

    // An Image can be a profile image for one user (through the profile_images pivot table)
    public function profileImagePivot()
    {
        return $this->hasOne(ProfileImage::class, 'image_id');
    }

    // An Image can belong to many Articles (many-to-many)
    public function articles()
    {
        return $this->belongsToMany(Article::class, 'article_images', 'image_id', 'article_id')
                    ->withTimestamps(); // If your pivot table has created_at/updated_at
    }

    // An Image can belong to many Campaigns (many-to-many)
    public function campaigns()
    {
        return $this->belongsToMany(Campaign::class, 'campaign_images', 'image_id', 'campaign_id')
                    ->withTimestamps(); // If your pivot table has created_at/updated_at
    }
}
