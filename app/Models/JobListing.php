<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'company', 'company_logo', 'city', 'type',
        'is_remote', 'description', 'apply_link', 'tech_stack', 'salary_range',
        'latitude', 'longitude', 'is_active', 'approval_status', 'approved_by', 'rejection_reason',
    ];

    protected $casts = [
        'tech_stack' => 'array',
        'is_remote' => 'boolean',
        'is_active' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }
}
