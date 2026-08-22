<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\Event;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $stats = [
            'xp' => $user->xp ?? 0,
            'connections' => $user->following()->count() ?? 0,
            'followers' => $user->followers()->count() ?? 0,
            'pending_approvals' => Event::where('user_id', $user->id)->where('is_approved', false)->count() +
                                   Community::where('user_id', $user->id)->where('approval_status', 'pending')->count(),
        ];

        // My Events (Live & Pending)
        $myEvents = Event::with('tags')
            ->where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();

        // My Communities
        $myCommunities = Community::withCount('followers')
            ->where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();

        // Recommended / Radar (Randomly grab some active stuff the user isn't part of)
        $radarCommunities = Community::where('user_id', '!=', $user->id)
            ->where('approval_status', 'approved')
            ->inRandomOrder()
            ->limit(3)
            ->get();

        return Inertia::render('Home', [
            'stats' => $stats,
            'myEvents' => $myEvents,
            'myCommunities' => $myCommunities,
            'radarCommunities' => $radarCommunities,
            // Keeping mapEvents strictly for the background live-map visual if needed
            'mapEvents' => Event::where('is_approved', true)
                ->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->inRandomOrder()
                ->limit(5)
                ->get(['id', 'latitude', 'longitude', 'title']),
        ]);
    }
}
