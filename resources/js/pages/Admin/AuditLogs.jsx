import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { AlertCircle, Search, Filter } from 'lucide-react';

export default function AdminAuditLogs({ logs, admins, filters }) {
    const [search, setSearch] = useState(filters.action || '');
    const [selectedAdmin, setSelectedAdmin] = useState(filters.admin_id || '');
    const [selectedType, setSelectedType] = useState(filters.target_type || '');

    const handleFilter = (e) => {
        e.preventDefault();
        const params = {};
        if (search) params.action = search;
        if (selectedAdmin) params.admin_id = selectedAdmin;
        if (selectedType) params.target_type = selectedType;
        router.get('/admin/audit-logs', params, { preserveState: true });
    };

    const getActionBadgeColor = (action) => {
        if (action.includes('ban') || action.includes('delete')) return 'text-red-500 border-red-500/30 bg-red-500/10';
        if (action.includes('suspend') || action.includes('reject')) return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
        if (action.includes('approve') || action.includes('verify')) return 'text-green-500 border-green-500/30 bg-green-500/10';
        return 'text-primary border-primary/30 bg-primary/10';
    };

    const formatValue = (value) => {
        if (typeof value === 'object') return JSON.stringify(value).substring(0, 50) + '...';
        return String(value).substring(0, 50);
    };

    return (
        <HackerLayout>
            <Head title="Admin — Audit Logs" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-primary/30 pb-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-mono text-xs">← ADMIN</Link>
                        <span className="text-border">/</span>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-primary" /> AUDIT_LOGS
                        </h1>
                    </div>
                </div>

                {/* Filters */}
                <form onSubmit={handleFilter} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search action..."
                                className="w-full bg-card border border-primary/30 pl-9 pr-4 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-all"
                            />
                        </div>

                        <select
                            value={selectedAdmin}
                            onChange={e => setSelectedAdmin(e.target.value)}
                            className="bg-card border border-primary/30 px-4 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-all"
                        >
                            <option value="">All Admins</option>
                            {admins.map(admin => <option key={admin.id} value={admin.id}>{admin.name}</option>)}
                        </select>

                        <select
                            value={selectedType}
                            onChange={e => setSelectedType(e.target.value)}
                            className="bg-card border border-primary/30 px-4 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-all"
                        >
                            <option value="">All Types</option>
                            <option value="user">User</option>
                            <option value="event">Event</option>
                            <option value="job">Job</option>
                            <option value="marketplace">Marketplace</option>
                            <option value="feature_flag">Feature Flag</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary/20 text-primary border border-primary px-4 py-2 text-xs font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2"
                    >
                        <Filter className="w-4 h-4" /> APPLY_FILTERS
                    </button>
                </form>

                {/* Logs Table */}
                <div className="border border-primary/30 overflow-hidden">
                    <table className="w-full text-sm font-mono">
                        <thead>
                            <tr className="border-b border-primary/30 bg-primary/5">
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Timestamp</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Admin</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Action</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Target</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Changes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {logs.data.map(log => (
                                <motion.tr
                                    key={log.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-primary/5 transition-colors"
                                >
                                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="font-bold">{log.admin.name}</div>
                                        <div className="text-xs text-muted-foreground">@{log.admin.username}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] px-2 py-1 border font-bold uppercase ${getActionBadgeColor(log.action)}`}>
                                            {log.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs">
                                        {log.target_type && (
                                            <div>
                                                <div className="text-muted-foreground">{log.target_type}</div>
                                                {log.target_id && <div className="text-primary font-bold">#{log.target_id}</div>}
                                            </div>
                                        )}
                                        {!log.target_type && <span className="text-muted-foreground">—</span>}
                                    </td>
                                    <td className="px-4 py-3 text-xs max-w-xs">
                                        {log.changes ? (
                                            <div className="text-muted-foreground font-mono truncate">
                                                {JSON.stringify(log.changes).substring(0, 40)}...
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {logs.data.length === 0 && (
                    <div className="border border-border/50 p-6 text-center text-muted-foreground text-sm">
                        No audit logs found. Admin actions are logged here.
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-muted-foreground">
                        Page {logs.current_page} of {logs.last_page}
                    </div>
                    <div className="flex gap-2">
                        {logs.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                disabled={!link.url}
                                className={`px-3 py-1 border text-xs font-bold transition-all ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'border-border text-muted-foreground hover:border-primary/50'
                                }`}
                            >
                                {link.label.replace('&laquo;', '←').replace('&raquo;', '→')}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="border border-yellow-500/30 bg-yellow-500/5 p-4 text-xs text-muted-foreground">
                    <span className="font-bold text-yellow-500">ℹ️ Note:</span> All admin actions are logged here including IP address, user agent, and changes made. This is crucial for security and compliance auditing.
                </div>
            </div>
        </HackerLayout>
    );
}
