import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Terminal, Globe, Shield, Zap, Users, Calendar, Briefcase,
    Code2, Cpu, MapPin, ArrowRight, CheckCircle
} from 'lucide-react';

const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay },
    viewport: { once: true },
});

const pillars = [
    { icon: Globe, title: 'Discover Events', desc: 'Browse verified hackathons, workshops, and meetups across every Moroccan city — all in one live map.' },
    { icon: Users, title: 'Join Communities', desc: 'Connect with specialized developer groups. Meet your people, collaborate on projects, and grow together.' },
    { icon: Briefcase, title: 'Find Opportunities', desc: 'Access curated job listings from Morocco\'s top startups and tech companies, tailored for developers.' },
    { icon: Zap, title: 'Earn & Level Up', desc: 'Contribute content to earn XP. Spend it on AI tools, unlock ranks, and appear on the leaderboard.' },
    { icon: Cpu, title: 'AI-Powered Tools', desc: 'Use your earned XP to access AI code review, career advisory, resume builder, and post generators.' },
    { icon: Shield, title: 'Verified & Safe', desc: 'Every submission is reviewed by our team before going live, ensuring a high-quality, trustworthy network.' },
];

const timeline = [
    { year: '2026', label: 'Platform Launch', desc: 'DevRadar goes live, connecting Morocco\'s developer scene.' },
    { year: 'Q2 \'26', label: 'XP Economy', desc: 'Gamified contribution rewards with AI tools access.' },
    { year: 'Q3 \'26', label: 'Mobile App', desc: 'Native iOS/Android companion apps.' },
    { year: 'Future', label: 'Regional Expansion', desc: 'Scaling across North Africa and beyond.' },
];

export default function About() {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-[#050505] text-foreground font-mono selection:bg-primary/20 selection:text-primary overflow-x-hidden">
            <Head title="About | DevRadar Morocco" />

            {/* Grid BG */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Nav */}
            <nav className="relative z-50 border-b border-white/[0.04] bg-black/60 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-primary" />
                        <span className="font-black text-sm tracking-tighter uppercase">Dev<span className="text-primary">Radar</span></span>
                    </Link>
                    <div className="flex items-center gap-6 text-[9px] uppercase tracking-widest text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
                        {auth?.user ? (
                            <Link href="/dashboard" className="px-3 py-1 bg-primary text-black font-bold hover:bg-white transition-all">Dashboard</Link>
                        ) : (
                            <Link href="/login" className="hover:text-primary transition-colors">Sign In</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative z-10 py-28 px-6 text-center border-b border-white/[0.04]">
                <motion.div {...fade(0)} className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/20 bg-primary/5 mb-10">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    <span className="text-[9px] uppercase tracking-[0.3em] text-primary font-bold">About the Platform</span>
                </motion.div>

                <motion.h1 {...fade(0.1)} className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.88] max-w-4xl mx-auto">
                    One Platform.<br />
                    <span className="text-primary italic">Morocco's Entire Tech Scene.</span>
                </motion.h1>

                <motion.p {...fade(0.2)} className="mt-8 max-w-xl mx-auto text-muted-foreground text-sm uppercase tracking-wide leading-relaxed">
                    DevRadar was built to solve one problem: Morocco's tech ecosystem is incredibly active, 
                    but fragmented. We bring everything — events, jobs, communities, and AI tools — into a single, 
                    high-quality network.
                </motion.p>
            </section>

            {/* Mission */}
            <section className="relative z-10 py-24 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <motion.div {...fade(0)} className="space-y-6">
                        <div className="text-[9px] uppercase tracking-[0.3em] text-primary border-l-2 border-primary pl-4">Our Mission</div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">
                            Connect Every Developer.<br/>
                            <span className="text-primary italic">Across Every City.</span>
                        </h2>
                        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                            <p>Morocco has thousands of talented developers, but they're isolated — by city, by sector, by platform. DevRadar changes that. We built a live map that surfaces real tech activity and connects people to what matters.</p>
                            <p>Whether you're looking for your next job, your next community, or your next big idea — DevRadar is the place to start.</p>
                        </div>
                    </motion.div>
                    <motion.div {...fade(0.15)} className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Quality First', desc: 'All content is manually reviewed before it goes live.' },
                            { label: 'Earn as You Contribute', desc: 'XP rewards make participation meaningful.' },
                            { label: 'AI-Augmented', desc: 'Spend your XP on professional AI tools.' },
                            { label: 'Community Driven', desc: 'Built for developers, by someone who gets it.' },
                        ].map((item, i) => (
                            <div key={i} className="p-5 border border-white/[0.04] bg-[#0a0a0a] space-y-2">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                <div className="text-xs font-black uppercase tracking-tight">{item.label}</div>
                                <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Pillars */}
            <section className="relative z-10 py-24 px-6 border-y border-white/[0.04] bg-black/20">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fade()} className="text-center mb-16">
                        <div className="text-[9px] uppercase tracking-[0.3em] text-primary mb-4">What We Offer</div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                            Platform <span className="text-primary italic">Capabilities</span>
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
                        {pillars.map((p, i) => (
                            <motion.div
                                key={i}
                                {...fade(i * 0.05)}
                                className="bg-[#070707] p-7 group hover:bg-[#0d0d0d] transition-all"
                            >
                                <p.icon className="w-7 h-7 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-sm font-black uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="relative z-10 py-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div {...fade()} className="text-center mb-16">
                        <div className="text-[9px] uppercase tracking-[0.3em] text-primary mb-4">Roadmap</div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Where We're <span className="text-primary italic">Headed</span></h2>
                    </motion.div>
                    <div className="space-y-0">
                        {timeline.map((item, i) => (
                            <motion.div key={i} {...fade(i * 0.1)} className="flex gap-8 group">
                                <div className="flex flex-col items-center">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
                                    {i < timeline.length - 1 && <div className="w-px flex-1 bg-white/5 mt-2" />}
                                </div>
                                <div className={`pb-10 ${i === timeline.length - 1 ? '' : ''}`}>
                                    <div className="text-[9px] uppercase tracking-widest text-primary/60 mb-1">{item.year}</div>
                                    <div className="text-sm font-black uppercase tracking-tight mb-1 group-hover:text-primary transition-colors">{item.label}</div>
                                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 py-24 text-center px-6 border-t border-white/[0.04] bg-black/30">
                <motion.div {...fade()} className="space-y-6 max-w-xl mx-auto">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Join the <span className="text-primary italic">Network</span></h2>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Free forever. No credit card required.</p>
                    <Link href="/register"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_40px_rgba(34,197,94,0.2)] group"
                    >
                        Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </section>

            <footer className="relative z-10 border-t border-white/[0.04] py-8 text-center text-[9px] uppercase tracking-widest text-muted-foreground">
                © {new Date().getFullYear()} DevRadar Morocco
            </footer>
        </div>
    );
}
