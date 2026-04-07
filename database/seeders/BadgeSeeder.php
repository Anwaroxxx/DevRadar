<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            ['slug' => 'welcome_signal', 'track' => 'welcome', 'level' => 1, 'name' => 'Signal Acquired', 'icon' => '', 'icon_key' => 'Radio', 'description' => 'Neural link established. Welcome to DevRadar.', 'requirement' => 'registered', 'xp_threshold' => 0],

            ['slug' => 'signal_i', 'track' => 'signal', 'level' => 1, 'name' => 'Baseline Pulse', 'icon' => '', 'icon_key' => 'TrendingUp', 'description' => 'Total XP reached 50.', 'requirement' => 'xp:50', 'xp_threshold' => 50],
            ['slug' => 'signal_ii', 'track' => 'signal', 'level' => 2, 'name' => 'Amplified Trace', 'icon' => '', 'icon_key' => 'Activity', 'description' => 'Total XP reached 200.', 'requirement' => 'xp:200', 'xp_threshold' => 200],
            ['slug' => 'signal_iii', 'track' => 'signal', 'level' => 3, 'name' => 'High Bandwidth', 'icon' => '', 'icon_key' => 'Zap', 'description' => 'Total XP reached 500.', 'requirement' => 'xp:500', 'xp_threshold' => 500],
            ['slug' => 'signal_iv', 'track' => 'signal', 'level' => 4, 'name' => 'Core Resonance', 'icon' => '', 'icon_key' => 'Crown', 'description' => 'Total XP reached 1200.', 'requirement' => 'xp:1200', 'xp_threshold' => 1200],
            ['slug' => 'signal_v', 'track' => 'signal', 'level' => 5, 'name' => 'Full Spectrum', 'icon' => '', 'icon_key' => 'Sparkles', 'description' => 'Total XP reached 3000.', 'requirement' => 'xp:3000', 'xp_threshold' => 3000],

            ['slug' => 'map_i', 'track' => 'cartographer', 'level' => 1, 'name' => 'First Coordinate', 'icon' => '', 'icon_key' => 'MapPin', 'description' => 'Published your first event.', 'requirement' => 'events:1', 'xp_threshold' => 0],
            ['slug' => 'map_ii', 'track' => 'cartographer', 'level' => 2, 'name' => 'Route Builder', 'icon' => '', 'icon_key' => 'Map', 'description' => 'Published 3 events.', 'requirement' => 'events:3', 'xp_threshold' => 0],
            ['slug' => 'map_iii', 'track' => 'cartographer', 'level' => 3, 'name' => 'Territory Scan', 'icon' => '', 'icon_key' => 'Globe', 'description' => 'Published 8 events.', 'requirement' => 'events:8', 'xp_threshold' => 0],

            ['slug' => 'hire_i', 'track' => 'operator', 'level' => 1, 'name' => 'Opportunity Beacon', 'icon' => '', 'icon_key' => 'Briefcase', 'description' => 'Posted your first job listing.', 'requirement' => 'jobs:1', 'xp_threshold' => 0],
            ['slug' => 'hire_ii', 'track' => 'operator', 'level' => 2, 'name' => 'Talent Relay', 'icon' => '', 'icon_key' => 'Laptop', 'description' => 'Posted 3 job listings.', 'requirement' => 'jobs:3', 'xp_threshold' => 0],
            ['slug' => 'hire_iii', 'track' => 'operator', 'level' => 3, 'name' => 'Market Uplink', 'icon' => '', 'icon_key' => 'Rocket', 'description' => 'Posted 8 job listings.', 'requirement' => 'jobs:8', 'xp_threshold' => 0],

            ['slug' => 'guild_i', 'track' => 'founder', 'level' => 1, 'name' => 'Guild Charter', 'icon' => '', 'icon_key' => 'Users', 'description' => 'Created your first community.', 'requirement' => 'communities_created:1', 'xp_threshold' => 0],
            ['slug' => 'guild_ii', 'track' => 'founder', 'level' => 2, 'name' => 'Collective OS', 'icon' => '', 'icon_key' => 'Network', 'description' => 'Created 3 communities.', 'requirement' => 'communities_created:3', 'xp_threshold' => 0],
            ['slug' => 'guild_iii', 'track' => 'founder', 'level' => 3, 'name' => 'Mesh Architect', 'icon' => '', 'icon_key' => 'Hexagon', 'description' => 'Created 6 communities.', 'requirement' => 'communities_created:6', 'xp_threshold' => 0],

            ['slug' => 'anchor_i', 'track' => 'anchor', 'level' => 1, 'name' => 'Dual Node', 'icon' => '', 'icon_key' => 'UserPlus', 'description' => 'Joined 2 communities.', 'requirement' => 'communities_joined:2', 'xp_threshold' => 0],
            ['slug' => 'anchor_ii', 'track' => 'anchor', 'level' => 2, 'name' => 'Cluster Member', 'icon' => '', 'icon_key' => 'Share2', 'description' => 'Joined 8 communities.', 'requirement' => 'communities_joined:8', 'xp_threshold' => 0],
            ['slug' => 'anchor_iii', 'track' => 'anchor', 'level' => 3, 'name' => 'Swarm Integrator', 'icon' => '', 'icon_key' => 'Layers', 'description' => 'Joined 20 communities.', 'requirement' => 'communities_joined:20', 'xp_threshold' => 0],

            ['slug' => 'magnet_i', 'track' => 'magnet', 'level' => 1, 'name' => 'Micro Gravity', 'icon' => '', 'icon_key' => 'Magnet', 'description' => '3 developers follow you.', 'requirement' => 'followers:3', 'xp_threshold' => 0],
            ['slug' => 'magnet_ii', 'track' => 'magnet', 'level' => 2, 'name' => 'Field Strength', 'icon' => '', 'icon_key' => 'Star', 'description' => '15 developers follow you.', 'requirement' => 'followers:15', 'xp_threshold' => 0],
            ['slug' => 'magnet_iii', 'track' => 'magnet', 'level' => 3, 'name' => 'Orbit Lock', 'icon' => '', 'icon_key' => 'Satellite', 'description' => '50 developers follow you.', 'requirement' => 'followers:50', 'xp_threshold' => 0],

            ['slug' => 'web_i', 'track' => 'web', 'level' => 1, 'name' => 'Handshake Path', 'icon' => '', 'icon_key' => 'GitBranch', 'description' => 'Following 5 developers.', 'requirement' => 'following:5', 'xp_threshold' => 0],
            ['slug' => 'web_ii', 'track' => 'web', 'level' => 2, 'name' => 'Wide Graph', 'icon' => '', 'icon_key' => 'Orbit', 'description' => 'Following 25 developers.', 'requirement' => 'following:25', 'xp_threshold' => 0],

            ['slug' => 'vault_i', 'track' => 'archivist', 'level' => 1, 'name' => 'Bookmarked', 'icon' => '', 'icon_key' => 'Bookmark', 'description' => 'Saved 3 events.', 'requirement' => 'saved_events:3', 'xp_threshold' => 0],
            ['slug' => 'vault_ii', 'track' => 'archivist', 'level' => 2, 'name' => 'Deep Archive', 'icon' => '', 'icon_key' => 'Library', 'description' => 'Saved 10 events.', 'requirement' => 'saved_events:10', 'xp_threshold' => 0],
            ['slug' => 'vault_iii', 'track' => 'archivist', 'level' => 3, 'name' => 'Curated Memory', 'icon' => '', 'icon_key' => 'BookOpen', 'description' => 'Saved 30 events.', 'requirement' => 'saved_events:30', 'xp_threshold' => 0],

            ['slug' => 'relay_i', 'track' => 'relay', 'level' => 1, 'name' => 'Ping Sent', 'icon' => '', 'icon_key' => 'MessageSquare', 'description' => 'Sent 5 direct messages.', 'requirement' => 'messages:5', 'xp_threshold' => 0],
            ['slug' => 'relay_ii', 'track' => 'relay', 'level' => 2, 'name' => 'Packet Flow', 'icon' => '', 'icon_key' => 'MessageCircle', 'description' => 'Sent 25 direct messages.', 'requirement' => 'messages:25', 'xp_threshold' => 0],
            ['slug' => 'relay_iii', 'track' => 'relay', 'level' => 3, 'name' => 'Backbone Traffic', 'icon' => '', 'icon_key' => 'Send', 'description' => 'Sent 100 direct messages.', 'requirement' => 'messages:100', 'xp_threshold' => 0],

            ['slug' => 'pulse_i', 'track' => 'pulse', 'level' => 1, 'name' => 'Routine Check', 'icon' => '', 'icon_key' => 'CalendarCheck', 'description' => 'Signed in on 3 distinct days.', 'requirement' => 'logins:3', 'xp_threshold' => 0],
            ['slug' => 'pulse_ii', 'track' => 'pulse', 'level' => 2, 'name' => 'Steady Cadence', 'icon' => '', 'icon_key' => 'CalendarDays', 'description' => 'Signed in on 10 distinct days.', 'requirement' => 'logins:10', 'xp_threshold' => 0],
            ['slug' => 'pulse_iii', 'track' => 'pulse', 'level' => 3, 'name' => 'Persistent Session', 'icon' => '', 'icon_key' => 'CalendarRange', 'description' => 'Signed in on 30 distinct days.', 'requirement' => 'logins:30', 'xp_threshold' => 0],
        ];

        foreach ($badges as $row) {
            Badge::updateOrCreate(
                ['slug' => $row['slug']],
                $row
            );
        }

        Badge::query()->whereNull('slug')->delete();
        DB::table('badge_user')->whereNotIn('badge_id', Badge::query()->pluck('id'))->delete();

        $this->command->info('Badges seeded.');
    }
}
