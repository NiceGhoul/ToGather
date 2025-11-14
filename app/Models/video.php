<?php

namespace App\Models;

use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class video extends Model
{
    use HasFactory;
    protected $fillable = ['path', 'videoable_id', 'videoable_type'];
    protected $appends = ['url'];
    public function videoable(): MorphTo
    {
        return $this->morphTo();
    }

    public function getUrlAttribute()
    {
        return Storage::disk('minio')->url($this->path);
    }
}
