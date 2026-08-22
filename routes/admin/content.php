<?php

use App\Http\Controllers\Admin\ContentController;
use Illuminate\Support\Facades\Route;

// Content streams — viewing is staff-wide; destructive actions stay admin-only.
Route::middleware(['auth', 'verified', 'role:moderator,admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/events', [ContentController::class, 'events'])->name('events');
        Route::get('/jobs', [ContentController::class, 'jobs'])->name('jobs');
        Route::get('/communities', [ContentController::class, 'communities'])->name('communities');
        Route::post('/communities/{community}/snapshot', [ContentController::class, 'captureSnapshot'])->name('communities.snapshot');
        Route::get('/communities/{community}/stats', [ContentController::class, 'getStats'])->name('communities.stats');

        Route::middleware('role:admin')->group(function () {
            Route::delete('/content/{type}/{id}', [ContentController::class, 'delete'])->name('content.delete');
        });
    });
