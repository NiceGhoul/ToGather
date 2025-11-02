<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'location_id',
        'campaign_id',
        'lat',
        'long',
        'address',
        'city_block', // rw
        'village', // keluarahan
        'suburb', // kecamatan
        'city',
        'region', // provinsi
        'postcode',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }
}
