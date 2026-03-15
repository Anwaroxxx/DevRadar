<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\JobListing;
use App\Models\Community;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $eventsCount     = Event::where('is_approved', true)->count();
        $jobsCount       = JobListing::where('is_active', true)->count();
        $communitiesCount= Community::count();

        $upcomingEvents  = Event::with(['user', 'tags'])
            ->where('is_approved', true)
            ->where('event_date', '>=', now())
            ->orderBy('event_date')
            ->limit(6)
            ->get();

        $mapEvents = Event::where('is_approved', true)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->with('tags')
            ->get(['id','title','city','category','latitude','longitude','event_date']);

        return Inertia::render('Home', [
            'stats' => [
                'events'      => $eventsCount,
                'jobs'        => $jobsCount,
                'communities' => $communitiesCount,
            ],
            'upcomingEvents' => $upcomingEvents,
            'mapEvents'      => $mapEvents,
        ]);
    }
}
