<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\JobListing;
use App\Models\Community;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedController extends Controller
{
    public function index()
    {
        $recentEvents = Event::with(['user', 'tags'])
            ->where('is_approved', true)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $recentJobs = JobListing::with('user')
            ->where('is_active', true)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $recentCommunities = Community::with('user')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $trendingTags = Tag::withCount('events')
            ->orderByDesc('events_count')
            ->limit(10)
            ->get();

        return Inertia::render('Feed/Index', [
            'recentEvents'      => $recentEvents,
            'recentJobs'        => $recentJobs,
            'recentCommunities' => $recentCommunities,
            'trendingTags'      => $trendingTags,
        ]);
    }
}
