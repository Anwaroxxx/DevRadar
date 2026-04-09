import React from 'react';
import { Head, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Terminal, Plus, Activity, Cpu, Database, MapPin, Briefcase, Shield } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const hackerIcon = new L.Icon({
    iconUrl:     'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl:   'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    shadowSize:  [41, 41],
});

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

export default function Home({ stats, upcomingEvents, mapEvents, auth }) {
    const [typewriterText, setTypewriterText] = React.useState('');
    const [isLg, setIsLg] = React.useState(false);
    const fullText = "DEVRADAR_MOROCCO.V1";

    React.useEffect(() => {
        let i = 0;
        const iv = setInterval(() => { setTypewriterText(fullText.slice(0, i)); i++; if (i > fullText.length) clearInterval(iv); }, 100);
        return () => clearInterval(iv);
    }, []);

    // Track lg breakpoint so we can switch grid layout in JS
    React.useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        setIsLg(mq.matches);
        const handler = (e) => setIsLg(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const SIDEBAR_W = 288;

    return (
        <HackerLayout>
            <Head title="Dashboard | DevRadar" />

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

                {/* ── Hero ── */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-2 border-primary/40 bg-card relative shadow-[0_0_50px_rgba(34,197,94,0.05)]"
                >
                    <div className="absolute inset-0 pointer-events-none digital-noise opacity-[0.07] z-0" />

                    {/*
                        Use inline style grid so React controls the columns — no
                        Tailwind purge issues, no specificity fights.
                        On desktop: [1fr] [288px]  ← sidebar is a hard fixed col
                        On mobile:  single column stack
                    */}
                    <div
                        className="relative z-10 p-6 md:p-10"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: isLg ? `1fr ${SIDEBAR_W}px` : '1fr',
                            gap: '2rem',
                            alignItems: 'start',
                        }}
                    >
                        {/* Left: title + stats */}
                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="h-0.5 w-12 bg-primary animate-pulse" />
                                <span className="text-primary font-mono text-xs font-black tracking-[0.3em] uppercase">
                                    System Status: Online
                                </span>
                            </div>

                            {/*
                                clamp keeps the font size proportional to the
                                container width — it will never overflow its cell.
                            */}
                            <h1
                                className="font-black uppercase tracking-tighter leading-none mb-6 text-primary "
                                style={{ fontSize: 'clamp(2rem, 5.5vw, 5rem)', wordBreak: 'break-word' }}
                            >
                                {typewriterText}<span className="animate-pulse">_</span>
                            </h1>

                            <p className="text-lg text-muted-foreground mb-10 max-w-2xl font-mono leading-relaxed border-l-2 border-primary/20 pl-6 py-2">
                                The centralized platform for the{' '}
                                <span className="text-primary font-bold">Moroccan Developer Network</span>.{' '}
                                Discover events, find job opportunities, and join local communities in real-time.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                                {[
                                    { value: stats?.events,      label: 'Upcoming Events',   Icon: Activity  },
                                    { value: stats?.jobs,        label: 'Job Opportunities', Icon: Briefcase },
                                    { value: stats?.communities, label: 'Active Communities', Icon: Cpu       },
                                ].map(({ value, label, Icon }) => (
                                    <div key={label} className="border border-primary/20 p-6 bg-primary/5 relative hover:border-primary/60 transition-all">
                                        <div className="text-4xl font-black text-primary"><Counter value={value ?? 0} /></div>
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">{label}</div>
                                        <div className="absolute top-2 right-2 opacity-10"><Icon className="w-4 h-4" /></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: sidebar — fixed width column, never shrinks */}
                        <div className="space-y-4" style={{ width: isLg ? SIDEBAR_W : '100%' }}>
                            <div className="bg-black/60 border border-primary/30 p-4 font-mono text-xs">
                                <div className="flex items-center gap-2 mb-4 text-primary font-bold border-b border-primary/20 pb-2">
                                    <Terminal className="w-4 h-4" /> Quick Actions
                                </div>
                                <div className="space-y-2">
                                    {auth?.user?.is_admin && (
                                        <Link href="/admin" className="flex items-center justify-between p-2 border border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all text-yellow-400">
                                            <span>&gt; Admin Panel</span>
                                            <Shield className="w-3 h-3" />
                                        </Link>
                                    )}
                                    {[
                                        { href: '/events/create',      label: 'Create Event', icon: <Plus className="w-3 h-3 text-primary" />     },
                                        { href: '/communities/create', label: 'Create Community', icon: <Plus className="w-3 h-3 text-primary" />     },
                                        { href: '/jobs/create',        label: 'Post a Job',      icon: <Plus className="w-3 h-3 text-primary" />     },
                                        { href: '/ai/chat',            label: 'AI Assistant', icon: <Activity className="w-3 h-3 text-primary" /> },
                                    ].map(({ href, label, icon }) => (
                                        <Link key={href} href={href} className="flex items-center justify-between p-2 border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all">
                                            <span>&gt; {label}</span>
                                            {icon}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border border-primary/30 text-[10px] font-mono">
                                <span className="text-primary animate-pulse">Platform Status: Online</span>
                                <span className="text-primary/60">LVL: {auth?.user?.xp ?? 0} XP</span>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── Dashboard Stats ── */}
                <section>
                    <div className="flex justify-between items-center mb-6 border-b border-primary/30 pb-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <Activity className="w-5 h-5 text-primary flex-shrink-0" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-primary neon-text truncate">
                                [ Recent Activity ]
                            </h2>
                        </div>
                        <Link 
                            href="/cluster-zone" 
                            className="group flex items-center gap-3 px-4 py-2 border border-primary/40 bg-primary/5 hover:bg-primary transition-all text-primary hover:text-black font-mono text-xs font-black uppercase"
                        >
                            <MapPin className="w-3 h-3 group-hover:animate-bounce" />
                            Open Map View
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
                        {/* Live Activity Stream */}
                        <div className="border border-primary/20 bg-black/40 p-6 flex flex-col space-y-4">
                            <div className="text-[10px] text-primary/40 font-mono uppercase tracking-[0.2em] border-b border-primary/10 pb-2">Recent Platform Activity</div>
                            <div className="space-y-4 font-mono text-xs">
                                {upcomingEvents.slice(0, 3).map((event, i) => (
                                    <div key={i} className="flex gap-4 items-start border-l-2 border-primary/10 pl-4 hover:border-primary transition-colors py-1">
                                        <div className="text-primary/40">[{new Date(event.created_at).toLocaleTimeString()}]</div>
                                        <div>
                                            <div className="text-foreground uppercase font-bold">{event.title}</div>
                                            <div className="text-muted-foreground text-[10px]">LOC: {event.city.toUpperCase()} // Approved</div>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 text-[9px] text-primary/30 animate-pulse italic">
                                    &gt;&gt; Monitoring local activity...
                                </div>
                            </div>
                        </div>

                        {/* Network Stats / Info */}
                        <div className="border border-primary/20 bg-black/40 p-6 flex flex-col">
                            <div className="text-[10px] text-primary/40 font-mono uppercase tracking-[0.2em] border-b border-primary/10 pb-2 mb-4">Network Guidelines</div>
                            <div className="space-y-3">
                                <Link href="/leaderboard" className="flex items-center justify-between p-3 border border-primary/10 hover:border-primary/40 bg-primary/5 group transition-all">
                                    <div className="flex items-center gap-3 font-mono text-xs">
                                        <Shield className="w-4 h-4 text-primary" />
                                        <span>Leaderboard</span>
                                    </div>
                                    <span className="text-[10px] text-primary group-hover:translate-x-1 transition-transform">View Ranking &gt;</span>
                                </Link>
                                <div className="p-4 border border-dashed border-primary/10 text-[10px] text-muted-foreground leading-relaxed uppercase">
                                    Engagement levels are determined by community contributions. Posts are reviewed for quality before appearing on the public feed.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Upcoming Events ── */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Database className="w-5 h-5 text-primary flex-shrink-0" />
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">&gt; Upcoming Events</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.map((event, idx) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="border border-primary/20 p-5 hover:border-primary transition-all bg-card group relative overflow-hidden flex flex-col"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-10 font-mono text-[8px]">0x{event.id}</div>
                                <div className="text-[10px] text-primary mb-2 font-mono uppercase tracking-widest border-l-2 border-primary pl-2">{event.category}</div>
                                <h3 className="font-bold text-xl mb-2 truncate group-hover:text-primary transition-colors">{event.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4 font-mono line-clamp-2 flex-1">{event.description}</p>
                                <div className="flex justify-between items-center text-[10px] font-mono border-t border-border/50 pt-4 mt-auto">
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.city}</span>
                                    <Link href={`/events/${event.id}`} className="px-3 py-1 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                                        [View Details]
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .leaflet-popup-content-wrapper { background: var(--card); color: var(--foreground); border-radius: 0; border: 1px solid var(--primary); padding: 0; }
                .leaflet-popup-tip { background: var(--primary); }
                .leaflet-popup-content { margin: 0; }
                .leaflet-container a.leaflet-popup-close-button { color: var(--primary); padding: 4px; }
            `}} />
        </HackerLayout>
    );
}