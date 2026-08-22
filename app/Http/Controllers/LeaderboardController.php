<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        $tab = $request->query('tab', 'xp'); // xp, events, clusters
        $filter = $request->query('filter', 'all'); // weekly, monthly, all

        $query = User::query()->where('account_status', 'active');
        $dateFilter = null;

        if ($filter === 'weekly') {
            $dateFilter = Carbon::now()->startOfWeek();
        } elseif ($filter === 'monthly') {
            $dateFilter = Carbon::now()->startOfMonth();
        }

        if ($tab === 'events') {
            $query->withCount(['events' => function ($q) use ($dateFilter) {
                $q->where('is_approved', true);
                if ($dateFilter) {
                    $q->where('created_at', '>=', $dateFilter);
                }
            }])
                ->orderByDesc('events_count');
        } elseif ($tab === 'clusters') {
            $query->withCount(['communities' => function ($q) use ($dateFilter) {
                if ($dateFilter) {
                    $q->where('created_at', '>=', $dateFilter);
                }
            }])
                ->orderByDesc('communities_count');
        } else {
            // Default to XP
            $query->orderByDesc('xp');
            // XP doesn't easily filter by date unless we sum ActivityLogs.
            // For true weekly/monthly XP, we sum recent ActivityLog xp_changes.
            if ($dateFilter) {
                $query->withSum(['activityLogs as recent_xp' => function ($q) use ($dateFilter) {
                    $q->where('created_at', '>=', $dateFilter);
                }], 'xp_change')
                    ->orderByDesc('recent_xp');
            }
        }

        $leaders = $query->take(50)->get()->map(function ($user, $idx) use ($tab, $dateFilter) {
            $score = 0;
            if ($tab === 'events') {
                $score = $user->events_count;
            } elseif ($tab === 'clusters') {
                $score = $user->communities_count;
            } else {
                $score = $dateFilter ? ($user->recent_xp ?? 0) : $user->xp;
            }

            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'avatar' => $user->avatar,
                'role' => $user->role,
                'score' => (int) $score,
                'rank' => $idx + 1,
                'level' => $user->level,
                'level_title' => $user->level_title,
            ];
        });

        // Current user rank
        $userRank = null;
        if (auth()->check()) {
            $userRank = $leaders->firstWhere('id', auth()->id());
        }

        return Inertia::render('Leaderboards/Index', [
            'leaders' => $leaders,
            'tab' => $tab,
            'filter' => $filter,
            'userRank' => $userRank,
        ]);
    }
}
