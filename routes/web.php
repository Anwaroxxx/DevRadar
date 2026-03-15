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
    // Events
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
});

Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');
Route::get('/profile/{username}', [ProfileController::class, 'show'])->name('profile.public');

require __DIR__ . '/auth.php';
