<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleComment extends Model
{
    use HasFactory;
    protected $fillable = [
        'article_id',
        'user_id',
        'content',
    ];

    // An ArticleComment belongs to an Article
    public function article()
    {
        return $this->belongsTo(Article::class, 'article_id');
    }

    // An ArticleComment belongs to a User (commenter)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // An ArticleComment can have many Article Replies
    public function replies()
    {
        return $this->hasMany(ArticleReply::class, 'article_comment_id');
    }
}
