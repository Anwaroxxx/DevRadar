<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CommunitySnapshot extends Model
{
    use HasFactory;

    protected $fillable = [
        'community_id',
        'followers_count',
        'posts_count',
        'comments_count',
        'engagement_signal'
    ];

    public function community()
    {
        return $this->belongsTo(Community::class);
    }
}
