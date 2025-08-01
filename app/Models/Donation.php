<?php

namespace App\Models;

use App\Enums\DonationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'campaign_id',
        'amount',
        'message',
        'anonymous',
        'status',
    ];

    // A Donation belongs to a User (donor)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // A Donation belongs to a Campaign
    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }
    protected $casts = [
        'status' => DonationStatus::class, // 2. Add the cast
    ];
}
