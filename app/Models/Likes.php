<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Likes extends Model
{
    /** @use HasFactory<\Database\Factories\LikesFactory> */
    use HasFactory;
    protected $fillable = [
        'user_id',
        'likes_id',
        'likes_type',
    ];

    public function likes() {
        return $this-> morphTo();
    }

     public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
