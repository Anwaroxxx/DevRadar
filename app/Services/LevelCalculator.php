<?php

namespace App\Services;

class LevelCalculator
{
    /**
     * Calculate level based on XP.
     * Formula: Level = floor(sqrt(XP / 50)) + 1
     */
    public static function calculateLevel(int $xp): int
    {
        if ($xp <= 0) return 1;
        return (int) floor(sqrt($xp / 50)) + 1;
    }

    /**
     * Get the XP required to reach a specific level.
     */
    public static function xpForLevel(int $level): int
    {
        if ($level <= 1) return 0;
        return (int) pow($level - 1, 2) * 50;
    }

    /**
     * Calculate progress percentage to next level.
     */
    public static function calculateProgress(int $xp): float
    {
        $currentLevel = self::calculateLevel($xp);
        $currentLevelXp = self::xpForLevel($currentLevel);
        $nextLevelXp = self::xpForLevel($currentLevel + 1);

        $xpInCurrentLevel = $xp - $currentLevelXp;
        $xpNeededForNext = $nextLevelXp - $currentLevelXp;

        if ($xpNeededForNext <= 0) return 100.0;
        
        return round(($xpInCurrentLevel / $xpNeededForNext) * 100, 2);
    }

    /**
     * Get a decorative title based on level.
     */
    public static function getLevelTitle(int $level): string
    {
        return match (true) {
            $level >= 50 => 'ELITE_OVERLORD',
            $level >= 40 => 'NEURAL_ARCHITECT',
            $level >= 30 => 'SYSTEM_OPERATOR',
            $level >= 20 => 'POWER_USER',
            $level >= 10 => 'VERIFIED_NODE',
            $level >= 5  => 'STABLE_SIGNAL',
            default      => 'INITIAL_PROBE',
        };
    }
}
