<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AchievementSync
{
    public static function sync(User $user): void
    {
        $user = $user->fresh();
        if (!$user) {
            return;
        }

        $xp = (int) $user->xp;

        $counts = [
            'events' => $user->events()->count(),
            'jobs' => $user->jobListings()->count(),
            'communities_created' => $user->communities()->count(),
            'communities_joined' => $user->followedCommunities()->count(),
            'followers' => $user->followers()->count(),
            'following' => $user->following()->count(),
            'saved_events' => $user->savedEvents()->wherePivot('saved', true)->count(),
            'messages' => $user->sentMessages()->count(),
        ];

        $loginDays = (int) DB::table('activity_logs')
            ->where('user_id', $user->id)
            ->where('action', 'daily_login')
            ->selectRaw('DATE(created_at) as day')
            ->groupBy('day')
            ->get()
            ->count();

        $toAttach = [];
        foreach (Badge::query()->orderBy('track')->orderBy('level')->cursor() as $badge) {
            if (self::requirementMet($badge, $xp, $counts, $loginDays)) {
                $toAttach[] = $badge->id;
            }
        }

        if ($toAttach !== []) {
            $user->badges()->syncWithoutDetaching(array_values(array_unique($toAttach)));
        }
    }

    private static function requirementMet(Badge $badge, int $xp, array $counts, int $loginDays): bool
    {
        $req = trim((string) $badge->requirement);

        if ($req === 'registered') {
            return true;
        }

        if (preg_match('/^xp:(\d+)$/', $req, $m)) {
            return $xp >= (int) $m[1];
        }

        if (preg_match('/^events:(\d+)$/', $req, $m)) {
            return $counts['events'] >= (int) $m[1];
        }

        if (preg_match('/^jobs:(\d+)$/', $req, $m)) {
            return $counts['jobs'] >= (int) $m[1];
        }

        if (preg_match('/^communities_created:(\d+)$/', $req, $m)) {
            return $counts['communities_created'] >= (int) $m[1];
        }

        if (preg_match('/^communities_joined:(\d+)$/', $req, $m)) {
            return $counts['communities_joined'] >= (int) $m[1];
        }

        if (preg_match('/^followers:(\d+)$/', $req, $m)) {
            return $counts['followers'] >= (int) $m[1];
        }

        if (preg_match('/^following:(\d+)$/', $req, $m)) {
            return $counts['following'] >= (int) $m[1];
        }

        if (preg_match('/^saved_events:(\d+)$/', $req, $m)) {
            return $counts['saved_events'] >= (int) $m[1];
        }

        if (preg_match('/^messages:(\d+)$/', $req, $m)) {
            return $counts['messages'] >= (int) $m[1];
        }

        if (preg_match('/^logins:(\d+)$/', $req, $m)) {
            return $loginDays >= (int) $m[1];
        }

        // Legacy: xp_300, register, etc.
        if (preg_match('/^xp_(\d+)$/', $req, $m)) {
            return $xp >= (int) $m[1];
        }

        if ($req === 'register') {
            return true;
        }

        if ((int) $badge->xp_threshold > 0 && $xp >= (int) $badge->xp_threshold) {
            return true;
        }

        return false;
    }
}
