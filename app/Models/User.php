<?php

namespace App\Models;

use App\Services\AchievementSync;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;
    protected $fillable = [
        'name', 'email', 'password', 'username', 'bio', 'avatar',
        'github_url', 'location', 'city', 'xp', 'role', 'last_login_at', 'ai_access_until',
    ];

    protected $hidden = ['password', 'remember_token'];
    protected $appends = ['is_admin'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at'     => 'datetime',
            'ai_access_until'   => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function getHasAiAccessAttribute(): bool
    {
        if (!$this->ai_access_until) return false;
        return $this->ai_access_until->isFuture();
    }

    public function getIsAdminAttribute(): bool
    {
        return $this->role === 'admin';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    // Relationships
    public function events() { return $this->hasMany(Event::class); }
    public function jobListings() { return $this->hasMany(JobListing::class); }
    public function communities() { return $this->hasMany(Community::class); }
    public function activityLogs() { return $this->hasMany(ActivityLog::class); }
    public function badges() { return $this->belongsToMany(Badge::class, 'badge_user')->withTimestamps(); }
    public function skills() { return $this->belongsToMany(Skill::class, 'skill_user'); }
    public function savedEvents() {
        return $this->belongsToMany(Event::class, 'event_user')
                    ->withPivot('attending', 'saved')
                    ->withTimestamps();
    }
    public function followedCommunities() {
        return $this->belongsToMany(Community::class, 'community_user')->withTimestamps();
    }

    public function sentMessages() {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages() {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function followers() {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id')->withTimestamps();
    }

    public function following() {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id')->withTimestamps();
    }

    public function isFollowing(User $user) {
        return $this->following()->where('following_id', $user->id)->exists();
    }

    // XP methods
    public function awardXp(int $amount, string $action, string $description, $loggable = null): void
    {
        $this->increment('xp', $amount);
        $log = ActivityLog::create([
            'user_id'     => $this->id,
            'action'      => $action,
            'description' => $description,
            'xp_change'   => $amount,
            'loggable_id'   => $loggable?->id ?? 0,
            'loggable_type' => $loggable ? get_class($loggable) : 'general',
        ]);
        $this->checkBadges();
    }

    public function spendXp(int $amount, string $action, string $description): bool
    {
        if ($this->xp < $amount) return false;
        $this->decrement('xp', $amount);
        
        ActivityLog::create([
            'user_id'     => $this->id,
            'action'      => $action,
            'description' => $description,
            'xp_change'   => -$amount, // Negative for spending
            'loggable_id'   => 0,
            'loggable_type' => 'marketplace',
        ]);
        
        return true;
    }

    public function checkBadges(): void
    {
        AchievementSync::sync($this);
    }
}
