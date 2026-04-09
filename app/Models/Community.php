<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Community extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'description', 'platform', 'join_link',
        'city', 'latitude', 'longitude', 'logo', 'category', 'member_count',
        'approval_status', 'approved_by', 'rejection_reason',
    ];

    public function user() { return $this->belongsTo(User::class)->withTrashed(); }
    public function followers() {
        return $this->belongsToMany(User::class, 'community_user')->withTimestamps();
    }

    public function posts() {
        return $this->hasMany(CommunityPost::class);
    }

    public function snapshots() {
        return $this->hasMany(CommunitySnapshot::class);
    }
}
