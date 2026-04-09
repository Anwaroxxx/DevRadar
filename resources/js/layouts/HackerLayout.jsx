import { Link, usePage } from '@inertiajs/react';
import { Terminal, Map as MapIcon, Calendar, Briefcase, Users, Trophy, Cpu, LogOut, MessageSquare, Zap, Menu, X, Shield, Clock as ClockIcon, ChevronDown, Bell, Radar } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AsciiWaterfall from '@/components/AsciiWaterfall';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingChat from '@/components/FloatingChat';

export default function HackerLayout({ children }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    
    // Forced Dark Mode Identity
    useEffect(() => {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    }, []);

    // Primary nav links
    const primaryNavLinks = [
        { href: '/',             label: 'Dashboard',    icon: Terminal },
        { href: '/cluster-zone', label: 'Cluster Zone', icon: Radar },
        { href: '/events',       label: 'Events',       icon: Calendar },
        { href: '/jobs',         label: 'Jobs',         icon: Briefcase },
        { href: '/communities',  label: 'Communities',  icon: Users },
        { href: '/leaderboard',  label: 'Leaderboard',  icon: Trophy },
        { href: '/chat',         label: 'Comms',        icon: MessageSquare, badge: user?.unread_dm_count || 0 },
        { href: '/ai/chat',      label: 'AI Core',      icon: Cpu, pulse: true },
        { href: '/marketplace',  label: 'Marketplace',  icon: Zap, glow: true },
    ];

    const adminLinks = (user?.role === 'admin' || user?.is_admin) ? [{ href: '/admin', label: 'Admin Panel', icon: Shield, admin: true }] : [];
    const allNavLinks = [...primaryNavLinks, ...adminLinks];

    return (
        <div className="min-h-screen bg-[#050505] text-foreground font-sans flex selection:bg-primary selection:text-primary-foreground transition-colors duration-500 overflow-hidden relative">
            {/* Ascii Background */}
            <AsciiWaterfall />

            {/* Mobile Top Bar (Only visible on small screens) */}
            <div className="md:hidden fixed top-0 w-full h-16 border-b border-border bg-card/80 backdrop-blur-md z-50 flex items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 group">
                    <Terminal className="w-5 h-5 text-primary group-hover:animate-pulse" />
                    <span className="font-extrabold tracking-tighter uppercase text-sm">DEV<span className="text-primary">RADAR</span>_</span>
                </Link>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-primary hover:bg-primary/20 transition-all border border-transparent"
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.aside 
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        className="md:hidden fixed inset-0 top-16 bg-card/95 border-r border-border overflow-y-auto backdrop-blur-2xl z-40 flex flex-col"
                    >
                        <nav className="p-4 flex flex-col gap-2 font-bold uppercase text-xs flex-1">
                            {allNavLinks.map((link) => (
                                <Link 
                                    key={link.href}
                                    href={link.href} 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center justify-between px-4 py-4 hover:bg-primary/10 transition-all border border-border/40 hover:border-primary/40 active:bg-primary/20 ${link.admin ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5' : 'bg-black/20'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <link.icon className={`w-4 h-4 shrink-0 ${link.pulse ? 'animate-pulse' : ''} ${link.admin ? 'text-yellow-400' : 'text-primary'}`} />
                                        <span className="tracking-widest">{link.label}</span>
                                    </div>
                                    
                                    {(!!link.badge || (link.href === '/chat' && user?.unread_dm_count > 0)) && (
                                        <span className="min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center text-[9px] font-black bg-primary text-black border border-primary shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                                            {link.badge || (link.href === '/chat' && user?.unread_dm_count) || 0}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </nav>
                        {user && (
                            <div className="p-4 border-t border-border mt-auto flex items-center justify-between">
                                <Link href={`/profile/${user.username}`} className="flex items-center gap-3 group">
                                    <div className="w-8 h-8 bg-card border border-primary/50 relative overflow-hidden">
                                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-primary font-bold">{user.name.charAt(0)}</div>}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-primary font-black tracking-widest">{user.username}</span>
                                        <span className="text-[8px] text-muted-foreground">{user.xp} XP</span>
                                    </div>
                                </Link>
                                <Link href="/logout" method="post" as="button" className="text-muted-foreground hover:text-red-500">
                                    <LogOut className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Fixed Left Sidebar */}
            <aside className="hidden md:flex flex-col w-64 md:w-72 fixed inset-y-0 left-0 border-r border-border bg-card/60 backdrop-blur-xl z-[100] shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-border/50 shrink-0">
                    <Link href="/" className="flex items-center gap-2 group w-full">
                        <Terminal className="w-6 h-6 text-primary group-hover:animate-pulse shrink-0" />
                        <span className="font-extrabold tracking-tighter uppercase text-lg truncate">DEV<span className="text-primary">RADAR</span>_</span>
                    </Link>
                </div>

                {/* Main Navigation */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4 pl-2 font-black mt-2">Core Access</div>
                    {primaryNavLinks.map((link) => (
                        <Link 
                            key={link.href}
                            href={link.href}
                            className={`flex items-center justify-between px-3 py-3 rounded-sm group hover:bg-primary/10 transition-colors ${usePage().url === link.href ? 'bg-primary/20 border border-primary/30' : 'border border-transparent'}`}
                        >
                            <div className="flex items-center gap-3">
                                <link.icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${link.pulse ? 'animate-pulse' : ''} ${usePage().url === link.href ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                                <span className={`text-xs font-bold uppercase tracking-widest ${usePage().url === link.href ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                                    {link.label}
                                </span>
                            </div>
                            {(!!link.badge || (link.href === '/chat' && user?.unread_dm_count > 0)) && (
                                <span className="px-1.5 py-0.5 inline-flex items-center justify-center text-[9px] font-black bg-primary text-black rounded-sm animate-pulse">
                                    {link.badge || (link.href === '/chat' && user?.unread_dm_count) || 0}
                                </span>
                            )}
                        </Link>
                    ))}

                    {adminLinks.length > 0 && (
                        <>
                            <div className="text-[10px] text-yellow-500/50 uppercase tracking-[0.2em] mb-4 pl-2 font-black mt-8">System Override</div>
                            {adminLinks.map(link => (
                                <Link 
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-3 px-3 py-3 rounded-sm group hover:bg-yellow-400/10 transition-colors border border-yellow-400/20 bg-yellow-400/5"
                                >
                                    <link.icon className="w-4 h-4 shrink-0 text-yellow-400 transition-transform group-hover:rotate-12" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 group-hover:text-yellow-300">
                                        {link.label}
                                    </span>
                                </Link>
                            ))}
                        </>
                    )}
                </div>

                {/* Bottom Profile & Notifications */}
                {user ? (
                    <div className="shrink-0 border-t border-border/50 p-4 bg-black/40">
                        {/* Status Line */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-mono text-primary/60 uppercase">Node Active</span>
                            </div>
                            
                            <div className="relative group">
                                <button className="relative p-1.5 text-muted-foreground border border-transparent hover:border-primary/30 hover:bg-primary/10 rounded transition-colors group-hover:text-primary">
                                    <Bell className="w-4 h-4" />
                                    {auth?.notifications?.length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary border border-black rounded-full animate-pulse" />
                                    )}
                                </button>
                                
                                {/* Notification Dropdown placed to the right of sidebar */}
                                <div className="absolute bottom-full left-full ml-4 mb-0 w-80 bg-black/95 border border-primary/30 shadow-[0_10px_40px_rgba(34,197,94,0.3)] hidden group-hover:block z-[9999] p-4 text-left font-mono backdrop-blur-3xl rounded-sm">
                                    {/* ... Notification contents (kept essentially the same, removed for brevity in this scratch pad, will put full code in final block) */}
                                    <div className="text-xs text-primary font-bold uppercase border-b border-primary/30 pb-2 mb-2 flex justify-between items-center tracking-widest">
                                        <span>Notifications</span>
                                        <Link href="/notifications" className="text-[9px] hover:underline bg-primary/10 px-2 py-0.5 rounded-sm">[ VIEW ALL ]</Link>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                                        {auth?.notifications?.length > 0 ? (
                                            auth.notifications.map((n) => (
                                                <Link key={n.id} href={n.data.action_url || '#'} className="block p-3 border-b border-white/5 hover:bg-primary/20 transition-colors group/notif relative overflow-hidden">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/50 group-hover/notif:bg-primary transition-colors"></div>
                                                    <div className="text-xs text-foreground group-hover/notif:text-white transition-colors leading-relaxed pl-2">{n.data.message}</div>
                                                    <div className="text-[10px] text-muted-foreground mt-2 opacity-70 flex justify-between pl-2">
                                                        <span>{new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                        <span className="text-primary tracking-widest uppercase">[{n.data.type || 'SYS'}]</span>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="p-6 text-xs text-center text-muted-foreground uppercase opacity-50 border border-dashed border-border/50 bg-black/50">
                                                No new signals detected.
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-black border-l border-b border-primary/30 rotate-45 hidden group-hover:block"></div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Block */}
                        <div className="flex items-center gap-3">
                            <Link href={`/profile/${user.username}`} className={`w-10 h-10 border shrink-0 flex items-center justify-center font-black text-sm bg-card uppercase relative group overflow-hidden ${user.is_admin ? 'border-yellow-400 text-yellow-400' : 'border-primary/50 text-primary'}`}>
                                {user.avatar ? (
                                    <img src={user.avatar} className="w-full h-full object-cover" />
                                ) : (
                                    user.name.charAt(0)
                                )}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${user.is_admin ? 'bg-yellow-400/20' : 'bg-primary/20'}`}></div>
                            </Link>
                            
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex items-center gap-1.5">
                                    <Link href={`/profile/${user.username}`} className="text-xs font-black uppercase text-foreground truncate hover:text-primary transition-colors">{user.username}</Link>
                                    {user.is_admin && <Shield className="w-3 h-3 text-yellow-400 shrink-0" />}
                                </div>
                                <div className="text-[10px] font-mono text-primary/70">{user.xp} XP</div>
                            </div>

                            <Link href="/logout" method="post" as="button" className="p-2 border border-border bg-black/40 text-muted-foreground hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all rounded-sm shrink-0">
                                <LogOut className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="shrink-0 border-t border-border/50 p-4 bg-black/40 flex flex-col gap-2">
                        <Link href="/login" className="w-full py-2 border border-border text-xs font-black uppercase text-center hover:bg-white/5 transition-colors">
                            Login
                        </Link>
                        <Link href="/register" className="w-full py-2 bg-primary/20 border border-primary text-primary text-xs font-black uppercase text-center hover:bg-primary hover:text-black transition-colors shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                            Register
                        </Link>
                    </div>
                )}
            </aside>

            {/* Neural Notification Cluster (Flash Messages) */}
            <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-4 pointer-events-none w-80">
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
                                        <span>[System Message]</span>
                                        <span className="opacity-40">{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <div className="text-xs font-mono font-bold leading-tight">
                                        {flash?.success || flash?.error || flash?.info}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowNotification(false)}
                                    className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer hover:text-current"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Main Content Area */}
            <main className="flex-1 w-full min-h-screen relative pt-16 md:pt-0 md:pl-[288px] overflow-x-hidden overflow-y-auto">
                {/* Premium Hacker Overlays */}
                <div className="scanline pointer-events-none opacity-[0.05] overflow-hidden fixed inset-0 z-50">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20 animate-scan shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
                
                <div className="relative z-10 crt-flicker flex flex-col min-h-full">
                    <div className="flex-1">
                        {children}
                    </div>

                    {/* Hacker Footer */}
                    <footer className="border-t border-border bg-black/80 py-8 relative z-10 shrink-0 mt-20">
                        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row justify-between items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest text-center lg:text-left">
                            <div>© {new Date().getFullYear()} DEVRADAR_MOROCCO // ALL_SYSTEMS_GO // BUILD: 2026.04.05</div>
                            <div className="flex gap-6">
                                <Link href="/about" className="hover:text-primary transition-colors">/ABOUT</Link>
                                <Link href="/support" className="hover:text-primary transition-colors">/SUPPORT</Link>
                                <a href="https://github.com" target="_blank" className="hover:text-primary transition-colors">/SRC_CODE</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </main>

            {/* Global Communication Uplink */}
            <FloatingChat />
        </div>
    );
}

