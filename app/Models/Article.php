<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\MorphMany;

class Article extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'thumbnail',
        'category',
        'attachment',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
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
}
