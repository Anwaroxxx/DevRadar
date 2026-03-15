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
        // Badges
        $badges = [
            ['name'=>'Newcomer',       'icon'=>'🌱','description'=>'Just joined DevRadar','requirement'=>'register','xp_threshold'=>0],
            ['name'=>'Explorer',       'icon'=>'🔭','description'=>'Earned 100 XP',       'requirement'=>'xp_100', 'xp_threshold'=>100],
            ['name'=>'Contributor',    'icon'=>'⚡','description'=>'Earned 300 XP',       'requirement'=>'xp_300', 'xp_threshold'=>300],
            ['name'=>'Event Master',   'icon'=>'🎯','description'=>'Earned 500 XP',       'requirement'=>'xp_500', 'xp_threshold'=>500],
            ['name'=>'Legend',         'icon'=>'🏆','description'=>'Earned 1000 XP',      'requirement'=>'xp_1000','xp_threshold'=>1000],
        ];
        foreach ($badges as $badge) Badge::create($badge);

        // Tags
        $tagNames = ['React','Laravel','Python','JavaScript','AI','Machine Learning','DevOps','Node.js','Vue.js','Flutter','Blockchain','Cybersecurity','Data Science','PHP','TypeScript'];
        $tagColors = ['#00d4ff','#a855f7','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#06b6d4','#84cc16','#f97316','#ec4899','#14b8a6','#6366f1'];
        foreach ($tagNames as $i => $name) {
            Tag::create(['name'=>$name,'color'=>$tagColors[$i % count($tagColors)]]);
        }

        // Skills
        $skills = ['React','Vue.js','Laravel','Django','FastAPI','Node.js','TypeScript','Python','Java','Kotlin','Flutter','Docker','AWS','PostgreSQL','MongoDB'];
        foreach ($skills as $skill) Skill::create(['name'=>$skill]);

        // Sample Users
        $admin = User::create([
            'name'=>'Ahmed El Khamlichi','email'=>'ahmed@devradar.ma','password'=>Hash::make('password'),
            'username'=>'ahmed_dev','bio'=>'Full-stack developer & DevRadar founder from Casablanca.',
            'city'=>'Casablanca','location'=>'Casablanca, Morocco','xp'=>850,'role'=>'admin',
        ]);
        $user2 = User::create([
            'name'=>'Fatima Zahra','email'=>'fatima@devradar.ma','password'=>Hash::make('password'),
            'username'=>'fatima_z','bio'=>'Frontend developer passionate about React & design.',
            'city'=>'Rabat','location'=>'Rabat, Morocco','xp'=>420,'role'=>'developer',
        ]);
        $user3 = User::create([
            'name'=>'Youssef Benali','email'=>'youssef@devradar.ma','password'=>Hash::make('password'),
            'username'=>'youssef_b','bio'=>'DevOps engineer & open-source contributor.',
            'city'=>'Marrakech','location'=>'Marrakech, Morocco','xp'=>310,'role'=>'developer',
        ]);

        // Assign skills
        $admin->skills()->attach([1,2,3,4,5]);
        $user2->skills()->attach([1,2,8]);
        $user3->skills()->attach([9,10,11]);

        // Events
        $events = [
            ['user_id'=>$admin->id,'title'=>'ReactJS Casablanca Meetup','description'=>'Monthly React developers meetup in Casablanca.','city'=>'Casablanca','organizer'=>'CasaDev','website'=>'https://meetup.com','event_date'=>now()->addDays(10),'category'=>'event','latitude'=>33.5731,'longitude'=>-7.5898],
            ['user_id'=>$admin->id,'title'=>'Moroccan Hackathon 2026','description'=>'48-hour hackathon solving Morocco\'s challenges with tech.','city'=>'Rabat','organizer'=>'TechMaroc','website'=>'https://hackathon.ma','event_date'=>now()->addDays(20),'category'=>'hackathon','latitude'=>34.0209,'longitude'=>-6.8416],
            ['user_id'=>$user2->id,'title'=>'AI & Machine Learning Workshop','description'=>'Hands-on ML workshop for beginners using Python.','city'=>'Marrakech','organizer'=>'MarrakechTech','website'=>null,'event_date'=>now()->addDays(15),'category'=>'workshop','latitude'=>31.6295,'longitude'=>-7.9811],
            ['user_id'=>$user3->id,'title'=>'DevOps Summit Fes','description'=>'Docker, Kubernetes, and CI/CD best practices.','city'=>'Fes','organizer'=>'DevOps Maroc','website'=>null,'event_date'=>now()->addDays(30),'category'=>'event','latitude'=>34.0181,'longitude'=>-5.0078],
            ['user_id'=>$user2->id,'title'=>'Women in Tech Agadir','description'=>'Empowering women in the Moroccan tech scene.','city'=>'Agadir','organizer'=>'WiT Morocco','website'=>null,'event_date'=>now()->addDays(7),'category'=>'event','latitude'=>30.4278,'longitude'=>-9.5981],
            ['user_id'=>$admin->id,'title'=>'SolidHack Tangier','description'=>'Tangier\'s biggest outdoor hackathon near the Mediterranean.','city'=>'Tangier','organizer'=>'TangierDev','website'=>null,'event_date'=>now()->addDays(25),'category'=>'hackathon','latitude'=>35.7595,'longitude'=>-5.8340],
        ];
        foreach ($events as $ev) {
            $event = Event::create($ev);
            $event->tags()->attach(Tag::inRandomOrder()->take(3)->pluck('id'));
        }

        // Jobs
        $jobs = [
            ['user_id'=>$admin->id,'title'=>'React Developer Intern','company'=>'Hexagone Maroc','city'=>'Casablanca','type'=>'internship','is_remote'=>false,'description'=>'Work on our React frontend for our SaaS product.','apply_link'=>'https://hexagonemaroc.com/careers','tech_stack'=>['React','TypeScript','TailwindCSS']],
            ['user_id'=>$user2->id,'title'=>'Full Stack Developer','company'=>'CWG Solutions','city'=>'Rabat','type'=>'full-time','is_remote'=>true,'description'=>'Build features for our e-commerce platform using Laravel + Vue.js.','apply_link'=>'https://cwg.ma/careers','tech_stack'=>['Laravel','Vue.js','MySQL']],
            ['user_id'=>$user3->id,'title'=>'DevOps Engineer Junior','company'=>'Linkdata','city'=>'Marrakech','type'=>'full-time','is_remote'=>false,'description'=>'Manage CI/CD pipelines and infrastructure.','apply_link'=>'https://linkdata.ma','tech_stack'=>['Docker','Kubernetes','AWS']],
            ['user_id'=>$admin->id,'title'=>'Mobile Developer Flutter','company'=>'AppFactory','city'=>'Casablanca','type'=>'full-time','is_remote'=>true,'description'=>'Build cross-platform apps for our fintech clients.','apply_link'=>'https://appfactory.ma','tech_stack'=>['Flutter','Dart','Firebase']],
        ];
        foreach ($jobs as $job) JobListing::create($job);

        // Communities
        $communities = [
            ['user_id'=>$admin->id,'name'=>'React Morocco','description'=>'The official React community for Moroccan developers.','platform'=>'Discord','join_link'=>'https://discord.gg/reactmaroc','city'=>'Casablanca','category'=>'frontend','member_count'=>1240],
            ['user_id'=>$user2->id,'name'=>'PHP & Laravel Maroc','description'=>'PHP and Laravel developers across Morocco.','platform'=>'Telegram','join_link'=>'https://t.me/laravelmaroc','city'=>'Rabat','category'=>'backend','member_count'=>890],
            ['user_id'=>$user3->id,'name'=>'DevOps Maroc','description'=>'Cloud-native, Docker, CI/CD - all things DevOps in Morocco.','platform'=>'Discord','join_link'=>'https://discord.gg/devopsmaroc','city'=>null,'category'=>'devops','member_count'=>560],
            ['user_id'=>$admin->id,'name'=>'AI Maroc','description'=>'Artificial Intelligence researchers and practitioners in Morocco.','platform'=>'Discord','join_link'=>'https://discord.gg/aimaroc','city'=>null,'category'=>'ai','member_count'=>2130],
            ['user_id'=>$user2->id,'name'=>'GirlsWhoCode Morocco','description'=>'Supporting women entering the tech industry in Morocco.','platform'=>'Meetup','join_link'=>'https://meetup.com/girlswhocode-morocco','city'=>'Casablanca','category'=>'general','member_count'=>430],
        ];
        foreach ($communities as $comm) Community::create($comm);

        // Award badges to admin
        $admin->checkBadges();
        $user2->checkBadges();
        $user3->checkBadges();

        $this->command->info('✅ DevRadar Morocco seeded successfully!');
    }
}
