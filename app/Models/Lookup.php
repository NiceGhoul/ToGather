<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lookup extends Model
{
    use HasFactory;
    protected $fillable = [
        'lookup_type', //Category (Article Category, Global Functionality, etc)
        'lookup_code', //Unique code for each lookup (TECH, HEALTH, etc)
        'lookup_description', //Description of the lookup
        'lookup_value', //Actual value associated with the lookup (true, false, etc.)
    ];
}
