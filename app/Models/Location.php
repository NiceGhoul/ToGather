<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'location_id',
        'campaign_id',
        'lat',
        'lon',
        'address',
        'city_block', // rw
        'village', // keluarahan
        'suburb', // kecamatan
        'city',
        'region', // provinsi
        'country', // negara
        'postcode',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }
}
