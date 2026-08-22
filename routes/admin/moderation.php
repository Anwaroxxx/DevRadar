<?php

use App\Http\Controllers\Admin\ModerationController;
use App\Http\Controllers\SupportController;
use Illuminate\Support\Facades\Route;

// Moderation Hub (content reports + approvals + support tickets).
Route::middleware(['auth', 'verified', 'role:moderator,admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/moderation', [ModerationController::class, 'hub'])->name('moderation.hub');
        Route::post('/moderation/{type}/{id}/approve', [ModerationController::class, 'approve'])->name('moderation.approve');
        Route::post('/moderation/{type}/{id}/reject', [ModerationController::class, 'reject'])->name('moderation.reject');
        Route::post('/moderation/reports/{report}/resolve', [ModerationController::class, 'resolveReport'])->name('moderation.resolve');

        // Support Tickets
        Route::get('/support-tickets', [SupportController::class, 'adminIndex'])->name('support-tickets');
        Route::post('/support-tickets/{ticket}/resolve', [SupportController::class, 'adminResolve'])->name('support-tickets.resolve');
    });
