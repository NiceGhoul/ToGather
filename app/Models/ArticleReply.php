<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleReply extends Model
{
    use HasFactory;
    protected $fillable = [
        'article_comment_id',
        'user_id',
        'content',
    ];

    // An ArticleReply belongs to an ArticleComment
    public function articleComment()
    {
        return $this->belongsTo(ArticleComment::class, 'article_comment_id');
    }

    // An ArticleReply belongs to a User (replier)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
