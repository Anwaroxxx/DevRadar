<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Community;
use App\Models\Tag;
use App\Models\Skill;
use App\Models\Badge;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Seed Badges safely
        $badges = [
            ['name'=>'Newcomer',     'icon'=>'🌱','description'=>'Just joined DevRadar','requirement'=>'register','xp_threshold'=>0],
            ['name'=>'Explorer',     'icon'=>'🔭','description'=>'Earned 100 XP','requirement'=>'xp_100','xp_threshold'=>100],
            ['name'=>'Contributor',  'icon'=>'⚡','description'=>'Earned 300 XP','requirement'=>'xp_300','xp_threshold'=>300],
            ['name'=>'Event Master', 'icon'=>'🎯','description'=>'Earned 500 XP','requirement'=>'xp_500','xp_threshold'=>500],
            ['name'=>'Legend',       'icon'=>'🏆','description'=>'Earned 1000 XP','requirement'=>'xp_1000','xp_threshold'=>1000],
        ];

        foreach ($badges as $badge) {
            Badge::firstOrCreate(['name' => $badge['name']], $badge);
        }

        // ✅ Seed Tags safely
        $tagNames  = [
            'React','Laravel','Python','JavaScript','AI','Machine Learning',
            'DevOps','Node.js','Vue.js','Flutter','Blockchain','Cybersecurity',
            'Data Science','PHP','TypeScript'
        ];

        $tagColors = [
            '#00d4ff','#a855f7','#10b981','#f59e0b','#ef4444',
            '#3b82f6','#8b5cf6','#06b6d4','#84cc16','#f97316',
            '#ec4899','#14b8a6','#6366f1'
        ];

        foreach ($tagNames as $i => $name) {
            Tag::firstOrCreate(
                ['name' => $name],
                ['color' => $tagColors[$i % count($tagColors)]]
            );
        }

        // ✅ Seed Skills safely
        $skills = [
            'React','Vue.js','Laravel','Django','FastAPI','Node.js',
            'TypeScript','Python','Java','Kotlin','Flutter','Docker',
            'AWS','PostgreSQL','MongoDB'
        ];

        foreach ($skills as $skill) {
            Skill::firstOrCreate(['name' => $skill]);
        }

        // ✅ Create admin safely (avoid duplicates)
        User::firstOrCreate(
            ['username' => 'anwar_admin'], // check by username to avoid duplicate
            [
                'email'    => env('ADMIN_EMAIL', 'anwar.azarzou.@gmail.com'),
                'name'     => env('ADMIN_NAME', 'Admin'),
                'password' => Hash::make(env('ADMIN_PASSWORD', '$adlifA0')),
                'role'     => 'admin',
                'xp'       => 0,
                'city'     => 'Casablanca',
                'location' => 'Casablanca, Morocco',
            ]
        );

        $this->command->info('✅ DevRadar seeded successfully!');
    }
}