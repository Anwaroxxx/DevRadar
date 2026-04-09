<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\JobListing;
use App\Models\Community;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedController extends Controller
{
    public function index()
    {
        $userRank = null;
        $blockedUserIds = [];

        if (auth()->check()) {
            $user = auth()->user();
            
            // Get all IDs involved in blocking (both ways)
            $blockedByMe = $user->blockedUsers()->pluck('blocked_user_id')->toArray();
            $blockingMe = $user->blockedByUsers()->pluck('user_id')->toArray();
            $blockedUserIds = array_unique(array_merge($blockedByMe, $blockingMe));

            // Estimate rank by counting users with higher XP
            $rank = User::where('xp', '>', $user->xp)
                ->where('account_status', 'active')
                ->whereNotIn('id', $blockedUserIds)
                ->count() + 1;

            $userRank = [
                'xp' => $user->xp,
                'rank' => $rank
            ];
        }

        $recentEvents = Event::with(['user', 'tags'])
            ->where('is_approved', true)
            ->whereNotIn('user_id', $blockedUserIds)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $recentJobs = JobListing::with('user')
            ->where('is_active', true)
            ->whereNotIn('user_id', $blockedUserIds)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $recentCommunities = Community::with('user')
            ->whereNotIn('user_id', $blockedUserIds)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $trendingTags = Tag::withCount(['events' => function ($q) use ($blockedUserIds) {
                $q->whereNotIn('user_id', $blockedUserIds);
            }])
            ->orderByDesc('events_count')
            ->limit(10)
            ->get();

        return Inertia::render('Feed/Index', [
            'recentEvents'      => $recentEvents,
            'recentJobs'        => $recentJobs,
            'recentCommunities' => $recentCommunities,
            'trendingTags'      => $trendingTags,
            'activeNodes'       => User::count(),
            'userRank'          => $userRank,
        ]);
    }
}
