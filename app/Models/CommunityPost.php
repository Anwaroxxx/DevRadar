<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CommunityPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'community_id', 'title', 'content', 'code_snippet', 'language', 'upvotes_count'
    ];

    public function user() { return $this->belongsTo(User::class)->withTrashed(); }
    public function community() { return $this->belongsTo(Community::class); }
    public function comments() { return $this->hasMany(CommunityComment::class); }
}
