<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ArticleImage extends Pivot
{
    protected $fillable = [
        'article_id',
        'image_id',
        // Add any other pivot attributes like 'order', 'caption' if they exist
    ];

    // --- Relationships ---

    // An ArticleImage record belongs to an Article
    public function article()
    {
        return $this->belongsTo(Article::class, 'article_id');
    }

    // An ArticleImage record belongs to an Image
    public function image()
    {
        return $this->belongsTo(Image::class, 'image_id');
    }
}
