<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Community;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index()
    {
        $topContributors = User::orderByDesc('xp')
            ->withCount(['events', 'jobListings', 'communities'])
            ->limit(20)
            ->get(['id', 'name', 'username', 'avatar', 'city', 'xp']);

        $eventCreators = User::withCount('events')
            ->orderByDesc('events_count')
            ->limit(10)
            ->get(['id', 'name', 'username', 'avatar', 'city', 'xp']);

        $communityBuilders = User::withCount('communities')
            ->orderByDesc('communities_count')
            ->limit(10)
            ->get(['id', 'name', 'username', 'avatar', 'city', 'xp']);

        return Inertia::render('Leaderboard/Index', [
            'topContributors'  => $topContributors,
            'eventCreators'    => $eventCreators,
            'communityBuilders'=> $communityBuilders,
        ]);
    }
}
