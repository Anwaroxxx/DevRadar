import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Calendar, Briefcase, Network, Zap, Shield,
    Clock, AlertTriangle, CheckCircle,
    Cpu, ArrowRight, FileText, AlertCircle,
    Activity, Radio, Terminal, Database, Lock, LifeBuoy
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function AdminDashboard({ stats, recentUsers, recentEvents, recentJobs, userGrowth, eventsByCategory, recentAuditLogs = [] }) {
    const { auth } = usePage().props;
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hudMetrics = [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#3b82f6', trend: '+12.5%' },
        { label: 'Total Events', value: stats.totalEvents, icon: Calendar, color: '#22c55e', trend: '+5.2%' },
        { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: '#fbbf24', trend: '-2.1%' },
        { label: 'Communities', value: stats.totalCommunities, icon: Network, color: '#a855f7', trend: '+8.0%' },
    ];

    const alerts = [
        { label: 'Pending Approvals', count: (stats.pendingEvents + stats.pendingJobs + stats.pendingCommunities), icon: Clock, color: 'text-yellow-400', href: '/admin/moderation?type=events' },
        { label: 'Security Reports', count: stats.openReports, icon: AlertCircle, color: 'text-red-400', href: '/admin/moderation?type=reports' },
    ];

    return (
        <HackerLayout>
            <Head title="Admin Dashboard" />
            
            <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6 font-mono text-xs">
                {/* HUD HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/40 border border-primary/20 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                    
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="relative">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 border border-primary/20 rounded-full flex items-center justify-center"
                            >
                                <div className="w-12 h-12 border border-dashed border-primary/40 rounded-full"></div>
                            </motion.div>
                            <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                        </div>
                        
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none">
                                Admin Dashboard // <span className="text-primary italic">Moderation Core</span>
                            </h1>
                            <div className="flex items-center gap-4 mt-2 text-[10px] text-primary/60 font-black">
                                <span className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-primary animate-pulse" /> SYSTEM ONLINE</span>
                                <span className="flex items-center gap-1.5"><Radio className="w-3 h-3 text-primary" /> LATENCY: 24ms</span>
                                <span className="flex items-center gap-1.5 opacity-40"><Lock className="w-3 h-3" /> SECURE SESSION</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right hidden md:block">
                        <div className="text-xl font-black tabular-nums">{currentTime.toLocaleTimeString()}</div>
                        <div className="text-[10px] text-primary/40 uppercase tracking-widest">{currentTime.toDateString()}</div>
                        <div className="mt-1 flex gap-2 justify-end">
                            <span className="px-2 py-0.5 border border-primary/20 text-primary text-[8px] font-black">LOGIN ID: {auth.user.username.toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                {/* MAIN HUD GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
                    {/* LEFT PANEL: SYSTEM METRICS */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* TOP METRICS ROW */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {hudMetrics.map((metric, idx) => (
                                <motion.div
                                    key={metric.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-black/60 border border-primary/10 p-4 relative group hover:border-primary/40 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-[9px] uppercase tracking-tighter text-muted-foreground">{metric.label}</div>
                                        <metric.icon style={{ color: metric.color }} className="w-4 h-4 opacity-50" />
                                    </div>
                                    <div className="text-2xl font-black tabular-nums">{metric.value.toLocaleString()}</div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 h-1 bg-primary/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: '70%' }}
                                                className="h-full bg-primary/40"
                                            />
                                        </div>
                                        <span className="text-[9px] text-primary font-black">{metric.trend}</span>
                                    </div>
                                    {/* Scanline decoration */}
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                                        <motion.div 
                                            animate={{ y: ['-100%', '200%'] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            className="h-10 w-full bg-gradient-to-b from-transparent via-primary to-transparent"
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* GROWTH ANALYTICS */}
                        <div className="bg-black/40 border border-primary/10 p-6 relative">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Database className="w-5 h-5 text-primary" />
                                    <span className="font-black uppercase tracking-widest text-sm">User Growth Flow</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-[9px] px-2 py-0.5 border border-primary/20 text-primary/60">TOTAL USERS: {stats.totalUsers}</span>
                                    <span className="text-[9px] px-2 py-0.5 border border-primary/20 text-primary/60">REAL-TIME SYNC: ACTIVE</span>
                                </div>
                            </div>
                            
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={userGrowth}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis 
                                            dataKey="month" 
                                            stroke="#ffffff40" 
                                            fontSize={8} 
                                            tickLine={false} 
                                            axisLine={false} 
                                        />
                                        <YAxis 
                                            stroke="#ffffff40" 
                                            fontSize={8} 
                                            tickLine={false} 
                                            axisLine={false} 
                                            tickFormatter={(val) => `${val}`}
                                        />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(34,197,94,0.3)', fontSize: '10px' }}
                                            itemStyle={{ color: '#22c55e' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="count" 
                                            stroke="#22c55e" 
                                            strokeWidth={2}
                                            fillOpacity={1} 
                                            fill="url(#colorCount)" 
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* SIGNAL LOGS TABLE (AUDIT) */}
                        <div className="bg-black/40 border border-primary/10 overflow-hidden">
                            <div className="px-6 py-4 border-b border-primary/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <span className="font-black uppercase tracking-widest">Recent Activity Log</span>
                                </div>
                                <Link href="/admin/audit-logs" className="text-[10px] text-primary hover:underline">VIEW FULL LOGS →</Link>
                            </div>
                            <div className="p-0 overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-primary/5 text-[9px] uppercase tracking-widest text-primary/60">
                                            <th className="px-3 md:px-6 py-3 font-black border-b border-primary/10">Timestamp</th>
                                            <th className="px-3 md:px-6 py-3 font-black border-b border-primary/10">Admin</th>
                                            <th className="px-3 md:px-6 py-3 font-black border-b border-primary/10">Action</th>
                                            <th className="px-3 md:px-6 py-3 font-black border-b border-primary/10">Target</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {recentAuditLogs.map(log => (
                                            <tr key={log.id} className="hover:bg-primary/5 transition-colors group text-[9px] md:text-[10px]">
                                                <td className="px-3 md:px-6 py-3 text-muted-foreground italic">{new Date(log.created_at).toLocaleTimeString()}</td>
                                                <td className="px-3 md:px-6 py-3 font-black">{log.admin?.username.toUpperCase() || 'SYS'}</td>
                                                <td className="px-3 md:px-6 py-3">
                                                    <span className="text-[8px] md:text-[9px] px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary font-black uppercase tracking-tighter">
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-3 md:px-6 py-3 text-muted-foreground">
                                                    {log.target_type}#{log.target_id}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: SECURITY & OPERATIONS */}
                    <div className="space-y-6">
                        {/* THREAT ALERTS SECTION */}
                        <div className="bg-black/60 border border-red-500/20 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-red-400">
                                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                                    <span className="font-black uppercase tracking-widest text-sm">Security & Moderation</span>
                                </div>
                                <span className="text-[8px] border border-red-500/40 px-1 text-red-500">PRIORITY 1</span>
                            </div>
                            
                            <div className="space-y-3">
                                {alerts.map(alert => (
                                    <Link 
                                        key={alert.label}
                                        href={alert.href}
                                        className="block p-3 border border-primary/10 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <alert.icon className={`w-4 h-4 ${alert.color}`} />
                                                <span className="text-[10px] uppercase font-black tracking-tight">{alert.label}</span>
                                            </div>
                                            <div className={`text-sm font-black tabular-nums ${alert.count > 0 ? alert.color : 'text-primary/20'}`}>
                                                {alert.count}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* QUICK COMMAND CENTER */}
                        <div className="bg-black/60 border border-primary/20 p-6 space-y-6">
                            <div className="flex items-center gap-2 text-primary">
                                <Terminal className="w-5 h-5" />
                                <span className="font-black uppercase tracking-widest text-sm">Quick Management</span>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { label: 'User Management',  href: '/admin/users',           icon: Users },
                                    { label: 'Event Management', href: '/admin/events',          icon: Database },
                                    { label: 'XP System',        href: '/admin/xp-economy',     icon: Zap },
                                    { label: 'Support Tickets',  href: '/admin/support-tickets', icon: LifeBuoy },
                                    { label: 'Global Settings',  href: '/admin/settings',        icon: Cpu },
                                ].map(cmd => (
                                    <Link 
                                        key={cmd.label}
                                        href={cmd.href}
                                        className="flex items-center justify-between p-3 border border-primary/5 bg-primary/[0.02] hover:bg-primary/10 hover:border-primary/20 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <cmd.icon className="w-3.5 h-3.5 text-primary opacity-50 group-hover:opacity-100" />
                                            <span className="text-[9px] uppercase font-black text-muted-foreground group-hover:text-primary transition-colors">{cmd.label}</span>
                                        </div>
                                        <ArrowRight className="w-3 h-3 text-primary/20 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* TOP OPERATORS (RECENT USERS) */}
                        <div className="bg-black/40 border border-primary/10 p-6">
                            <div className="flex items-center gap-2 text-muted-foreground mb-6">
                                <Users className="w-5 h-5 opacity-40" />
                                <span className="font-black uppercase tracking-widest text-sm text-primary/40">Recent Registrations</span>
                            </div>
                            <div className="space-y-4">
                                {recentUsers.map(user => (
                                    <div key={user.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 border border-primary/20 bg-primary/5 flex items-center justify-center font-black text-primary text-[10px]">
                                                {user.name?.[0]}
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-foreground group-hover:text-primary transition-colors">{user.name}</div>
                                                <div className="text-[8px] font-mono text-muted-foreground">@{user.username}</div>
                                            </div>
                                        </div>
                                        <div className="text-[9px] font-black text-primary text-right italic">{user.xp} XP</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style jsx>{`
                .tabular-nums {
                    font-variant-numeric: tabular-nums;
                }
            `}</style>
        </HackerLayout>
    );
}
