<?php

namespace App\Models;

use App\Enums\VerificationStatus;
use App\Models\Image;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class VerificationRequest extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'status',
        'reviewed_by',
        'id_photo',
        'selfie_with_id',
    ];

    // A VerificationRequest belongs to a User (the requester)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // A VerificationRequest can be reviewed by a User (admin/moderator)
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
    /**
     * Get the ID photo image.
     */
    public function idPhotoImage()
    {
        return $this->belongsTo(Image::class, 'id_photo');
    }

    /**
     * Get the selfie with ID image.
     */
    public function selfieImage()
    {
        return $this->belongsTo(Image::class, 'selfie_with_id');
    }

    /**
     * Get the ID photo URL.
     */
    public function getIdPhotoUrlAttribute()
    {
        return $this->idPhotoImage?->url;
    }

    /**
     * Get the selfie with ID URL.
     */
    public function getSelfieUrlAttribute()
    {
        return $this->selfieImage?->url;
    }
    protected $casts = [
        'status' => VerificationStatus::class, // 2. Add the cast
    ];
}
