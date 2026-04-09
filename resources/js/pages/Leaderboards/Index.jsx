import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Trophy, Calendar, CalendarDays, Globe, Zap, Medal, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeaderboardIndex({ leaders, tab, filter, userRank }) {
    
    const handleTabChange = (newTab) => {
        router.get('/leaderboard', { tab: newTab, filter }, { preserveState: true });
    };

    const handleFilterChange = (newFilter) => {
        router.get('/leaderboard', { tab, filter: newFilter }, { preserveState: true });
    };

    const getTabIcon = () => {
        if (tab === 'events') return <Calendar className="w-5 h-5 text-primary" />;
        if (tab === 'clusters') return <Globe className="w-5 h-5 text-primary" />;
        return <Zap className="w-5 h-5 text-primary" />;
    };

    const getScoreLabel = () => {
        if (tab === 'events') return 'Events Created';
        if (tab === 'clusters') return 'Groups Created';
        return 'XP';
    };

    return (
        <HackerLayout>
            <Head title="Leaderboards // Rankings" />
            
            <div className="max-w-5xl mx-auto px-4 py-8 font-mono">
                {/* Header */}
                <div className="mb-8 border-b-2 border-primary/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase text-primary tracking-tighter flex items-center gap-3">
                            <Trophy className="w-10 h-10" /> Global Rankings
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2 uppercase tracking-widest">
                            Top performers on the DevRadar network.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 bg-black/40 p-1 border border-primary/20">
                        {['all', 'monthly', 'weekly'].map(f => (
                            <button
                                key={f}
                                onClick={() => handleFilterChange(f)}
                                className={`px-4 py-2 text-xs font-bold uppercase transition-all tracking-widest ${
                                    filter === f 
                                    ? 'bg-primary text-black' 
                                    : 'text-muted-foreground hover:bg-primary/20 hover:text-primary'
                                }`}
                            >
                                {f === 'all' ? 'All-Time' : f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-64 shrink-0 space-y-2">
                        {[
                            { id: 'xp', label: 'XP Leaders', icon: Zap },
                            { id: 'events', label: 'Top Event Creators', icon: Calendar },
                            { id: 'clusters', label: 'Top Group Founders', icon: Globe },
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => handleTabChange(t.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 border transition-all text-sm font-bold uppercase tracking-widest ${
                                    tab === t.id 
                                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(34,197,94,0.15)]' 
                                    : 'border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground bg-card'
                                }`}
                            >
                                <t.icon className={`w-4 h-4 ${tab === t.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                {t.label}
                            </button>
                        ))}
                        
                        {/* Personal Rank Widget */}
                        <div className="mt-8 pt-8 border-t border-primary/30">
                            <h3 className="text-xs font-black uppercase text-primary mb-4 tracking-widest flex items-center gap-2">
                                <Star className="w-3 h-3" /> Your Standings
                            </h3>
                            {userRank ? (
                                <div className="p-4 border border-primary/50 bg-black/50 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/20 transition-all pointer-events-none" />
                                    <div className="text-3xl font-black text-foreground">#{userRank.rank}</div>
                                    <div className="text-[10px] text-primary mt-1 font-bold uppercase tracking-wider">{getScoreLabel()}: {userRank.score.toLocaleString()}</div>
                                </div>
                            ) : (
                                <div className="p-4 border border-border/50 bg-card text-xs text-muted-foreground">
                                    Not ranked in the top 50. Keep pushing your limits!
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="border border-primary/30 bg-card shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-primary/5">
                                <div className="flex items-center gap-2 font-black uppercase text-sm tracking-widest text-primary">
                                    {getTabIcon()} {tab === 'xp' ? 'XP Leaders' : tab === 'events' ? 'Top Event Creators' : 'Top Group Founders'}
                                </div>
                                <div className="text-[10px] text-muted-foreground uppercase">{filter === 'all' ? 'All-Time' : filter}</div>
                            </div>
                            
                            <div className="divide-y divide-border/50">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${tab}-${filter}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {leaders.length > 0 ? (
                                            leaders.map((leader, index) => (
                                                <div 
                                                    key={leader.id} 
                                                    className={`flex items-center justify-between p-4 transition-colors ${
                                                        userRank?.id === leader.id ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-primary/5'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-8 font-black flex justify-center text-lg ${
                                                            index === 0 ? 'text-yellow-400' :
                                                            index === 1 ? 'text-gray-300' :
                                                            index === 2 ? 'text-amber-600' : 'text-muted-foreground'
                                                        }`}>
                                                            {index < 3 ? (
                                                                <div className="relative">
                                                                    <Medal className="w-6 h-6 animate-bounce" />
                                                                    <div className="absolute inset-0 bg-current/20 blur-md rounded-full" />
                                                                </div>
                                                            ) : `#${index + 1}`}
                                                        </div>
                                                        <div className="relative group/avatar">
                                                            <div className="w-12 h-12 border-2 border-primary/40 bg-black overflow-hidden flex items-center justify-center font-bold text-primary relative z-10">
                                                                {leader.avatar ? (
                                                                    <img src={leader.avatar} alt={leader.username} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    leader.name.charAt(0)
                                                                )}
                                                            </div>
                                                            {/* Level Badge Overlay */}
                                                            <div className="absolute -bottom-1 -right-1 bg-primary text-black font-black text-[8px] px-1.5 py-0.5 z-20 shadow-lg border border-black italic">
                                                                LV.{leader.level}
                                                            </div>
                                                            <div className="absolute inset-0 border border-primary/0 group-hover/avatar:border-primary/50 transition-all z-30 pointer-events-none" />
                                                        </div>
                                                        <div>
                                                            <Link href={`/profile/${leader.username}`} className="font-bold hover:text-primary transition-colors block">
                                                                 {leader.name}
                                                                {index < 3 && <span className="text-[8px] bg-primary/20 text-primary px-1 font-mono animate-pulse ml-2">ELITE_STATUS</span>}
                                                            </Link>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[9px] text-primary/60 font-black uppercase tracking-tighter">
                                                                    {leader.level_title}
                                                                </span>
                                                                <span className="text-[8px] text-muted-foreground opacity-50 font-mono">
                                                                    // @{leader.username}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-baseline justify-end gap-1">
                                                            <span className="font-black text-primary text-2xl tracking-tighter">
                                                                {leader.score.toLocaleString()}
                                                            </span>
                                                            <Zap className="w-3 h-3 text-primary fill-primary" />
                                                        </div>
                                                        <div className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground font-black">
                                                            {getScoreLabel()}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-12 text-center text-muted-foreground text-sm uppercase tracking-widest flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border/30 m-4">
                                                <Globe className="w-8 h-8 opacity-20" />
                                                No records found at this time.
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HackerLayout>
    );
}
