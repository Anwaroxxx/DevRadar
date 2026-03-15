<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Community extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'description', 'platform', 'join_link',
        'city', 'logo', 'category', 'member_count',
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function followers() {
        return $this->belongsToMany(User::class, 'community_user')->withTimestamps();
    }
}
