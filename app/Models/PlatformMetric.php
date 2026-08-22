<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlatformMetric extends Model
{
    protected $fillable = [
        'metric_name',
        'value',
        'date',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public static function record($metric_name, $value, $date = null)
    {
        $date = $date ?? now()->toDateString();

        return self::updateOrCreate(
            ['metric_name' => $metric_name, 'date' => $date],
            ['value' => $value]
        );
    }
}
