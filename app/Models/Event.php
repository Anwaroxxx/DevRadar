<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'description', 'city', 'organizer',
        'website', 'event_date', 'category', 'latitude', 'longitude',
        'image', 'is_approved', 'attendees_count',
    ];

    protected $casts = [
        'event_date'  => 'datetime',
        'is_approved' => 'boolean',
        'latitude'    => 'float',
        'longitude'   => 'float',
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function tags() { return $this->belongsToMany(Tag::class, 'event_tag'); }
    public function attendees() {
        return $this->belongsToMany(User::class, 'event_user')
                    ->withPivot('attending', 'saved')
                    ->withTimestamps();
    }
}
