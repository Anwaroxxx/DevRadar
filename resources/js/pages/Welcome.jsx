import React, { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    Users, Calendar, Briefcase, ArrowRight, Zap, Shield,
    Globe, Code2, MapPin, Terminal, ChevronDown
} from 'lucide-react';

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ end, suffix = '' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !started) {
                setStarted(true);
                let start = 0;
                const step = Math.ceil(end / 60);
                const timer = setInterval(() => {
                    start += step;
                    if (start >= end) { setCount(end); clearInterval(timer); }
                    else setCount(start);
                }, 16);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, started]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Scrolling words ticker ────────────────────────────────────────────────────
const TICKER = ['Hackathons', 'Job Openings', 'Dev Communities', 'Tech Events', 'AI Tools', 'Leaderboards', 'City Meetups'];

export default function Welcome({ auth, stats = {} }) {
    const [tickerIdx, setTickerIdx] = useState(0);
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -60]);

    useEffect(() => {
        const t = setInterval(() => setTickerIdx(i => (i + 1) % TICKER.length), 2800);
        return () => clearInterval(t);
    }, []);

    const features = [
        {
            icon: Globe,
            title: 'Live Tech Map',
            desc: 'Visualize every event, meetup, and community across Morocco on an interactive map. Never miss what\'s happening near you.',
            color: 'text-cyan-400',
            glow: 'shadow-[0_0_30px_rgba(34,211,238,0.2)]',
        },
        {
            icon: Calendar,
            title: 'Events & Meetups',
            desc: 'Browse verified tech events from hackathons to workshops. Attend, save, and share — all in one place.',
            color: 'text-amber-400',
            glow: 'shadow-[0_0_30px_rgba(251,191,36,0.2)]',
        },
        {
            icon: Briefcase,
            title: 'Career Board',
            desc: 'Curated job listings from Morocco\'s fastest-growing startups and established tech companies.',
            color: 'text-primary',
            glow: 'shadow-[0_0_30px_rgba(34,197,94,0.2)]',
        },
        {
            icon: Users,
            title: 'Dev Communities',
            desc: 'Find and join specialized groups. Collaborate, learn, and grow with developers who share your passions.',
            color: 'text-purple-400',
            glow: 'shadow-[0_0_30px_rgba(192,132,252,0.2)]',
        },
        {
            icon: Zap,
            title: 'XP & Rewards',
            desc: 'Earn experience points for every contribution. Level up, unlock AI tools, and climb the leaderboards.',
            color: 'text-yellow-400',
            glow: 'shadow-[0_0_30px_rgba(250,204,21,0.2)]',
        },
        {
            icon: Code2,
            title: 'AI Tools Hub',
            desc: 'Spend your earned XP on AI-powered career tools: code review, resume builder, and post generator.',
            color: 'text-pink-400',
            glow: 'shadow-[0_0_30px_rgba(244,114,182,0.2)]',
        },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-foreground overflow-x-hidden font-mono selection:bg-primary/20 selection:text-primary">
            <Head title="DevRadar — Morocco's Developer Network" />

            {/* ── Grid background ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>

            {/* ── Nav ── */}
            <nav className="relative z-50 border-b border-white/[0.04] bg-black/60 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 border border-primary/40 bg-primary/5 flex items-center justify-center group-hover:bg-primary/15 transition-all">
                            <Terminal className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-black text-lg tracking-tighter uppercase">
                            Dev<span className="text-primary">Radar</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-widest text-muted-foreground">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#stats" className="hover:text-primary transition-colors">Stats</a>
                        <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                        <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link href="/dashboard"
                                className="px-5 py-2 bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                                Enter Platform
                            </Link>
                        ) : (
                            <>
                                <Link href="/login"
                                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors hidden sm:block">
                                    Sign In
                                </Link>
                                <Link href="/register"
                                    className="px-5 py-2 border border-primary/50 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all">
                                    Join Free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <motion.section
                style={{ opacity: heroOpacity, y: heroY }}
                className="relative z-10 min-h-[92vh] flex flex-col items-center justify-center text-center px-6 py-24"
            >
                {/* Status pill */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/20 bg-primary/5 mb-10"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] uppercase tracking-[0.3em] text-primary font-bold">
                        Network Status: Online
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.88] max-w-6xl"
                >
                    Morocco's
                    <br />
                    <span className="text-primary italic">Developer</span>
                    <br />
                    Network.
                </motion.h1>

                {/* Animated ticker */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex items-center gap-3 text-muted-foreground"
                >
                    <span className="text-sm">Discover</span>
                    <div className="border-l border-primary/30 pl-3 h-6 overflow-hidden w-44 text-left">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={tickerIdx}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="block text-sm text-primary font-bold"
                            >
                                {TICKER[tickerIdx]}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Sub-headline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 max-w-xl text-muted-foreground text-sm leading-relaxed uppercase tracking-wide"
                >
                    One platform to find tech events, join communities, access AI tools,
                    and grow your career across the kingdom.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-10 flex flex-col sm:flex-row gap-4 items-center"
                >
                    <Link
                        href="/register"
                        className="group flex items-center gap-3 px-10 py-4 bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_40px_rgba(34,197,94,0.25)]"
                    >
                        Create Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/login"
                        className="px-10 py-4 border border-white/10 text-xs font-black uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all"
                    >
                        Sign In
                    </Link>
                </motion.div>

                {/* Scroll cue */}
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 text-muted-foreground/30"
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </motion.section>

            {/* ── Live Stats Bar ── */}
            <section id="stats" className="relative z-10 border-y border-white/[0.04] bg-black/40 backdrop-blur py-12">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { label: 'Developers', val: stats.users || 0, icon: Users, color: 'text-cyan-400' },
                        { label: 'Communities', val: stats.communities || 0, icon: Globe, color: 'text-purple-400' },
                        { label: 'Events Posted', val: stats.events || 0, icon: Calendar, color: 'text-amber-400' },
                        { label: 'Job Listings', val: stats.jobs || 0, icon: Briefcase, color: 'text-primary' },
                    ].map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            viewport={{ once: true }}
                            className="space-y-2"
                        >
                            <s.icon className={`w-5 h-5 mx-auto ${s.color} mb-3`} />
                            <div className={`text-3xl md:text-4xl font-black tracking-tighter ${s.color}`}>
                                <Counter end={s.val} suffix="+" />
                            </div>
                            <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Features Grid ── */}
            <section id="features" className="relative z-10 py-28 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 space-y-4"
                    >
                        <div className="inline-block px-3 py-1 border border-primary/20 text-[9px] uppercase tracking-[0.3em] text-primary">
                            Platform Architecture
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                            Everything You Need.<br />
                            <span className="text-primary italic">All in One Place.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                viewport={{ once: true }}
                                className="relative bg-[#070707] p-8 group hover:bg-[#0c0c0c] transition-all overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/20 transition-all duration-700" />
                                <f.icon className={`w-8 h-8 ${f.color} mb-5 group-hover:scale-110 transition-transform`} />
                                <h3 className="text-base font-black uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
                                    {f.title}
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {f.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Trust / Verification strip ── */}
            <section className="relative z-10 py-20 border-y border-white/[0.04] bg-black/30">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-3xl font-black uppercase tracking-tighter">
                                Built on Trust.<br />
                                <span className="text-primary italic">Verified by Design.</span>
                            </h2>
                            <div className="space-y-3">
                                {[
                                    'All events and jobs go through admin approval before going live.',
                                    'User identities can be verified by the platform team.',
                                    'Content reports are reviewed and acted on within 24h.',
                                ].map((point, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm font-mono text-muted-foreground">
                                        <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        {point}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="relative w-40 h-40 border border-primary/20 flex items-center justify-center">
                                <Shield className="w-16 h-16 text-primary animate-glow-pulse" />
                                <div className="absolute inset-0 border border-primary/10 scale-[1.15]" />
                                <div className="absolute inset-0 border border-primary/5 scale-[1.3]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="relative z-10 py-28 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto space-y-8"
                >
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight">
                        Ready to Join<br />
                        <span className="text-primary italic">the Network?</span>
                    </h2>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest">
                        Free to join. No credit card required.
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-3 px-12 py-5 bg-primary text-black font-black uppercase text-sm tracking-widest hover:bg-white transition-all shadow-[0_0_60px_rgba(34,197,94,0.3)] group"
                    >
                        Get Started Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </section>

            {/* ── Footer ── */}
            <footer className="relative z-10 border-t border-white/[0.04] py-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[9px] uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-3 h-3 text-primary/40" />
                        © {new Date().getFullYear()} DevRadar Morocco
                    </div>
                    <div className="flex gap-8">
                        <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                        <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
                        <Link href="/login" className="hover:text-primary transition-colors">Sign In</Link>
                        <Link href="/register" className="hover:text-primary transition-colors">Register</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
