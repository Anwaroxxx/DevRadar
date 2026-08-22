<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'content_type',
        'content_id',
        'reason',
        'description',
        'status',
        'admin_id',
        'admin_notes',
        'action_taken',
    ];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    // Get the actual content being reported
    public function getContent()
    {
        return match ($this->content_type) {
            'event' => Event::find($this->content_id),
            'job' => JobListing::find($this->content_id),
            'message' => Message::find($this->content_id),
            'user' => User::find($this->content_id),
            'community_post' => CommunityPost::find($this->content_id),
            'community_comment' => CommunityComment::find($this->content_id),
            default => null,
        };
    }
}
