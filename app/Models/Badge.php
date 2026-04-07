<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    protected $fillable = [
        'slug', 'name', 'track', 'level', 'icon', 'icon_key', 'description', 'requirement', 'xp_threshold',
    ];

    public function users() { return $this->belongsToMany(User::class, 'badge_user')->withTimestamps(); }
}
