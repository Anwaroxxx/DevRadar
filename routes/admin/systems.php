<?php

use App\Http\Controllers\Admin\SystemsController;
use Illuminate\Support\Facades\Route;

// System core (marketplace, XP economy, AI access, flags, audit) — admins only.
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/marketplace', [SystemsController::class, 'marketplace'])->name('marketplace');
        Route::post('/marketplace/{item}/toggle', [SystemsController::class, 'toggleMarketplaceItem'])->name('marketplace.toggle');
        Route::get('/xp-economy', [SystemsController::class, 'xpEconomy'])->name('xp-economy');
        Route::get('/ai-access', [SystemsController::class, 'aiAccess'])->name('ai-access');
        Route::get('/analytics', [SystemsController::class, 'analytics'])->name('analytics');
        Route::get('/settings', [SystemsController::class, 'settings'])->name('settings');
        Route::post('/settings/broadcast', [SystemsController::class, 'broadcast'])->name('settings.broadcast');
        Route::post('/settings/flags/{flag}/toggle', [SystemsController::class, 'toggleFeatureFlag'])->name('settings.flags.toggle');
        Route::get('/audit-logs', [SystemsController::class, 'auditLogs'])->name('audit-logs');
    });
