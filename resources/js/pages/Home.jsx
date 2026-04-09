import React from 'react';
import { Head, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Activity, Cpu, Database, MapPin, Briefcase, Trophy, Zap, Clock, CheckCircle, ShieldAlert, Navigation } from 'lucide-react';

const Counter = ({ value, duration = 2 }) => {
    const [count, setCount] = React.useState(0);
    React.useEffect(() => {
        const end = parseInt(value) || 0;
        if (!end) return;
        const step = Math.max((duration * 1000) / end, 10);
        let cur = 0;
        const t = setInterval(() => { cur++; setCount(cur); if (cur >= end) clearInterval(t); }, step);
        return () => clearInterval(t);
    }, [value, duration]);
    return <span>{count.toLocaleString()}</span>;
};

export default function Home({ stats, myEvents, myCommunities, radarCommunities, auth }) {
    const [typewriterText, setTypewriterText] = React.useState('');
    const fullText = "COMMAND_CENTER.V1";

    React.useEffect(() => {
        let i = 0;
        const iv = setInterval(() => { setTypewriterText(fullText.slice(0, i)); i++; if (i > fullText.length) clearInterval(iv); }, 100);
        return () => clearInterval(iv);
    }, []);

    // Time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "MORNING CYCLE";
        if (hour < 18) return "MIDDAY CYCLE";
        return "NIGHT CYCLE";
    };

    return (
        <HackerLayout>
            <Head title="Command Center | DevRadar" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">

                {/* ── Dashboard Hero: Operating Metrics ── */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-2 border-primary/40 bg-card relative shadow-[0_0_50px_rgba(34,197,94,0.05)] overflow-hidden"
                >
                    <div className="absolute inset-0 pointer-events-none digital-noise opacity-[0.07] z-0" />
                    
                    <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row gap-10">
                        {/* Left: Greeting & Title */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="h-0.5 w-12 bg-primary animate-pulse" />
                                <span className="text-primary font-mono text-xs font-black tracking-[0.3em] uppercase">
                                    [ {getGreeting()} INITIALIZED ]
                                </span>
                            </div>

                            <h1 className="font-black uppercase tracking-tighter leading-none mb-4 text-primary text-4xl md:text-5xl lg:text-6xl overflow-hidden text-ellipsis whitespace-nowrap">
                                {typewriterText}<span className="animate-pulse">_</span>
                            </h1>

                            <p className="text-lg text-muted-foreground mb-8 font-mono leading-relaxed max-w-xl">
                                Welcome back, rogue operator <span className="text-primary font-bold">{auth?.user?.username}</span>.
                                Here are your operating metrics and active protocols within the Moroccan Developer Network.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/events/create" className="bg-primary/20 hover:bg-primary border border-primary text-primary hover:text-black font-black uppercase text-xs px-6 py-3 transition-colors flex items-center gap-2 tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                                    <Activity className="w-4 h-4" /> Deploy Event
                                </Link>
                                <Link href="/communities/create" className="hover:bg-primary/10 border border-border hover:border-primary text-foreground font-black uppercase text-xs px-6 py-3 transition-colors flex items-center gap-2 tracking-widest">
                                    <Cpu className="w-4 h-4 text-primary" /> Start Hub
                                </Link>
                            </div>
                        </div>

                        {/* Right: Personal Stats Grid */}
                        <div className="w-full md:w-80 grid grid-cols-2 gap-4 shrink-0 font-mono">
                            {[
                                { value: stats?.xp,               label: 'XP',         icon: Trophy },
                                { value: stats?.pending_approvals,label: 'Pending',    icon: Clock },
                                { value: stats?.connections,      label: 'Following',  icon: Zap },
                                { value: stats?.followers,        label: 'Followers',  icon: MapPin },
                            ].map((stat, i) => (
                                <div key={i} className={`border p-4 relative transition-colors ${stat.label === 'Pending' && stat.value > 0 ? 'border-yellow-500/40 bg-yellow-500/10 hover:border-yellow-500/80' : 'border-primary/20 bg-primary/5 hover:border-primary/60'}`}>
                                    <div className={`text-2xl font-black ${stat.label === 'Pending' && stat.value > 0 ? 'text-yellow-500 font-bold animate-pulse' : 'text-primary'}`}>
                                        <Counter value={stat.value} duration={1} />
                                    </div>
                                    <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-1 font-bold">{stat.label}</div>
                                    <div className={`absolute top-2 right-2 opacity-20 ${stat.label === 'Pending' && stat.value > 0 ? 'text-yellow-500' : 'text-primary'}`}>
                                        <stat.icon className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* ── Left Column: Personal Nexus (My Content) ── */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* My Events Sub-panel */}
                        <section className="border border-primary/20 bg-card p-6">
                            <div className="flex items-center justify-between border-b border-primary/20 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <Database className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-black uppercase tracking-widest text-primary">My Event Protocols</h2>
                                </div>
                                <Link href="/events" className="text-[10px] uppercase font-mono tracking-widest border border-primary/30 px-2 py-1 hover:bg-primary/20 text-primary">View All</Link>
                            </div>

                            {myEvents?.length > 0 ? (
                                <div className="grid gap-4">
                                    {myEvents.map(event => (
                                        <Link key={event.id} href={`/events/${event.id}`} className="group flex flex-col sm:flex-row sm:items-center justify-between border border-border hover:border-primary/50 bg-black/40 p-4 transition-colors">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="font-bold text-sm tracking-wide group-hover:text-primary transition-colors flex items-center gap-2">
                                                    {event.title}
                                                </h3>
                                                <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-3">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(event.event_date).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.city}</span>
                                                </div>
                                            </div>
                                            <div className="mt-3 sm:mt-0 flex items-center shrink-0">
                                                {event.is_approved ? (
                                                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-black text-primary bg-primary/10 px-2 py-1 border border-primary/30 uppercase tracking-widest">
                                                        <CheckCircle className="w-3 h-3" /> Live
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-black text-yellow-500 bg-yellow-500/10 px-2 py-1 border border-yellow-500/30 uppercase tracking-widest">
                                                        <Clock className="w-3 h-3 animate-spin-slow" /> Pending Approval
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-xs font-mono uppercase tracking-widest text-muted-foreground border border-dashed border-border/50 bg-black/20">
                                    No active event protocols found.
                                </div>
                            )}
                        </section>

                        {/* My Communities Sub-panel */}
                        <section className="border border-primary/20 bg-card p-6">
                            <div className="flex items-center justify-between border-b border-primary/20 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <Cpu className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-black uppercase tracking-widest text-primary">Managed Hubs</h2>
                                </div>
                            </div>

                            {myCommunities?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {myCommunities.map(comm => (
                                        <Link key={comm.id} href={`/communities/${comm.id}`} className="group border border-border hover:border-primary/50 bg-black/40 p-4 transition-colors relative overflow-hidden flex flex-col">
                                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                                <Cpu className="w-8 h-8" />
                                            </div>
                                            <h3 className="font-bold text-sm truncate pr-8 mb-1 group-hover:text-primary transition-colors">{comm.name}</h3>
                                            <div className="text-[10px] font-mono text-muted-foreground mb-4">
                                                {comm.followers_count} Nodes Attached
                                            </div>
                                            <div className="mt-auto">
                                                {comm.approval_status === 'approved' ? (
                                                    <span className="text-[9px] font-black uppercase text-primary tracking-widest border border-primary/30 px-1 py-0.5">Approved</span>
                                                ) : (
                                                    <span className="text-[9px] font-black uppercase text-yellow-500 tracking-widest border border-yellow-500/30 px-1 py-0.5 animate-pulse">Pending Review</span>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-xs font-mono uppercase tracking-widest text-muted-foreground border border-dashed border-border/50 bg-black/20">
                                    No hubs managed.
                                </div>
                            )}
                        </section>
                    </div>

                    {/* ── Right Column: Radar Scan (Recommendations) ── */}
                    <div className="space-y-6">
                        <div className="border border-primary/20 bg-black/40 p-6 flex flex-col">
                            <div className="flex items-center gap-2 border-b border-primary/20 pb-3 mb-4">
                                <Navigation className="w-4 h-4 text-primary animate-pulse" />
                                <span className="text-xs font-mono font-black tracking-[0.2em] uppercase text-primary">Radar Target Scan</span>
                            </div>
                            
                            <div className="space-y-4">
                                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-2">
                                    // Recommended nodes based on your location and skills.
                                </p>
                                
                                {radarCommunities?.length > 0 ? (
                                    radarCommunities.map(node => (
                                        <Link key={node.id} href={`/communities/${node.id}`} className="flex items-start gap-4 p-3 border border-border hover:border-primary/40 bg-card transition-all group">
                                            <div className="w-10 h-10 shrink-0 bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors font-bold uppercase tracking-tighter">
                                                {node.name.substring(0, 2)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-bold truncate group-hover:text-primary transition-colors">{node.name}</div>
                                                <div className="text-[10px] text-muted-foreground font-mono mt-1 w-full truncate">
                                                    {node.description?.substring(0, 50) || 'Active tech hub.'}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center text-[10px] font-mono text-muted-foreground py-4 border border-dashed border-border/40">
                                        Scan complete. No matching targets.
                                    </div>
                                )}
                            </div>
                            
                        </div>

                        {/* System Announcements Frame */}
                        <div className="border border-border p-5 text-xs font-mono bg-primary/5 relative overflow-hidden">
                            <div className="w-full h-1 bg-primary/20 absolute top-0 left-0">
                                <div className="h-full bg-primary animate-pulse w-1/3"></div>
                            </div>
                            <div className="flex items-center gap-2 text-primary font-bold uppercase mb-2 mt-2 tracking-widest">
                                <ShieldAlert className="w-4 h-4" /> System Notice
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Engagement levels are critical for platform stability. Ensure high-quality data transmission on all Event and Community creation requests. Spam protocols explicitly forbidden.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </HackerLayout>
    );
}
