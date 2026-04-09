<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MarketplaceItem;

class MarketplaceSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'name' => 'AI_Shell_Weekly_Lease',
                'description' => 'Unrestricted access to the LLM logical unit for 7 solar days.',
                'price_xp' => 500,
                'category' => 'ai_access',
                'icon' => 'cpu',
                'is_available' => true,
                'is_approved' => true,
            ],
            [
                'name' => 'AI_Shell_Monthly_Lease',
                'description' => 'Unrestricted access to the LLM logical unit for 30 solar days.',
                'price_xp' => 1500,
                'category' => 'ai_access',
                'icon' => 'cpu',
                'is_available' => true,
                'is_approved' => true,
            ],
            [
                'name' => 'Git_Repository_Pro_Voucher',
                'description' => 'Redeemable for GitHub Pro subscription modules.',
                'price_xp' => 5000,
                'category' => 'voucher',
                'icon' => 'ticket',
                'is_available' => true,
                'is_approved' => true,
            ],
            [
                'name' => 'Logic_Currency_Adapter (Gift Card)',
                'description' => 'Universal adapter for digital retail nodes.',
                'price_xp' => 10000,
                'category' => 'gift_card',
                'icon' => 'credit-card',
                'is_available' => true,
                'is_approved' => true,
            ]
        ];

        foreach ($items as $item) {
            MarketplaceItem::create($item);
        }
    }
}
