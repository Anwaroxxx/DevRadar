<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\ChatController;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/api/map-events', [EventController::class, 'mapData'])->name('events.map');
Route::get('/events', [EventController::class, 'index'])->name('events.index');
Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');
Route::get('/communities', [CommunityController::class, 'index'])->name('communities.index');
Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.index');
Route::get('/feed', [FeedController::class, 'index'])->name('feed.index');
Route::get('/about', fn() => inertia('About'))->name('about');
Route::get('/support', fn() => inertia('Support'))->name('support');

// Authenticated routes
Route::middleware('auth')->group(function () {
    
    Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::post('/events/{event}/save', [EventController::class, 'toggleSave'])->name('events.save');
    Route::post('/events/{event}/attend', [EventController::class, 'toggleAttend'])->name('events.attend');

    // Jobs
    Route::get('/jobs/create', [JobController::class, 'create'])->name('jobs.create');
    Route::post('/jobs', [JobController::class, 'store'])->name('jobs.store');

    // Communities
    Route::get('/communities/create', [CommunityController::class, 'create'])->name('communities.create');
    Route::post('/communities', [CommunityController::class, 'store'])->name('communities.store');
    Route::post('/communities/{community}/follow', [CommunityController::class, 'toggleFollow'])->name('communities.follow');

    // Profile Management
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');
    Route::post('/profile/{user}/follow', [ProfileController::class, 'toggleFollow'])->name('profile.follow');
    Route::get('/profile/{username?}', [ProfileController::class, 'show'])->name('profile.show');

    // Marketplace
    Route::get('/marketplace', [MarketplaceController::class, 'index'])->name('marketplace.index');
    Route::post('/marketplace/purchase', [MarketplaceController::class, 'purchase'])->name('marketplace.purchase');

    // AI Tools
    Route::get('/ai/chat', [AiController::class, 'chatPage'])->name('ai.chat');
    Route::post('/ai/chat', [AiController::class, 'chat'])->name('ai.chat.send');
    Route::get('/ai/code-review', [AiController::class, 'codePage'])->name('ai.code');
    Route::post('/ai/code-review', [AiController::class, 'reviewCode'])->name('ai.code.review');
    Route::get('/ai/resume', [AiController::class, 'resumePage'])->name('ai.resume');
    Route::post('/ai/resume', [AiController::class, 'buildResume'])->name('ai.resume.build');
    Route::get('/ai/post-generator', [AiController::class, 'postPage'])->name('ai.post');
    Route::post('/ai/post-generator', [AiController::class, 'generatePost'])->name('ai.post.generate');
    Route::post('/ai/suggest-events', [AiController::class, 'suggestEvents'])->name('ai.suggest');

    // Real-time Chat
    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/search', [ChatController::class, 'search'])->name('chat.search');
    Route::get('/chat/{user:username}', [ChatController::class, 'show'])->name('chat.show');
    Route::post('/chat/{user}', [ChatController::class, 'store'])->name('chat.store');

    // Admin Panel
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('dashboard');

        // Users
        Route::get('/users', [\App\Http\Controllers\AdminController::class, 'users'])->name('users');
        Route::put('/users/{user}', [\App\Http\Controllers\AdminController::class, 'updateUser'])->name('users.update');
        Route::post('/users/{user}/grant-ai', [\App\Http\Controllers\AdminController::class, 'grantAiAccess'])->name('users.grant-ai');
        Route::post('/users/{user}/revoke-ai', [\App\Http\Controllers\AdminController::class, 'revokeAiAccess'])->name('users.revoke-ai');
        Route::delete('/users/{user}', [\App\Http\Controllers\AdminController::class, 'deleteUser'])->name('users.delete');
        Route::post('/users/{user}/ban', [\App\Http\Controllers\AdminController::class, 'banUser'])->name('users.ban');
        Route::post('/users/{user}/unban', [\App\Http\Controllers\AdminController::class, 'unbanUser'])->name('users.unban');
        Route::post('/users/{user}/suspend', [\App\Http\Controllers\AdminController::class, 'suspendUser'])->name('users.suspend');
        Route::post('/users/{user}/warn', [\App\Http\Controllers\AdminController::class, 'warnUser'])->name('users.warn');
        Route::post('/users/{user}/verify', [\App\Http\Controllers\AdminController::class, 'verifyUser'])->name('users.verify');

        // Events
        Route::get('/events', [\App\Http\Controllers\AdminController::class, 'events'])->name('events');
        Route::post('/events/{event}/approve', [\App\Http\Controllers\AdminController::class, 'approveEvent'])->name('events.approve');
        Route::post('/events/{event}/reject', [\App\Http\Controllers\AdminController::class, 'rejectEvent'])->name('events.reject');
        Route::delete('/events/{event}', [\App\Http\Controllers\AdminController::class, 'deleteEvent'])->name('events.delete');

        // Jobs
        Route::get('/jobs', [\App\Http\Controllers\AdminController::class, 'jobs'])->name('jobs');
        Route::post('/jobs/{job}/toggle', [\App\Http\Controllers\AdminController::class, 'toggleJob'])->name('jobs.toggle');
        Route::delete('/jobs/{job}', [\App\Http\Controllers\AdminController::class, 'deleteJob'])->name('jobs.delete');

        // Communities
        Route::get('/communities', [\App\Http\Controllers\AdminController::class, 'communities'])->name('communities');
        Route::delete('/communities/{community}', [\App\Http\Controllers\AdminController::class, 'deleteCommunity'])->name('communities.delete');

        // Moderation & Reports
        Route::get('/reports', [\App\Http\Controllers\AdminController::class, 'reports'])->name('reports');
        Route::post('/reports/{report}/review', [\App\Http\Controllers\AdminController::class, 'reviewReport'])->name('reports.review');

        // Content Approval Queue
        Route::get('/approval-queue', [\App\Http\Controllers\AdminController::class, 'approvalQueue'])->name('approval-queue');
        Route::post('/approve/{type}/{id}', [\App\Http\Controllers\AdminController::class, 'approveContent'])->name('approve');
        Route::post('/reject/{type}/{id}', [\App\Http\Controllers\AdminController::class, 'rejectContent'])->name('reject');

        // Phase 2: Marketplace Management
        Route::get('/marketplace', [\App\Http\Controllers\AdminController::class, 'marketplace'])->name('marketplace');
        Route::post('/marketplace/{item}/toggle', [\App\Http\Controllers\AdminController::class, 'toggleMarketplaceItem'])->name('marketplace.toggle');
        Route::put('/marketplace/{item}/price', [\App\Http\Controllers\AdminController::class, 'updateMarketplaceItemPrice'])->name('marketplace.price');
        Route::delete('/marketplace/{item}', [\App\Http\Controllers\AdminController::class, 'deleteMarketplaceItem'])->name('marketplace.delete');

        // Phase 2: XP Economy
        Route::get('/xp-economy', [\App\Http\Controllers\AdminController::class, 'xpEconomy'])->name('xp-economy');
        Route::put('/xp-rewards/{reward}', [\App\Http\Controllers\AdminController::class, 'updateXpReward'])->name('xp-rewards.update');
        Route::post('/xp-rewards', [\App\Http\Controllers\AdminController::class, 'createXpReward'])->name('xp-rewards.create');

        // Phase 2: AI Access Control
        Route::get('/ai-access', [\App\Http\Controllers\AdminController::class, 'aiAccess'])->name('ai-access');
        Route::put('/users/{user}/ai-tier', [\App\Http\Controllers\AdminController::class, 'updateUserAiTier'])->name('users.ai-tier');
        Route::post('/users/{user}/grant-ai', [\App\Http\Controllers\AdminController::class, 'grantAiAccess'])->name('users.grant-ai');
        Route::post('/users/{user}/revoke-ai', [\App\Http\Controllers\AdminController::class, 'revokeAiAccess'])->name('users.revoke-ai');
        Route::post('/users/{user}/reset-ai-usage', [\App\Http\Controllers\AdminController::class, 'resetAiMonthlyUsage'])->name('users.reset-ai-usage');

        // Phase 3: Analytics
        Route::get('/analytics', [\App\Http\Controllers\AdminController::class, 'analytics'])->name('analytics');

        // Phase 3: Settings & Feature Flags
        Route::get('/settings', [\App\Http\Controllers\AdminController::class, 'settings'])->name('settings');
        Route::post('/feature-flags/{flag}/toggle', [\App\Http\Controllers\AdminController::class, 'toggleFeatureFlag'])->name('feature-flags.toggle');
        Route::put('/feature-flags/{flag}/config', [\App\Http\Controllers\AdminController::class, 'updateFeatureFlagConfig'])->name('feature-flags.config');

        // Phase 3: Audit Logs
        Route::get('/audit-logs', [\App\Http\Controllers\AdminController::class, 'auditLogs'])->name('audit-logs');
    });
});

Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');
Route::get('/profile/{username}', [ProfileController::class, 'show'])->name('profile.public');

require __DIR__ . '/auth.php';
