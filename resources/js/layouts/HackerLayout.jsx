import { Link, usePage } from '@inertiajs/react';
import {
    Terminal,
    Map as MapIcon,
    Calendar,
    Briefcase,
    Users,
    Trophy,
    Cpu,
    LogOut,
    MessageSquare,
    Zap,
    Menu,
    X,
    Shield,
    Clock as ClockIcon,
    ChevronDown,
    Bell,
    Radar,
} from 'lucide-react';
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
        { href: '/', label: 'Dashboard', icon: Terminal },
        { href: '/cluster-zone', label: 'Cluster Zone', icon: Radar },
        { href: '/events', label: 'Events', icon: Calendar },
        { href: '/jobs', label: 'Jobs', icon: Briefcase },
        { href: '/communities', label: 'Communities', icon: Users },
        { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
        {
            href: '/chat',
            label: 'Comms',
            icon: MessageSquare,
            badge: user?.unread_dm_count || 0,
        },
        { href: '/ai/chat', label: 'AI Core', icon: Cpu, pulse: true },
        { href: '/marketplace', label: 'Marketplace', icon: Zap, glow: true },
    ];

    const staffLinks = ['admin', 'moderator'].includes(user?.role)
        ? [{ href: '/admin', label: 'Admin Panel', icon: Shield, admin: true }]
        : [];
    const allNavLinks = [...primaryNavLinks, ...staffLinks];

    return (
        <div className="relative flex min-h-screen overflow-hidden bg-[#050505] font-sans text-foreground transition-colors duration-500 selection:bg-primary selection:text-primary-foreground">
            {/* Ascii Background */}
            <AsciiWaterfall />

            {/* Mobile Top Bar (Only visible on small screens) */}
            <div className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md md:hidden">
                <Link href="/" className="group flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary group-hover:animate-pulse" />
                    <span className="text-sm font-extrabold tracking-tighter uppercase">
                        DEV<span className="text-primary">RADAR</span>_
                    </span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="border border-transparent p-2 text-primary transition-all hover:bg-primary/20"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        className="fixed inset-0 top-16 z-40 flex flex-col overflow-y-auto border-r border-border bg-card/95 backdrop-blur-2xl md:hidden"
                    >
                        <nav className="flex flex-1 flex-col gap-2 p-4 text-xs font-bold uppercase">
                            {allNavLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center justify-between border border-border/40 px-4 py-4 transition-all hover:border-primary/40 hover:bg-primary/10 active:bg-primary/20 ${link.admin ? 'border-yellow-400/20 bg-yellow-400/5 text-yellow-400' : 'bg-black/20'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <link.icon
                                            className={`h-4 w-4 shrink-0 ${link.pulse ? 'animate-pulse' : ''} ${link.admin ? 'text-yellow-400' : 'text-primary'}`}
                                        />
                                        <span className="tracking-widest">
                                            {link.label}
                                        </span>
                                    </div>

                                    {(!!link.badge ||
                                        (link.href === '/chat' &&
                                            user?.unread_dm_count > 0)) && (
                                        <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center border border-primary bg-primary px-1.5 text-[9px] font-black text-black shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                                            {link.badge ||
                                                (link.href === '/chat' &&
                                                    user?.unread_dm_count) ||
                                                0}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </nav>
                        {user && (
                            <div className="mt-auto flex items-center justify-between border-t border-border p-4">
                                <Link
                                    href={`/profile/${user.username}`}
                                    className="group flex items-center gap-3"
                                >
                                    <div className="relative h-8 w-8 overflow-hidden border border-primary/50 bg-card">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center font-bold text-primary">
                                                {user.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black tracking-widest text-primary">
                                            {user.username}
                                        </span>
                                        <span className="text-[8px] text-muted-foreground">
                                            {user.xp} XP
                                        </span>
                                    </div>
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="text-muted-foreground hover:text-red-500"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Link>
                            </div>
                        )}
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Fixed Left Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-[100] hidden w-64 flex-col border-r border-border bg-card/60 shadow-[10px_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl md:flex md:w-72">
                {/* Logo Area */}
                <div className="flex h-20 shrink-0 items-center border-b border-border/50 px-6">
                    <Link
                        href="/"
                        className="group flex w-full items-center gap-2"
                    >
                        <Terminal className="h-6 w-6 shrink-0 text-primary group-hover:animate-pulse" />
                        <span className="truncate text-lg font-extrabold tracking-tighter uppercase">
                            DEV<span className="text-primary">RADAR</span>_
                        </span>
                    </Link>
                </div>

                {/* Main Navigation */}
                <div className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-4">
                    <div className="mt-2 mb-4 pl-2 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                        Core Access
                    </div>
                    {primaryNavLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`group flex items-center justify-between rounded-sm px-3 py-3 transition-colors hover:bg-primary/10 ${usePage().url === link.href ? 'border border-primary/30 bg-primary/20' : 'border border-transparent'}`}
                        >
                            <div className="flex items-center gap-3">
                                <link.icon
                                    className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${link.pulse ? 'animate-pulse' : ''} ${usePage().url === link.href ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}
                                />
                                <span
                                    className={`text-xs font-bold tracking-widest uppercase ${usePage().url === link.href ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}
                                >
                                    {link.label}
                                </span>
                            </div>
                            {(!!link.badge ||
                                (link.href === '/chat' &&
                                    user?.unread_dm_count > 0)) && (
                                <span className="inline-flex animate-pulse items-center justify-center rounded-sm bg-primary px-1.5 py-0.5 text-[9px] font-black text-black">
                                    {link.badge ||
                                        (link.href === '/chat' &&
                                            user?.unread_dm_count) ||
                                        0}
                                </span>
                            )}
                        </Link>
                    ))}

                    {staffLinks.length > 0 && (
                        <>
                            <div className="mt-8 mb-4 pl-2 text-[10px] font-black tracking-[0.2em] text-yellow-500/50 uppercase">
                                System Override
                            </div>
                            {staffLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="group flex items-center gap-3 rounded-sm border border-yellow-400/20 bg-yellow-400/5 px-3 py-3 transition-colors hover:bg-yellow-400/10"
                                >
                                    <link.icon className="h-4 w-4 shrink-0 text-yellow-400 transition-transform group-hover:rotate-12" />
                                    <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase group-hover:text-yellow-300">
                                        {link.label}
                                    </span>
                                </Link>
                            ))}
                        </>
                    )}
                </div>

                {/* Bottom Profile & Notifications */}
                {user ? (
                    <div className="shrink-0 border-t border-border/50 bg-black/40 p-4">
                        {/* Status Line */}
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"></div>
                                <span className="font-mono text-[9px] text-primary/60 uppercase">
                                    Node Active
                                </span>
                            </div>

                            <div className="group relative">
                                <button className="relative rounded border border-transparent p-1.5 text-muted-foreground transition-colors group-hover:text-primary hover:border-primary/30 hover:bg-primary/10">
                                    <Bell className="h-4 w-4" />
                                    {auth?.notifications?.length > 0 && (
                                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 animate-pulse rounded-full border border-black bg-primary" />
                                    )}
                                </button>

                                {/* Notification Dropdown placed to the right of sidebar */}
                                <div className="absolute bottom-full left-full z-[9999] mb-0 ml-4 hidden w-80 rounded-sm border border-primary/30 bg-black/95 p-4 text-left font-mono shadow-[0_10px_40px_rgba(34,197,94,0.3)] backdrop-blur-3xl group-hover:block">
                                    {/* ... Notification contents (kept essentially the same, removed for brevity in this scratch pad, will put full code in final block) */}
                                    <div className="mb-2 flex items-center justify-between border-b border-primary/30 pb-2 text-xs font-bold tracking-widest text-primary uppercase">
                                        <span>Notifications</span>
                                        <Link
                                            href="/notifications"
                                            className="rounded-sm bg-primary/10 px-2 py-0.5 text-[9px] hover:underline"
                                        >
                                            [ VIEW ALL ]
                                        </Link>
                                    </div>
                                    <div className="custom-scrollbar max-h-80 overflow-y-auto pr-1">
                                        {auth?.notifications?.length > 0 ? (
                                            auth.notifications.map((n) => (
                                                <Link
                                                    key={n.id}
                                                    href={
                                                        n.data.action_url || '#'
                                                    }
                                                    className="group/notif relative block overflow-hidden border-b border-white/5 p-3 transition-colors hover:bg-primary/20"
                                                >
                                                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary/50 transition-colors group-hover/notif:bg-primary"></div>
                                                    <div className="pl-2 text-xs leading-relaxed text-foreground transition-colors group-hover/notif:text-white">
                                                        {n.data.message}
                                                    </div>
                                                    <div className="mt-2 flex justify-between pl-2 text-[10px] text-muted-foreground opacity-70">
                                                        <span>
                                                            {new Date(
                                                                n.created_at,
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )}
                                                        </span>
                                                        <span className="tracking-widest text-primary uppercase">
                                                            [
                                                            {n.data.type ||
                                                                'SYS'}
                                                            ]
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="border border-dashed border-border/50 bg-black/50 p-6 text-center text-xs text-muted-foreground uppercase opacity-50">
                                                No new signals detected.
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-1/2 -left-2 hidden h-4 w-4 -translate-y-1/2 rotate-45 transform border-b border-l border-primary/30 bg-black group-hover:block"></div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Block */}
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/profile/${user.username}`}
                                className={`group relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border bg-card text-sm font-black uppercase ${user.is_admin ? 'border-yellow-400 text-yellow-400' : 'border-primary/50 text-primary'}`}
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    user.name.charAt(0)
                                )}
                                <div
                                    className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${user.is_admin ? 'bg-yellow-400/20' : 'bg-primary/20'}`}
                                ></div>
                            </Link>

                            <div className="flex min-w-0 flex-1 flex-col justify-center">
                                <div className="flex items-center gap-1.5">
                                    <Link
                                        href={`/profile/${user.username}`}
                                        className="truncate text-xs font-black text-foreground uppercase transition-colors hover:text-primary"
                                    >
                                        {user.username}
                                    </Link>
                                    {user.is_admin && (
                                        <Shield className="h-3 w-3 shrink-0 text-yellow-400" />
                                    )}
                                </div>
                                <div className="font-mono text-[10px] text-primary/70">
                                    {user.xp} XP
                                </div>
                            </div>

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="shrink-0 rounded-sm border border-border bg-black/40 p-2 text-muted-foreground transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500"
                            >
                                <LogOut className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex shrink-0 flex-col gap-2 border-t border-border/50 bg-black/40 p-4">
                        <Link
                            href="/login"
                            className="w-full border border-border py-2 text-center text-xs font-black uppercase transition-colors hover:bg-white/5"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="w-full border border-primary bg-primary/20 py-2 text-center text-xs font-black text-primary uppercase shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-colors hover:bg-primary hover:text-black"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </aside>

            {/* Neural Notification Cluster (Flash Messages) */}
            <div className="pointer-events-none fixed top-20 right-6 z-[9999] flex w-80 flex-col gap-4">
                <AnimatePresence>
                    {showNotification &&
                        (flash?.success || flash?.error || flash?.info) && (
                            <motion.div
                                initial={{ x: 300, opacity: 0, scale: 0.9 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                exit={{ x: 300, opacity: 0, scale: 0.9 }}
                                className={`pointer-events-auto relative overflow-hidden border-2 p-4 shadow-2xl backdrop-blur-xl ${
                                    flash?.error
                                        ? 'border-red-500 bg-red-500/10 text-red-500'
                                        : flash?.info
                                          ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                                          : 'border-primary bg-primary/10 text-primary'
                                }`}
                            >
                                <div className="animate-scan absolute top-0 left-0 h-[1px] w-full bg-white/20 opacity-30" />
                                <div className="flex items-start gap-3">
                                    <Terminal className="mt-0.5 h-5 w-5 shrink-0" />
                                    <div className="flex-1">
                                        <div className="mb-1 flex justify-between text-[10px] font-black tracking-[0.2em] uppercase">
                                            <span>[System Message]</span>
                                            <span className="opacity-40">
                                                {new Date().toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    },
                                                )}
                                            </span>
                                        </div>
                                        <div className="font-mono text-xs leading-tight font-bold">
                                            {flash?.success ||
                                                flash?.error ||
                                                flash?.info}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setShowNotification(false)
                                        }
                                        className="cursor-pointer opacity-40 transition-opacity hover:text-current hover:opacity-100"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                </AnimatePresence>
            </div>

            {/* Main Content Area */}
            <main className="relative min-h-screen w-full flex-1 overflow-x-hidden overflow-y-auto pt-16 md:pt-0 md:pl-[288px]">
                {/* Premium Hacker Overlays */}
                <div className="scanline pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-[0.05]">
                    <div className="animate-scan absolute top-0 left-0 h-[2px] w-full bg-primary/20 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>

                <div className="crt-flicker relative z-10 flex min-h-full flex-col">
                    <div className="flex-1">{children}</div>

                    {/* Hacker Footer */}
                    <footer className="relative z-10 mt-20 shrink-0 border-t border-border bg-black/80 py-8">
                        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center font-mono text-[10px] tracking-widest text-muted-foreground uppercase lg:flex-row lg:text-left">
                            <div>
                                © {new Date().getFullYear()} DEVRADAR_MOROCCO //
                                ALL_SYSTEMS_GO // BUILD: 2026.04.05
                            </div>
                            <div className="flex gap-6">
                                <Link
                                    href="/about"
                                    className="transition-colors hover:text-primary"
                                >
                                    /ABOUT
                                </Link>
                                <Link
                                    href="/support"
                                    className="transition-colors hover:text-primary"
                                >
                                    /SUPPORT
                                </Link>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    className="transition-colors hover:text-primary"
                                >
                                    /SRC_CODE
                                </a>
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
