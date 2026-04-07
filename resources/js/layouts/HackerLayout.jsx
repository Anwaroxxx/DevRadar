import { Link, usePage } from '@inertiajs/react';
import { Terminal, Map, Calendar, Briefcase, Users, Trophy, Cpu, LogOut, Sun, Moon, MessageSquare, Zap, Menu, X, Shield, Clock as ClockIcon, ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AsciiWaterfall from '@/components/AsciiWaterfall';
import { motion, AnimatePresence } from 'framer-motion';

export default function HackerLayout({ children }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showNotification, setShowNotification] = useState(true);

    // Auto-dismiss notification after 5 seconds
    useEffect(() => {
        if (flash?.success || flash?.error || flash?.info) {
            setShowNotification(true);
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Live Clock Logic
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    
    // Forced Dark Mode Identity
    useEffect(() => {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    }, []);

    // Primary nav links - always visible on desktop
    const primaryNavLinks = [
        { href: '/',             label: 'Map',          icon: Map },
        { href: '/events',       label: 'Events',       icon: Calendar },
        { href: '/jobs',         label: 'Jobs',         icon: Briefcase },
        { href: '/communities',  label: 'Communities',  icon: Users },
    ];

    // Secondary nav links - in "More" dropdown
    const secondaryNavLinks = [
        { href: '/leaderboard',  label: 'Leaderboard',  icon: Trophy },
        { href: '/chat',         label: 'Chat',         icon: MessageSquare, badge: user?.unread_dm_count || 0 },
        { href: '/ai/chat',      label: 'AI Hub',       icon: Cpu, pulse: true },
        { href: '/marketplace',  label: 'Marketplace',  icon: Zap, glow: true },
    ];

    const adminLinks = (user?.role === 'admin' || user?.is_admin) ? [{ href: '/admin', label: 'Admin Panel', icon: Shield, admin: true }] : [];
    const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks, ...adminLinks];

    return (
        <div className="min-h-screen bg-[#050505] text-foreground font-sans flex flex-col selection:bg-primary selection:text-primary-foreground transition-colors duration-500 overflow-x-hidden">
            {/* Ascii Background */}
            <AsciiWaterfall />

            {/* Hacker Navbar */}
            <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Button */}
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-primary hover:bg-primary/20 transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>

                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2">
                                <Terminal className="w-6 h-6 text-primary" />
                                <span className="font-bold tracking-tighter uppercase">DEV<span className="text-primary">RADAR</span>_</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation - Primary Links Only */}
                        <nav className="hidden md:flex gap-6 lg:gap-8 items-center flex-1 justify-center text-sm font-bold uppercase tracking-wide">
                            {primaryNavLinks.map((link) => (
                                <Link 
                                    key={link.href}
                                    href={link.href} 
                                    className="hover:text-primary transition-colors flex items-center gap-2 group shrink-0"
                                >
                                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform"/> 
                                    {link.label}
                                </Link>
                            ))}
                            
                            {/* More Dropdown */}
                            <div className="relative group">
                                <button className="hover:text-primary transition-colors flex items-center gap-2 group shrink-0">
                                    <span>More</span>
                                    <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                                
                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-8 w-56 bg-card border border-border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                                    {secondaryNavLinks.map((link) => (
                                        <Link 
                                            key={link.href}
                                            href={link.href} 
                                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary/10 transition-all border-b border-border/50 last:border-b-0 group"
                                        >
                                            <link.icon className={`w-4 h-4 ${link.pulse ? 'animate-pulse' : ''}`} />
                                            <span>{link.label}</span>
                                            {!!link.badge && link.badge > 0 && (
                                                <span className="ml-auto min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center text-[10px] font-black bg-primary text-black border border-primary">
                                                    {link.badge > 99 ? '99+' : link.badge}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Admin Link - if user is admin */}
                            {adminLinks.length > 0 && (
                                <Link 
                                    href="/admin" 
                                    className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-2 ml-4 border-l border-yellow-400/30 pl-4 shrink-0"
                                >
                                    <Shield className="w-4 h-4" /> 
                                    Admin
                                </Link>
                            )}
                        </nav>

                        {/* Right Area: Clock & User */}
                        <div className="flex items-center gap-3 lg:gap-6 shrink-0">
                            {/* System Clock */}
                            <div className="hidden lg:flex items-center gap-2 border-l border-border pl-6 font-mono text-[10px] text-muted-foreground/60 tracking-[0.2em]">
                                <ClockIcon className="w-3 h-3 text-primary/40" />
                                {time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>

                            {user ? (
                                <div className="flex items-center gap-3 lg:gap-4">
                                    <div className="hidden sm:flex flex-col items-end leading-none">
                                        <div className="flex items-center gap-2">
                                            {user.is_admin && (
                                                <span className="text-[8px] bg-yellow-400 text-black px-1 font-black animate-pulse">SUDO</span>
                                            )}
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{user.username}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                            <span className="text-[10px] text-muted-foreground font-mono">{user.xp} XP</span>
                                        </div>
                                    </div>
                                    <Link href={`/profile/${user.username}`} className={`w-9 h-9 border-2 flex items-center justify-center font-black text-sm bg-card shrink-0 uppercase relative group overflow-hidden ${user.is_admin ? 'border-yellow-400 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]' : 'border-primary/50 text-primary shadow-[0_0_15px_rgba(34,197,94,0.1)]'}`}>
                                        {user.avatar ? (
                                            <img src={user.avatar} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name.charAt(0)
                                        )}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${user.is_admin ? 'bg-yellow-400/20' : 'bg-primary/20'}`}></div>
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

                {/* Mobile Navigation Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden bg-card border-b border-border overflow-hidden"
                        >
                            <nav className="p-4 flex flex-col gap-3 font-bold uppercase text-sm">
                                {allNavLinks.map((link) => (
                                    <Link 
                                        key={link.href}
                                        href={link.href} 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-all rounded border border-border/50 ${link.admin ? 'text-yellow-400 border-yellow-400/30' : ''}`}
                                    >
                                        <link.icon className={`w-4 h-4 shrink-0 ${link.pulse ? 'animate-pulse' : ''}`} />
                                        <span>{link.label}</span>
                                        {link.href === '/chat' && user?.unread_dm_count > 0 && (
                                            <span className="ml-auto min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center text-[10px] font-black bg-primary text-black border border-primary">
                                                {user.unread_dm_count > 99 ? '99+' : user.unread_dm_count}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                                <div className="border-t border-border mt-4 pt-4 flex items-center justify-between font-mono text-[9px] text-muted-foreground uppercase">
                                    <span>SYS_CLOCK: {time.toLocaleTimeString()}</span>
                                    <span>LVL_SEC: HI_VIS</span>
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Neural Notification Cluster */}
            <div className="fixed top-20 right-6 z-[60] flex flex-col gap-4 pointer-events-none w-80">
                <AnimatePresence>
                    {showNotification && (flash?.success || flash?.error || flash?.info) && (
                        <motion.div
                            initial={{ x: 300, opacity: 0, scale: 0.9 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: 300, opacity: 0, scale: 0.9 }}
                            className={`p-4 border-2 backdrop-blur-xl shadow-2xl relative overflow-hidden pointer-events-auto ${
                                flash?.error ? 'border-red-500 bg-red-500/10 text-red-500' : 
                                flash?.info ? 'border-blue-500 bg-blue-500/10 text-blue-500' :
                                'border-primary bg-primary/10 text-primary'
                            }`}
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 animate-scan opacity-30" />
                            <div className="flex items-start gap-3">
                                <Terminal className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 flex justify-between">
                                        <span>[SYS_MESSAGE]</span>
                                        <span className="opacity-40">{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <div className="text-xs font-mono font-bold leading-tight">
                                        {flash?.success || flash?.error || flash?.info}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowNotification(false)}
                                    className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer hover:text-current"
                                    title="Close notification"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            
                            {/* Decorative Corner HUD */}
                            <div className={`absolute bottom-1 right-1 w-2 h-2 border-r border-b ${flash?.error ? 'border-red-500' : 'border-primary'}`} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Main Content */}
            <main className="flex-1 w-full relative">
                {/* Premium Hacker Overlays */}
                <div className="scanline pointer-events-none opacity-[0.05] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20 animate-scan shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
                
                <div className="relative z-10 crt-flicker">
                    {children}
                </div>
            </main>

            {/* Hacker Footer */}
            <footer className="border-t border-border bg-black/80 py-8 relative z-10 shrink-0">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest text-center md:text-left">
                    <div>© {new Date().getFullYear()} DEVRADAR_MOROCCO // ALL_SYSTEMS_GO // BUILD: 2026.04.05</div>
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

