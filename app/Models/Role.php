<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    public const ADMIN = 'admin';

    public const MODERATOR = 'moderator';

    public const DEVELOPER = 'developer';

    /**
     * Highest priority first. users.role caches the first match here.
     */
    public const HIERARCHY = [
        self::ADMIN,
        self::MODERATOR,
        self::DEVELOPER,
    ];

    protected $fillable = ['name', 'label'];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
