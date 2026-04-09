<?php

namespace App\Models;

use App\Services\AchievementSync;
use App\Services\LevelCalculator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;
    protected $fillable = [
        'name', 'email', 'password', 'username', 'bio', 'avatar',
        'github_url', 'location', 'city', 'latitude', 'longitude', 'xp', 'role', 'last_login_at', 'ai_access_until', 'account_status',
        'profile_accent_color', 'profile_theme_style', 'profile_glow_effect', 'profile_matrix_intensity',
    ];

    protected $hidden = [
        'password', 
        'remember_token', 
        'email', 
        'email_verified_at', 
        'last_login_at', 
        'account_status', 
        'role'
    ];
    protected $appends = ['is_admin', 'level', 'xp_progress', 'next_level_xp', 'level_title'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at'     => 'datetime',
            'ai_access_until'   => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function toArray()
    {
        $array = parent::toArray();
        if ($this->trashed() || ($this->account_status ?? '') === 'deleted') {
            if (auth()->check() && auth()->user()->role === 'admin') {
                $array['name'] = $array['name'] . ' [Deleted]';
            } else {
                $array['name'] = '[deleted user]';
                $array['username'] = 'deleted';
                $array['avatar'] = null;
                $array['bio'] = null;
                $array['github_url'] = null;
                $array['city'] = null;
            }
        }
        return $array;
    }

    public function getAvatarAttribute($value): ?string
    {
        if (!$value) return null;
        // If it's already an absolute URL (e.g. from OAuth), return as-is
        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }
        // Strip leading /storage/ or storage/ and generate full URL via asset()
        $relativePath = ltrim(preg_replace('#^/?storage/#', '', $value), '/');
        return asset('storage/' . $relativePath);
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

    // Level Attributes
    public function getLevelAttribute(): int
    {
        return LevelCalculator::calculateLevel($this->xp ?? 0);
    }

    public function getXpProgressAttribute(): float
    {
        return LevelCalculator::calculateProgress($this->xp ?? 0);
    }

    public function getNextLevelXpAttribute(): int
    {
        $currentLevel = $this->level;
        return LevelCalculator::xpForLevel($currentLevel + 1);
    }

    public function getLevelTitleAttribute(): string
    {
        return LevelCalculator::getLevelTitle($this->level);
    }

    // Relationships
    public function achievements() { return $this->belongsToMany(Achievement::class, 'user_achievements')->withPivot('unlocked_at')->withTimestamps(); }
    public function events() { return $this->hasMany(Event::class); }
    public function jobListings() { return $this->hasMany(JobListing::class); }
    public function communities() { return $this->hasMany(Community::class); }
    public function activityLogs() { return $this->hasMany(ActivityLog::class); }
    public function reports() { return $this->hasMany(ContentReport::class); }
    public function marketplaceItems() { return $this->hasMany(MarketplaceItem::class); }
    public function marketplacePurchases() { return $this->hasMany(MarketplacePurchase::class); }
    public function xpTransactions() { return $this->hasMany(XpTransaction::class); }
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

    public function blockedUsers() {
        return $this->hasMany(UserBlock::class, 'user_id');
    }

    public function blockedByUsers() {
        return $this->hasMany(UserBlock::class, 'blocked_user_id');
    }

    public function hasBlocked(User $user) {
        return $this->blockedUsers()->where('blocked_user_id', $user->id)->exists();
    }

    public function isBlockedBy(User $user) {
        return $this->blockedByUsers()->where('user_id', $user->id)->exists();
    }

    // XP methods
    public function awardXp(int $amount, string $action, string $description, $loggable = null): void
    {
        $this->increment('xp', $amount);
        
        \App\Models\ActivityLog::create([
            'user_id'     => $this->id,
            'action'      => $action,
            'description' => $description,
            'xp_change'   => $amount,
            'loggable_id'   => $loggable?->id ?? 0,
            'loggable_type' => $loggable ? get_class($loggable) : 'general',
        ]);

        \App\Models\XpTransaction::create([
            'user_id' => $this->id,
            'amount' => $amount,
            'description' => $description,
            'reference_type' => $loggable ? get_class($loggable) : null,
            'reference_id' => $loggable?->id,
        ]);
        
        $this->checkBadges();
    }

    public function spendXp(int $amount, string $action, string $description): bool
    {
        if ($this->xp < $amount) return false;
        $this->decrement('xp', $amount);
        
        \App\Models\ActivityLog::create([
            'user_id'     => $this->id,
            'action'      => $action,
            'description' => $description,
            'xp_change'   => -$amount,
            'loggable_id'   => 0,
            'loggable_type' => 'marketplace',
        ]);

        \App\Models\XpTransaction::create([
            'user_id' => $this->id,
            'amount' => -$amount,
            'description' => $description,
            'reference_type' => 'marketplace',
            'reference_id' => null,
        ]);
        
        return true;
    }

    public function checkBadges(): void
    {
        AchievementSync::sync($this); // Old system
        \App\Services\AchievementService::evaluate($this); // New feature
    }
}
