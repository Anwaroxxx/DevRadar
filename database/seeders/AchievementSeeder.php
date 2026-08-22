<?php

namespace Database\Seeders;

use App\Models\Achievement;
use Illuminate\Database\Seeder;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $achievements = [
            // General / Profile
            ['name' => 'First Blood', 'slug' => 'first-login', 'description' => 'Login to DevRadar for the first time.', 'icon' => 'power', 'xp_reward' => 10, 'trigger_type' => 'one_time', 'metric_key' => 'logins', 'trigger_value' => 1],
            ['name' => 'Committed', 'slug' => '10-logins', 'description' => 'Login 10 times.', 'icon' => 'zap', 'xp_reward' => 50, 'trigger_type' => 'count_based', 'metric_key' => 'logins', 'trigger_value' => 10],
            ['name' => 'Identity Established', 'slug' => 'profile-completed', 'description' => 'Complete your profile information.', 'icon' => 'user-check', 'xp_reward' => 30, 'trigger_type' => 'one_time', 'metric_key' => 'profile_completion', 'trigger_value' => 100],
            ['name' => 'Tech Stack Locked', 'slug' => 'skills-added', 'description' => 'Add at least 3 skills to your profile.', 'icon' => 'cpu', 'xp_reward' => 20, 'trigger_type' => 'count_based', 'metric_key' => 'skills', 'trigger_value' => 3],

            // Events
            ['name' => 'Event Architect', 'slug' => 'first-event', 'description' => 'Host your first event.', 'icon' => 'calendar-plus', 'xp_reward' => 100, 'trigger_type' => 'count_based', 'metric_key' => 'events_hosted', 'trigger_value' => 1],
            ['name' => 'Community Pillar', 'slug' => '5-events', 'description' => 'Host 5 events.', 'icon' => 'award', 'xp_reward' => 300, 'trigger_type' => 'count_based', 'metric_key' => 'events_hosted', 'trigger_value' => 5],
            ['name' => 'Participant', 'slug' => 'attend-event', 'description' => 'RSVP and attend your first event.', 'icon' => 'users', 'xp_reward' => 20, 'trigger_type' => 'count_based', 'metric_key' => 'events_attended', 'trigger_value' => 1],
            ['name' => 'Frequent Flyer', 'slug' => '10-attendances', 'description' => 'Attend 10 events.', 'icon' => 'plane', 'xp_reward' => 150, 'trigger_type' => 'count_based', 'metric_key' => 'events_attended', 'trigger_value' => 10],

            // Communities
            ['name' => 'Pioneer', 'slug' => 'create-community', 'description' => 'Create a new community.', 'icon' => 'globe', 'xp_reward' => 120, 'trigger_type' => 'count_based', 'metric_key' => 'communities_created', 'trigger_value' => 1],
            ['name' => 'Joiner', 'slug' => 'join-community', 'description' => 'Join your first community.', 'icon' => 'user-plus', 'xp_reward' => 15, 'trigger_type' => 'count_based', 'metric_key' => 'communities_joined', 'trigger_value' => 1],

            // Jobs
            ['name' => 'Headhunter', 'slug' => 'post-job', 'description' => 'Post a job opening.', 'icon' => 'briefcase', 'xp_reward' => 80, 'trigger_type' => 'count_based', 'metric_key' => 'jobs_posted', 'trigger_value' => 1],
            ['name' => 'Job Seeker', 'slug' => 'apply-job', 'description' => 'Click apply on a job listing.', 'icon' => 'file-text', 'xp_reward' => 10, 'trigger_type' => 'count_based', 'metric_key' => 'jobs_applied', 'trigger_value' => 1],

            // Chat / Comms
            ['name' => 'First Words', 'slug' => 'send-message', 'description' => 'Send your first chat message.', 'icon' => 'message-square', 'xp_reward' => 10, 'trigger_type' => 'count_based', 'metric_key' => 'messages_sent', 'trigger_value' => 1],
            ['name' => 'Chatterbox', 'slug' => '100-messages', 'description' => 'Send 100 messages.', 'icon' => 'message-circle', 'xp_reward' => 200, 'trigger_type' => 'count_based', 'metric_key' => 'messages_sent', 'trigger_value' => 100],

            // Network / Followers
            ['name' => 'Influencer Beta', 'slug' => '10-followers', 'description' => 'Gain 10 followers.', 'icon' => 'star', 'xp_reward' => 100, 'trigger_type' => 'count_based', 'metric_key' => 'followers', 'trigger_value' => 10],
            ['name' => 'Following the Trail', 'slug' => 'follow-5', 'description' => 'Follow 5 other developers.', 'icon' => 'eye', 'xp_reward' => 25, 'trigger_type' => 'count_based', 'metric_key' => 'following', 'trigger_value' => 5],

            // Content / Platform
            ['name' => 'Vigilante', 'slug' => 'report-content', 'description' => 'Submit a content report.', 'icon' => 'shield-alert', 'xp_reward' => 10, 'trigger_type' => 'count_based', 'metric_key' => 'reports_submitted', 'trigger_value' => 1],
            ['name' => 'Market Buyer', 'slug' => 'first-purchase', 'description' => 'Buy an item from the Marketplace.', 'icon' => 'shopping-cart', 'xp_reward' => 50, 'trigger_type' => 'count_based', 'metric_key' => 'purchases', 'trigger_value' => 1],

            // Xp milestone
            ['name' => 'Rising Star', 'slug' => '1000-xp', 'description' => 'Accumulate 1,000 XP.', 'icon' => 'trending-up', 'xp_reward' => 0, 'trigger_type' => 'milestone', 'metric_key' => 'xp', 'trigger_value' => 1000],
            ['name' => 'Hacker Elite', 'slug' => '10000-xp', 'description' => 'Accumulate 10,000 XP.', 'icon' => 'crown', 'xp_reward' => 0, 'trigger_type' => 'milestone', 'metric_key' => 'xp', 'trigger_value' => 10000],
        ];

        foreach ($achievements as $achievement) {
            Achievement::updateOrCreate(['slug' => $achievement['slug']], $achievement);
        }
    }
}
