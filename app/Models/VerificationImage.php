<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VerificationImage extends Model
{
    use HasFactory;
    
    protected $fillable = ['verification_request_id', 'id_photo_path', 'selfie_with_id_path'];

    /**
     * Get the verification request that owns the images.
     */
    public function verificationRequest(): BelongsTo
    {
        return $this->belongsTo(VerificationRequest::class);
    }
}

