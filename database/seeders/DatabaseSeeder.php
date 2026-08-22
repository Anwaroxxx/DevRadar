<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Skill;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            BadgeSeeder::class,
        ]);

        // Seed Tags
        $tagNames = [
            'React', 'Laravel', 'Python', 'JavaScript', 'AI', 'Machine Learning',
            'DevOps', 'Node.js', 'Vue.js', 'Flutter', 'Blockchain', 'Cybersecurity',
            'Data Science', 'PHP', 'TypeScript',
        ];

        $tagColors = [
            '#00d4ff', '#a855f7', '#10b981', '#f59e0b', '#ef4444',
            '#3b82f6', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
            '#ec4899', '#14b8a6', '#6366f1',
        ];

        foreach ($tagNames as $i => $name) {
            Tag::firstOrCreate(
                ['name' => $name],
                ['color' => $tagColors[$i % count($tagColors)]]
            );
        }
        $this->command->info('Tags seeded.');

        $skills = [
            'React', 'Vue.js', 'Laravel', 'Django', 'FastAPI', 'Node.js',
            'TypeScript', 'Python', 'Java', 'Kotlin', 'Flutter', 'Docker',
            'AWS', 'PostgreSQL', 'MongoDB',
        ];

        foreach ($skills as $skill) {
            Skill::firstOrCreate(['name' => $skill]);
        }
        $this->command->info('Skills seeded.');

        $admin = User::firstOrCreate(
            ['username' => 'anwar_admin'],
            [
                'email' => env('ADMIN_EMAIL', 'anwar.azarzou.6969@gmail.com'),
                'name' => env('ADMIN_NAME', 'Anwar'),
                'password' => Hash::make(env('ADMIN_PASSWORD', '$adlifA0')),
                'role' => 'admin',
                'email_verified_at' => now(),
                'xp' => 0,
                'city' => 'Casablanca',
                'location' => 'Casablanca, Morocco',
            ]
        );
        $admin->syncRoles([Role::ADMIN]);
        $this->command->info("Admin user created: {$admin->email}");

        $this->command->info('DevRadar database seeded successfully.');
    }
}
