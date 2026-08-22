<?php

use App\Http\Controllers\AiController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ClusterZoneController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SupportController;
use App\Models\Community;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ═══════════════════════════════════════════════════════
// FULLY PUBLIC ROUTES — No auth required
// ═══════════════════════════════════════════════════════

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Welcome', [
        'stats' => [
            'users' => User::count(),
            'communities' => Community::count(),
            'events' => Event::count(),
            'jobs' => JobListing::count(),
        ],
    ]);
})->name('landing');

Route::get('/about', fn () => inertia('About'))->name('about');
Route::get('/support', fn () => inertia('Support'))->name('support');
Route::post('/support', [SupportController::class, 'store'])->name('support.store');

Route::get('/deactivated', fn () => Inertia::render('Deactivated'))->name('account.deactivated');

// ═══════════════════════════════════════════════════════
// AUTHENTICATED ROUTES — Requires login
// ═══════════════════════════════════════════════════════

Route::middleware('auth')->group(function () {

    // Dashboard
    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');

    // Events (index + show locked)
    Route::get('/api/map-events', [EventController::class, 'mapData'])->name('events.map');
    Route::get('/events', [EventController::class, 'index'])->name('events.index');
    Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
    Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::post('/events/{event}/save', [EventController::class, 'toggleSave'])->name('events.save');
    Route::post('/events/{event}/attend', [EventController::class, 'toggleAttend'])->name('events.attend');

    // Jobs
    Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');
    Route::get('/jobs/create', [JobController::class, 'create'])->name('jobs.create');
    Route::post('/jobs', [JobController::class, 'store'])->name('jobs.store');

    // Communities
    Route::get('/communities', [CommunityController::class, 'index'])->name('communities.index');
    Route::get('/communities/create', [CommunityController::class, 'create'])->name('communities.create');
    Route::post('/communities', [CommunityController::class, 'store'])->name('communities.store');
    Route::get('/communities/{community}', [CommunityController::class, 'show'])->name('communities.show');
    Route::post('/communities/{community}/follow', [CommunityController::class, 'toggleFollow'])->name('communities.follow');
    Route::post('/communities/{community}/posts', [CommunityController::class, 'storePost'])->name('communities.posts.store');
    Route::post('/community-posts/{post}/comments', [CommunityController::class, 'storeComment'])->name('communities.comments.store');
    Route::post('/community-posts/{post}/upvote', [CommunityController::class, 'toggleUpvote'])->name('communities.posts.upvote');
    Route::post('/community-posts/{post}/report', [CommunityController::class, 'reportPost'])->name('communities.posts.report');
    Route::post('/community-comments/{comment}/report', [CommunityController::class, 'reportComment'])->name('communities.comments.report');

    // Leaderboard & Feed
    Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.index');
    Route::get('/feed', [FeedController::class, 'index'])->name('feed.index');

    // Profile Management
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo.update');
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');
    Route::post('/profile/{user}/follow', [ProfileController::class, 'toggleFollow'])->name('profile.follow');
    Route::post('/profile/{user}/block', [ProfileController::class, 'toggleBlock'])->name('profile.block');
    Route::post('/profile/{user}/report', [ProfileController::class, 'reportUser'])->name('profile.report');
    Route::get('/profile/{username?}', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/{username}', [ProfileController::class, 'show'])->name('profile.public');

    // Marketplace
    Route::get('/marketplace', [MarketplaceController::class, 'index'])->name('marketplace.index');
    Route::post('/marketplace/purchase', [MarketplaceController::class, 'purchase'])->name('marketplace.purchase');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    // Cluster Zone (Live Map)
    Route::get('/cluster-zone', [ClusterZoneController::class, 'index'])->name('cluster-zone.index');
    Route::get('/api/cluster-data', [ClusterZoneController::class, 'data'])->name('cluster-zone.data');

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
    Route::get('/chat/{user}/messages', [ChatController::class, 'messages'])->name('chat.messages');
    Route::post('/chat/{user}', [ChatController::class, 'store'])->name('chat.store');
    Route::post('/chat/{user}/typing', [ChatController::class, 'typing'])->name('chat.typing');
});

// ─── Admin Panel (role-based, split by concern) ─────────────
require __DIR__.'/admin/dashboard.php';
require __DIR__.'/admin/moderation.php';
require __DIR__.'/admin/content.php';
require __DIR__.'/admin/users.php';
require __DIR__.'/admin/systems.php';

require __DIR__.'/auth.php';
