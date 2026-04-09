<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\User;
use App\Models\ActivityLog;

class AchievementService
{
    public static $isEvaluating = false;

    /**
     * Check and award achievements to a user.
     */
    public static function evaluate(User $user)
    {
        if (self::$isEvaluating) return;
        
        // Don't evaluate for soft deleted users
        if ($user->trashed()) return;

        self::$isEvaluating = true;

        try {
            // Fetch all achievements
            $achievements = Achievement::all();

            // Get user's current unlocked achievements
            $unlockedIds = $user->achievements()->pluck('achievements.id')->toArray();
            $newUnlocks = [];

            foreach ($achievements as $achievement) {
                if (in_array($achievement->id, $unlockedIds)) {
                    continue;
                }

                $unlocked = false;

                if ($achievement->trigger_type === 'milestone') {
                    if ($achievement->metric_key === 'xp' && $user->xp >= $achievement->trigger_value) {
                        $unlocked = true;
                    }
                } 
                elseif ($achievement->trigger_type === 'count_based' || $achievement->trigger_type === 'one_time') {
                    // If it's count based, calculate the metric
                    $count = self::getMetricCount($user, $achievement->metric_key);
                    if ($count >= $achievement->trigger_value) {
                        $unlocked = true;
                    }
                }

                if ($unlocked) {
                    // Attach the achievement safely
                    $user->achievements()->syncWithoutDetaching([$achievement->id]);
                    $unlockedIds[] = $achievement->id;
                    $newUnlocks[] = $achievement;

                    // Award XP if applicable
                    if ($achievement->xp_reward > 0) {
                        $user->awardXp($achievement->xp_reward, 'achievement_unlocked', "Unlocked achievement: {$achievement->name}");
                    }
                }
            }

            // Ideally, in a real application, you might dispatch an event to broadcast the new unlocks to the frontend
            if (!empty($newUnlocks)) {
                // dispatch(new \App\Events\AchievementsUnlocked($user, $newUnlocks));
            }
        } finally {
            self::$isEvaluating = false;
        }
    }

    private static function getMetricCount(User $user, string $metricKey): int
    {
        return match ($metricKey) {
            'logins' => ActivityLog::where('user_id', $user->id)->where('action', 'daily_login')->count(),
            'profile_completion' => self::calculateProfileCompletion($user),
            'skills' => $user->skills()->count(),
            'events_hosted' => $user->events()->count(),
            'events_attended' => $user->savedEvents()->where('attending', true)->count(),
            'communities_created' => $user->communities()->count(),
            'communities_joined' => $user->followedCommunities()->count(),
            'jobs_posted' => $user->jobListings()->count(),
            'messages_sent' => $user->sentMessages()->count(),
            'followers' => $user->followers()->count(),
            'following' => $user->following()->count(),
            // Other metrics could be calculated by querying activity logs
            default => ActivityLog::where('user_id', $user->id)->where('action', $metricKey)->count(),
        };
    }

    private static function calculateProfileCompletion(User $user): int
    {
        $fields = ['name', 'email', 'username', 'bio', 'avatar', 'github_url', 'location', 'city'];
        $filledCount = 0;
        foreach ($fields as $field) {
            if (!empty($user->{$field})) $filledCount++;
        }
        return (int) (($filledCount / count($fields)) * 100);
    }
}
