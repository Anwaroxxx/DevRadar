<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class XpReward extends Model
{
    protected $fillable = [
        'action',
        'amount',
        'description',
        'is_active',
    ];

    protected $casts = [
        'amount' => 'integer',
        'is_active' => 'boolean',
    ];
}
