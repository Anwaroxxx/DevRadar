import { Head, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Trophy, Star, Award, Zap, Terminal } from 'lucide-react';

export default function LeaderboardIndex({ topContributors, eventCreators, communityBuilders }) {
    return (
        <HackerLayout>
            <Head title="Global Rankings" />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-12 border-b border-border pb-4">
                    <h1 className="text-3xl font-black uppercase tracking-widest text-primary">&gt; GLOBAL_RANKINGS</h1>
                    <div className="text-sm font-mono text-primary animate-pulse border border-primary px-3 py-1 bg-primary/10">
                        LIVE_FEED //
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Top Contributors */}
                    <div className="bg-card border border-primary/30 relative overflow-hidden">
                        <div className="bg-primary/10 py-4 px-6 border-b border-primary/30 flex items-center gap-3">
                            <Trophy className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-bold uppercase tracking-widest text-primary">Highest_XP</h2>
                        </div>
                        <div className="p-0">
                            {topContributors.map((user, index) => (
                                <div key={user.id} className={`flex items-center gap-4 p-4 border-b border-border hover:bg-primary/5 transition-colors ${index < 3 ? 'bg-primary/5' : ''}`}>
                                    <div className={`font-mono text-xl font-bold w-6 text-center ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                                        {index + 1}
                                    </div>
                                    <Link href={`/profile/${user.username}`} className="w-10 h-10 border border-primary flex items-center justify-center shrink-0 bg-primary/20 overflow-hidden font-bold">
                                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user.name.charAt(0)}
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/profile/${user.username}`} className="font-bold hover:text-primary truncate block transition-colors">
                                            {user.name}
                                        </Link>
                                        <div className="text-xs font-mono text-muted-foreground truncate">
                                            @{user.username} {user.city && `// ${user.city}`}
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="font-bold text-primary flex items-center justify-end gap-1">
                                            {user.xp} <Zap className="w-3 h-3 fill-primary" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Event Creators */}
                    <div className="bg-card border border-primary/30 relative overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
                        <div className="bg-card py-4 px-6 border-b border-border flex items-center gap-3">
                            <Star className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold uppercase tracking-widest">Master_Nodes (Events)</h2>
                        </div>
                        <div className="p-0">
                            {eventCreators.map((user, index) => (
                                <div key={user.id} className="flex items-center gap-3 p-3 border-b border-border/50 hover:bg-primary/5 transition-colors">
                                    <div className="font-mono text-sm font-bold w-4 text-center text-muted-foreground">{index + 1}</div>
                                    <div className="flex-1 min-w-0 flex items-center gap-2">
                                        <Link href={`/profile/${user.username}`} className="font-bold hover:text-primary truncate block transition-colors">
                                            {user.username}
                                        </Link>
                                    </div>
                                    <div className="text-xs font-mono text-primary border border-primary/30 px-2 bg-primary/10">
                                        {user.events_count} INIT
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Community Builders */}
                    <div className="bg-card border border-primary/30 relative overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
                        <div className="bg-card py-4 px-6 border-b border-border flex items-center gap-3">
                            <Award className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold uppercase tracking-widest">Cluster_Admins (Comm)</h2>
                        </div>
                        <div className="p-0">
                            {communityBuilders.map((user, index) => (
                                <div key={user.id} className="flex items-center gap-3 p-3 border-b border-border/50 hover:bg-primary/5 transition-colors">
                                    <div className="font-mono text-sm font-bold w-4 text-center text-muted-foreground">{index + 1}</div>
                                    <div className="flex-1 min-w-0 flex items-center gap-2">
                                        <Link href={`/profile/${user.username}`} className="font-bold hover:text-primary truncate block transition-colors">
                                            {user.username}
                                        </Link>
                                    </div>
                                    <div className="text-xs font-mono text-primary flex items-center gap-1">
                                         <Terminal className="w-3 h-3" /> {user.communities_count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </HackerLayout>
    );
}
