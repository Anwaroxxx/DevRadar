<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class MarketplaceController extends Controller
{
    public function index()
    {
        return Inertia::render('Marketplace/Index', [
            'products' => [
                [
                    'id' => 'ai_weekly',
                    'name' => 'AI_Shell_Weekly_Lease',
                    'description' => 'Unrestricted access to the LLM logical unit for 7 solar days.',
                    'cost' => 500,
                    'type' => 'ai_access',
                    'duration' => 7,
                ],
                [
                    'id' => 'ai_monthly',
                    'name' => 'AI_Shell_Monthly_Lease',
                    'description' => 'Unrestricted access to the LLM logical unit for 30 solar days.',
                    'cost' => 1500,
                    'type' => 'ai_access',
                    'duration' => 30,
                ],
                [
                    'id' => 'gh_pro',
                    'name' => 'Git_Repository_Pro_Voucher',
                    'description' => 'Redeemable for GitHub Pro subscription modules.',
                    'cost' => 5000,
                    'type' => 'voucher',
                ],
                [
                    'id' => 'gift_card',
                    'name' => 'Logic_Currency_Adapter (Gift Card)',
                    'description' => 'Universal adapter for digital retail nodes.',
                    'cost' => 10000,
                    'type' => 'gift_card',
                ]
            ]
        ]);
    }

    public function purchase(Request $request)
    {
        $request->validate([
            'product_id' => 'required|string',
        ]);

        $user = $request->user();
        
        // Define products logic (in a real app, this would be in DB)
        $products = [
            'ai_weekly'  => ['cost' => 500,  'type' => 'ai_access', 'duration' => 7],
            'ai_monthly' => ['cost' => 1500, 'type' => 'ai_access', 'duration' => 30],
            'gh_pro'     => ['cost' => 5000, 'type' => 'voucher'],
            'gift_card'  => ['cost' => 10000, 'type' => 'gift_card'],
        ];

        if (!isset($products[$request->product_id])) {
            return back()->with('error', 'INVALID_PRODUCT_ID: Module not found in registry.');
        }

        $product = $products[$request->product_id];

        if ($user->xp < $product['cost']) {
            return back()->with('error', 'INSUFFICIENT_XP: Power reserves below required threshold.');
        }

        // Spend XP
        $user->decrement('xp', $product['cost']);

        // Handle types
        if ($product['type'] === 'ai_access') {
            $baseDate = $user->ai_access_until && $user->ai_access_until->isFuture() 
                ? $user->ai_access_until 
                : Carbon::now();
            
            $user->update([
                'ai_access_until' => $baseDate->addDays($product['duration'])
            ]);
            
            return back()->with('success', 'AI_SHELL_LINK_ESTABLISHED: Access duration extended.');
        }

        return back()->with('success', 'VOUCHER_GENERATED: Check your encrypted transmission logs for the code.');
    }
}
