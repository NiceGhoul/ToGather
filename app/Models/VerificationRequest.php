<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationRequest extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'id_type',
        'selfie_with_id',
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
}
