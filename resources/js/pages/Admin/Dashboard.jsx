import { Head, Link, usePage } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import {
    Users, Calendar, Briefcase, Network, Zap, Shield,
    Clock, AlertTriangle, CheckCircle,
    Cpu, ArrowRight, FileText, AlertCircle
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function AdminDashboard({ stats, recentUsers, recentEvents, recentJobs, topUsers, userGrowth, xpByRole, eventsByCategory, recentAuditLogs = [] }) {
    const statCards = [
        { label: 'Total Users',       value: stats.totalUsers,       icon: Users,    color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/30' },
        { label: 'Total Events',      value: stats.totalEvents,      icon: Calendar, color: 'text-primary',    bg: 'bg-primary/10',    border: 'border-primary/30' },
        { label: 'Active Jobs',       value: stats.activeJobs,       icon: Briefcase,color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
        { label: 'Communities',       value: stats.totalCommunities, icon: Network,  color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
        { label: 'Total XP Awarded',  value: stats.totalXp,          icon: Zap,      color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
        { label: 'Pending Events',    value: stats.pendingEvents,    icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
        { label: 'Pending Jobs',      value: stats.pendingJobs,      icon: Clock, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
        { label: 'Pending Communities', value: stats.pendingCommunities, icon: Clock, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
        { label: 'AI Access Users',   value: stats.aiAccessUsers,    icon: Cpu,      color: 'text-cyan-400',   bg: 'bg-cyan-400/10',   border: 'border-cyan-400/30' },
    ];

    const adminLinks = [
        { href: '/admin/approval-queue', label: 'Approval Queue',  icon: CheckCircle, count: (stats.pendingEvents + stats.pendingJobs + stats.pendingCommunities), desc: 'Approve events, jobs, communities' },
        { href: '/admin/reports',     label: 'Reports',           icon: AlertCircle, count: stats.openReports, desc: 'Review abuse / quality reports' },
        { href: '/admin/users',       label: 'Users',             icon: Users,    count: stats.totalUsers,  desc: 'Moderation, roles, AI access' },
        { href: '/admin/audit-logs',  label: 'Audit Logs',        icon: FileText, count: '',              desc: 'Trace admin actions' },
    ];

    const COLORS = ['#22c55e', '#3b82f6', '#fbbf24', '#a855f7', '#f87171', '#06b6d4', '#ec4899', '#f59e0b'];

    return (
        <HackerLayout>
            <Head title="Admin Dashboard" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

                {/* Header */}
                <div className="flex items-center gap-4 border-b border-primary/30 pb-6">
                    <div className="p-3 border-2 border-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground leading-none">
                            ADMIN_CONTROL_CENTER
                        </h1>
                        <div className="text-xs font-mono text-primary/60 mt-1 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            SYSTEM_STATUS: OPERATIONAL // SECURITY_LEVEL: SUDO
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statCards.slice(0, 8).map((card, idx) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`border ${card.border} ${card.bg} p-4 relative overflow-hidden group`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className={`text-3xl font-black ${card.color} font-mono`}>
                                        {card.value?.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                                        {card.label}
                                    </div>
                                </div>
                                <card.icon className={`w-6 h-6 ${card.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                            </div>
                            <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary/50 to-transparent transition-all duration-500" />
                        </motion.div>
                    ))}
                </div>

                {/* Operations Shortcuts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {adminLinks.map((link, idx) => (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link
                                href={link.href}
                                className="block border border-primary/30 bg-card p-4 hover:border-primary hover:bg-primary/5 transition-all group relative overflow-hidden"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <link.icon className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                                        <div className="font-bold text-sm uppercase tracking-tight">{link.label}</div>
                                        <div className="text-xs text-muted-foreground font-mono line-clamp-2">{link.desc}</div>
                                    </div>
                                    {link.count !== '' && (
                                        <div className="text-xs font-black text-primary border border-primary/30 bg-primary/10 px-2 py-1">
                                            {String(link.count)}
                                        </div>
                                    )}
                                </div>
                                <ArrowRight className="absolute bottom-2 right-2 w-3 h-3 text-primary/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Recent audit logs (quick traceability) */}
                <div className="border border-primary/30 bg-card">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <h2 className="font-black uppercase text-sm flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" /> Recent Admin Actions
                        </h2>
                        <Link href="/admin/audit-logs" className="text-xs text-primary hover:underline font-mono">VIEW ALL →</Link>
                    </div>
                    <div className="divide-y divide-border/50">
                        {(recentAuditLogs || []).length === 0 ? (
                            <div className="px-6 py-6 text-xs text-muted-foreground font-mono">No audit events yet.</div>
                        ) : (
                            recentAuditLogs.map((log) => (
                                <div key={log.id} className="px-6 py-3 hover:bg-primary/5 transition-colors">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="text-xs font-black uppercase truncate">
                                                {log.action} {log.target_type ? `// ${log.target_type}#${log.target_id}` : ''}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground font-mono truncate">
                                                {log.description || '—'}
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-primary/50 font-mono whitespace-nowrap">
                                            {new Date(log.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Two-column sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Recent Users */}
                    <div className="border border-primary/30 bg-card">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h2 className="font-black uppercase text-sm flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" /> Recent Signups
                            </h2>
                            <Link href="/admin/users" className="text-xs text-primary hover:underline font-mono">VIEW ALL →</Link>
                        </div>
                        <div className="divide-y divide-border/50">
                            {recentUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between px-6 py-3 hover:bg-primary/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 border border-primary/40 bg-primary/10 flex items-center justify-center text-xs font-black text-primary uppercase">
                                            {user.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{user.name}</div>
                                            <div className="text-xs text-muted-foreground font-mono">@{user.username}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase ${user.role === 'admin' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}>
                                            {user.role}
                                        </span>
                                        <span className="text-xs font-mono text-primary">{user.xp} XP</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Users by XP */}
                    <div className="border border-primary/30 bg-card">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h2 className="font-black uppercase text-sm flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary" /> Top XP Leaders
                            </h2>
                            <Link href="/leaderboard" className="text-xs text-primary hover:underline font-mono">LEADERBOARD →</Link>
                        </div>
                        <div className="divide-y divide-border/50">
                            {topUsers.map((user, idx) => (
                                <div key={user.id} className="flex items-center justify-between px-6 py-3 hover:bg-primary/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-7 h-7 flex items-center justify-center text-xs font-black font-mono ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-muted-foreground'}`}>
                                            {idx === 0 ? '#1' : idx === 1 ? '#2' : idx === 2 ? '#3' : `#${idx + 1}`}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{user.name}</div>
                                            <div className="text-xs text-muted-foreground font-mono">@{user.username}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-primary font-black font-mono">
                                        {user.xp.toLocaleString()} <Zap className="w-3 h-3 fill-primary" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Events */}
                    <div className="border border-primary/30 bg-card">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h2 className="font-black uppercase text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" /> Recent Events
                            </h2>
                            <Link href="/admin/events" className="text-xs text-primary hover:underline font-mono">MODERATE →</Link>
                        </div>
                        <div className="divide-y divide-border/50">
                            {recentEvents.map(event => (
                                <div key={event.id} className="flex items-center justify-between px-6 py-3 hover:bg-primary/5 transition-colors">
                                    <div>
                                        <div className="font-bold text-sm truncate max-w-[200px]">{event.title}</div>
                                        <div className="text-xs text-muted-foreground font-mono">{event.city} // {event.category}</div>
                                    </div>
                                    <div>
                                        {event.is_approved ? (
                                            <span className="flex items-center gap-1 text-[10px] text-primary border border-primary/30 px-2 py-0.5 bg-primary/10">
                                                <CheckCircle className="w-3 h-3" /> LIVE
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] text-yellow-400 border border-yellow-400/30 px-2 py-0.5 bg-yellow-400/10">
                                                <AlertTriangle className="w-3 h-3" /> PENDING
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Jobs */}
                    <div className="border border-primary/30 bg-card">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h2 className="font-black uppercase text-sm flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-primary" /> Recent Jobs
                            </h2>
                            <Link href="/admin/jobs" className="text-xs text-primary hover:underline font-mono">MANAGE →</Link>
                        </div>
                        <div className="divide-y divide-border/50">
                            {recentJobs.map(job => (
                                <div key={job.id} className="flex items-center justify-between px-6 py-3 hover:bg-primary/5 transition-colors">
                                    <div>
                                        <div className="font-bold text-sm truncate max-w-[200px]">{job.title}</div>
                                        <div className="text-xs text-muted-foreground font-mono">@{job.company} // {job.city}</div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase ${job.is_active ? 'border-primary text-primary bg-primary/10' : 'border-red-400/30 text-red-400 bg-red-400/10'}`}>
                                        {job.is_active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </HackerLayout>
    );
}
