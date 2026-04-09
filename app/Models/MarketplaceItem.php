<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarketplaceItem extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price_xp',
        'category',
        'icon',
        'is_available',
        'max_quantity',
        'quantity_sold',
        'user_id',
        'is_approved',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'max_quantity' => 'integer',
        'quantity_sold' => 'integer',
        'price_xp' => 'integer',
    ];

    public function purchases()
    {
        return $this->hasMany(MarketplacePurchase::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }
}
