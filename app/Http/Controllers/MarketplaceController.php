<?php

namespace App\Http\Controllers;

use App\Models\MarketplaceItem;
use App\Models\MarketplacePurchase;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    public function index()
    {
        $products = MarketplaceItem::where('is_available', true)
            ->where('is_approved', true) // Admin must approve user-submitted items, or they are auto-approved system items
            ->with('user')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Marketplace/Index', [
            'products' => $products,
        ]);
    }

    public function purchase(Request $request)
    {
        $request->validate([
            'product_id' => 'required',
        ]);

        $user = $request->user();

        $product = MarketplaceItem::find($request->product_id);

        if (! $product || ! $product->is_available || ! $product->is_approved) {
            return back()->with('error', 'INVALID_PRODUCT_ID: Module not found in registry.');
        }

        if ($product->max_quantity !== null && $product->quantity_sold >= $product->max_quantity) {
            return back()->with('error', 'SOLD_OUT: All instances of this module have been claimed.');
        }

        // Spend XP with logging (automatically generates XpTransaction)
        $spent = $user->spendXp($product->price_xp, 'purchase', "Purchased {$product->name} from marketplace.");

        if (! $spent) {
            return back()->with('error', 'INSUFFICIENT_XP: Power reserves below required threshold.');
        }

        // Insert into marketplace_purchases
        MarketplacePurchase::create([
            'user_id' => $user->id,
            'marketplace_item_id' => $product->id,
            'xp_spent' => $product->price_xp,
        ]);

        $product->increment('quantity_sold');

        // Handle types natively mapping to platform functionality
        if ($product->category === 'ai_access') {
            $baseDate = $user->ai_access_until && $user->ai_access_until->isFuture()
                ? $user->ai_access_until
                : Carbon::now();

            // Assume the length is stated in description or standard value
            $duration = 7;
            if (stripos($product->name, 'monthly') !== false) {
                $duration = 30;
            }

            $user->update([
                'ai_access_until' => $baseDate->addDays($duration),
            ]);

            return back()->with('success', 'AI_SHELL_LINK_ESTABLISHED: Access duration extended.');
        }

        if ($product->user_id) {
            // Pay the creator (75% to creator, 25% to platform sink)
            $reward = (int) ($product->price_xp * 0.75);
            if ($reward > 0) {
                $product->user->awardXp($reward, 'marketplace_sale', "Sale commission for {$product->name}.");
            }
        }

        return back()->with('success', 'TRANSACTION_SUCCESS: The module has been added to your inventory.');
    }
}
