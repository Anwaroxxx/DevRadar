<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'description', 'city', 'organizer',
        'website', 'event_date', 'category', 'latitude', 'longitude',
        'image', 'is_approved', 'attendees_count', 'approval_status', 'approved_by', 'rejection_reason',
    ];

    protected $casts = [
        'event_date' => 'datetime',
        'is_approved' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'event_tag');
    }

    public function attendees()
    {
        return $this->belongsToMany(User::class, 'event_user')
            ->withPivot('attending', 'saved')
            ->withTimestamps();
    }
}
