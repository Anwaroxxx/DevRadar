import { Head, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react';

export default function AdminAnalytics({ summary, metrics, user_growth }) {
    const dates = Object.keys(user_growth || {}).slice(-30);
    const growthValues = dates.map(date => user_growth[date] || 0);
    const maxGrowth = Math.max(...growthValues, 10);

    return (
        <HackerLayout>
            <Head title="Admin — Analytics" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-primary/30 pb-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-mono text-xs">← ADMIN</Link>
                        <span className="text-border">/</span>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-primary" /> ANALYTICS
                        </h1>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Users', value: summary.total_users, icon: Users },
                        { label: 'New This Month', value: summary.new_users_this_month, icon: TrendingUp },
                        { label: 'Active Today', value: summary.active_users_today, icon: Zap },
                        { label: 'Total Events', value: summary.total_events, icon: BarChart3 },
                        { label: 'Total Jobs', value: summary.total_jobs, icon: BarChart3 },
                        { label: 'Avg User XP', value: summary.avg_user_xp, icon: Zap },
                    ].map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="border border-primary/30 bg-primary/5 p-4 space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</div>
                                    <Icon className="w-4 h-4 text-primary" />
                                </div>
                                <div className="text-3xl font-black text-primary">{stat.value.toLocaleString()}</div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* User Growth Chart (Last 30 Days) */}
                <div className="border border-primary/30 bg-primary/5 p-6 space-y-4">
                    <h2 className="font-bold text-lg">User Growth (Last 30 Days)</h2>
                    <div className="flex items-end gap-1 h-32">
                        {dates.map((date, idx) => {
                            const height = growthValues[idx] > 0 ? (growthValues[idx] / maxGrowth) * 100 : 2;
                            return (
                                <div
                                    key={idx}
                                    className="flex-1 bg-primary/50 hover:bg-primary transition-all rounded-t"
                                    style={{ height: `${height}%`, minHeight: '2px' }}
                                    title={`${date}: ${growthValues[idx]} users`}
                                />
                            );
                        })}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{dates[0]}</span>
                        <span>→ {dates[dates.length - 1]}</span>
                    </div>
                </div>

                {/* Metrics Summary */}
                <div className="border border-primary/30 bg-primary/5 p-6 space-y-4">
                    <h2 className="font-bold text-lg">Platform Metrics</h2>
                    <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                            <span className="font-bold text-primary">Daily Active Users:</span> Track user engagement across the platform
                        </p>
                        <p className="text-muted-foreground">
                            <span className="font-bold text-primary">New Signups:</span> Monitor user acquisition trends
                        </p>
                        <p className="text-muted-foreground">
                            <span className="font-bold text-primary">Events Created:</span> Measure community event activity
                        </p>
                        <p className="text-muted-foreground">
                            <span className="font-bold text-primary">Jobs Posted:</span> Track marketplace opportunities
                        </p>
                    </div>
                </div>

                {/* Data Info */}
                <div className="border border-yellow-500/30 bg-yellow-500/5 p-4 text-xs text-muted-foreground">
                    <span className="font-bold text-yellow-500">Note:</span> Metrics are aggregated daily. Real-time analytics require a dedicated analytics provider integration.
                </div>
            </div>
        </HackerLayout>
    );
}
