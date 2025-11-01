<?php

namespace App\Models;

use App\Models\Article;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'type',
        'content',
        'order_x',
        'order_y',
    ];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function image()
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}
