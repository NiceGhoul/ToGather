<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class ProfileImage extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'image_id',
    ];

    // A ProfileImage record belongs to a User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // A ProfileImage record belongs to an Image
    public function image()
    {
        return $this->belongsTo(Image::class, 'image_id');
    }
}
