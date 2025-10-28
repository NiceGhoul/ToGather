<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Models\User;
use App\Models\ArticleContent;
use App\Models\Comment;
use App\Models\Image;

class Article extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'title',
        'thumbnail',
        'category',
        'status',
        'rejected_reason',
        'rejected_at',
        'resubmitted_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function contents()
    {
        return $this->hasMany(ArticleContent::class);
    }

    // An Article can have many Comments
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable')->whereNull('parent_id');
    }


    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    // 1 article can have many likes
    public function likes()
    {
        return $this->morphMany(Likes::class, 'likes');
    }
}
