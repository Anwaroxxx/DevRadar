import { Link, usePage } from '@inertiajs/react';
import { Terminal, Map, Calendar, Briefcase, Users, Trophy, Cpu, LogOut, Sun, Moon, MessageSquare, Zap } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AsciiWaterfall from '@/components/AsciiWaterfall';

export default function HackerLayout({ children }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    
    // Forced Dark Mode Identity
    useEffect(() => {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-foreground font-sans flex flex-col selection:bg-primary selection:text-primary-foreground transition-colors duration-500">
            {/* Ascii Background */}
            <AsciiWaterfall />

            {/* Hacker Navbar */}
            <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        
                        {/* Logo */}
                        <div className="flex items-center gap-2 shrink-0">
                            <Link href="/" className="flex items-center gap-2">
                                <Terminal className="w-6 h-6 text-primary" />
                                <span className="font-bold tracking-tighter">DEV<span className="text-primary">RADAR</span>_</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex gap-4 lg:gap-6 items-center flex-1 justify-center text-[13px] font-bold uppercase tracking-tight">
                            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                                <Map className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"/> Map
                            </Link>
                            <Link href="/events" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                                <Calendar className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"/> Events
                            </Link>
                            <Link href="/jobs" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                                <Briefcase className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"/> Jobs
                            </Link>
                            <Link href="/communities" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                                <Users className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"/> Communities
                            </Link>
                            <Link href="/leaderboard" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                                <Trophy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"/> Leaderboard
                            </Link>
                            <Link href="/chat" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                                <MessageSquare className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"/> Chat
                            </Link>
                            <Link href="/ai/chat" className="hover:text-primary transition-colors flex items-center gap-1.5 group">
                                <Cpu className="w-3.5 h-3.5 group-hover:scale-110 transition-transform animate-pulse"/> AI Hub
                            </Link>
                            <Link href="/marketplace" className="hover:text-primary transition-colors flex items-center gap-1.5 group text-primary/80">
                                <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform fill-primary/20"/> Marketplace
                            </Link>
                        </nav>

                        {/* User Menu */}
                        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
                            {user ? (
                                <div className="flex items-center gap-3 lg:gap-4">
                                    <div className="hidden sm:flex flex-col items-end leading-none">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{user.username}</span>
                                        <div className="flex items-center gap-1 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                            <span className="text-[10px] text-muted-foreground font-mono">{user.xp} XP</span>
                                        </div>
                                    </div>
                                    <Link href={`/profile/${user.username}`} className="w-9 h-9 border-2 border-primary/50 flex items-center justify-center font-black text-sm bg-card text-primary shrink-0 uppercase shadow-[0_0_15px_rgba(34,197,94,0.1)] relative group overflow-hidden">
                                        {user.avatar ? (
                                            <img src={user.avatar} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name.charAt(0)
                                        )}
                                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </Link>
                                    <Link href="/logout" method="post" as="button" className="p-2 text-muted-foreground hover:text-destructive transition-colors group">
                                        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href="/login" className="text-xs font-black uppercase hover:text-primary transition-colors">
                                        Login
                                    </Link>
                                    <Link href="/register" className="bg-primary/10 text-primary border-2 border-primary px-4 py-2 text-xs font-black uppercase tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:bg-primary hover:text-primary-foreground transition-all">
                                        INIT
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="bg-primary text-primary-foreground py-2 px-4 shadow-[0_4px_10px_rgba(34,197,94,0.2)] relative z-50 flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest animate-in slide-in-from-top-full duration-500">
                    <Terminal className="w-4 h-4" /> [SYS]: {flash.success}
                </div>
            )}
            
            {/* Main Content */}
            <main className="flex-1 w-full relative">
                {/* Premium Hacker Overlays */}
                <div className="scanline pointer-events-none opacity-[0.05]"></div>
                
                <div className="relative z-10 crt-flicker">
                    {children}
                </div>
            </main>

            {/* Hacker Footer */}
            <footer className="border-t border-border bg-black/80 py-8 relative z-10">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    <div>© {new Date().getFullYear()} DEVRADAR_MOROCCO // ALL_SYSTEMS_GO</div>
                    <div className="flex gap-6">
                        <Link href="/about" className="hover:text-primary transition-colors">/ABOUT</Link>
                        <Link href="/support" className="hover:text-primary transition-colors">/SUPPORT</Link>
                        <a href="https://github.com" target="_blank" className="hover:text-primary transition-colors">/SRC_CODE</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
