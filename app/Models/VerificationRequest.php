<?php

namespace App\Models;

use App\Enums\VerificationStatus;
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
    public function images(): HasOne
    {
        return $this->hasOne(VerificationImage::class);
    }
    protected $casts = [
        'status' => VerificationStatus::class, // 2. Add the cast
    ];
}
