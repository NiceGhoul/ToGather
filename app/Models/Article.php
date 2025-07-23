<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'title',
        'content',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // An Article can have many Comments
    public function comments()
    {
        return $this->hasMany(ArticleComment::class, 'article_id');
    }

    // An Article can have many Images (many-to-many relationship)
    public function images()
    {
        return $this->belongsToMany(Image::class, 'article_images', 'article_id', 'image_id')
                    ->withTimestamps(); // If your pivot table has created_at/updated_at
    }
}
