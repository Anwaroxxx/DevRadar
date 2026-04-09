<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Community;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClusterZoneController extends Controller
{
    public function index()
    {
        return Inertia::render('ClusterZone/Index');
    }

    public function data()
    {
        $users = User::whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->whereNull('deleted_at')
            ->get(['id', 'name', 'username', 'avatar', 'city', 'latitude', 'longitude', 'xp']);

        $communities = Community::where('approval_status', 'approved')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get(['id', 'name', 'logo', 'city', 'latitude', 'longitude', 'category', 'member_count']);

        $events = Event::where('approval_status', 'approved')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get(['id', 'title', 'city', 'latitude', 'longitude', 'category', 'event_date']);

        return response()->json([
            'users' => $users->map(fn($u) => array_merge($u->toArray(), ['type' => 'user'])),
            'communities' => $communities->map(fn($c) => array_merge($c->toArray(), ['type' => 'community'])),
            'events' => $events->map(fn($e) => array_merge($e->toArray(), ['type' => 'event'])),
        ]);
    }
}
