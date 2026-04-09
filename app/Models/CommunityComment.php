<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CommunityComment extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'community_post_id', 'content'];

    public function user() { return $this->belongsTo(User::class)->withTrashed(); }
    public function post() { return $this->belongsTo(CommunityPost::class, 'community_post_id'); }
}
