<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeatureFlag extends Model
{
    protected $fillable = [
        'name',
        'enabled',
        'description',
        'config',
        'enabled_at',
        'disabled_at',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'config' => 'array',
        'enabled_at' => 'datetime',
        'disabled_at' => 'datetime',
    ];

    public static function isEnabled($name)
    {
        return self::where('name', $name)->where('enabled', true)->exists();
    }

    public static function getConfig($name)
    {
        $flag = self::where('name', $name)->first();
        return $flag?->config ?? [];
    }
}
