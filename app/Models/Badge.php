<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    protected $fillable = ['name', 'icon', 'description', 'requirement', 'xp_threshold'];

    public function users() { return $this->belongsToMany(User::class, 'badge_user')->withTimestamps(); }
}
