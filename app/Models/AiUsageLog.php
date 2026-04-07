<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiUsageLog extends Model
{
    protected $fillable = [
        'user_id',
        'model',
        'tokens_used',
        'requests_count',
        'logged_at',
    ];

    protected $casts = [
        'tokens_used' => 'integer',
        'requests_count' => 'integer',
        'logged_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
