import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { 
    AlertCircle, Search, Filter, Shield, 
    Terminal, Clock, Database, ChevronRight, Activity,
    Lock, User
} from 'lucide-react';

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

    const getActionTheme = (action) => {
        if (action.includes('ban') || action.includes('delete') || action.includes('reject')) 
            return 'text-red-500 border-red-500/30 bg-red-500/10';
        if (action.includes('approve') || action.includes('verify') || action.includes('reactivate')) 
            return 'text-primary border-primary/30 bg-primary/10';
        return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    };

    return (
        <HackerLayout>
            <Head title="Audit Logs" />
            
            <div className="max-w-[1600px] mx-auto px-4 py-8 space-y-6 font-mono">
                
                {/* HEADER */}
                <div className="flex items-center justify-between bg-black/40 border border-primary/20 p-6 relative overflow-hidden">
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 border border-primary bg-primary/10">
                            <Activity className="w-6 h-6 text-primary animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-widest text-foreground">
                                FORENSIC_ENGINE // <span className="text-primary italic">AUDIT_TRAIL</span>
                            </h1>
                            <div className="text-[10px] text-primary/60 flex items-center gap-4 mt-1">
                                <span className="flex items-center gap-1.5 font-black uppercase"><Terminal className="w-3 h-3" /> Logs: Online</span>
                                <span className="flex items-center gap-1.5 opacity-40 uppercase"><Lock className="w-3 h-3" /> Status: Verified</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-right text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                        Session_Monitoring: HIGH_VISIBILITY<br/>
                        Trace_Depth: UNLIMITED_RETENTION
                    </div>
                </div>

                {/* FILTER HUB */}
                <form onSubmit={handleFilter} className="bg-black/40 border border-primary/10 p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative col-span-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Filter by action or details..."
                                className="w-full bg-black border border-primary/20 pl-10 pr-4 py-3 text-[10px] text-primary focus:border-primary outline-none transition-all"
                            />
                        </div>

                        <select
                            value={selectedAdmin}
                            onChange={e => setSelectedAdmin(e.target.value)}
                            className="bg-black border border-primary/20 px-4 py-3 text-[10px] text-primary focus:border-primary outline-none uppercase"
                        >
                            <option value="">All Administrators</option>
                            {admins.map(admin => <option key={admin.id} value={admin.id}>{admin.name.toUpperCase()}</option>)}
                        </select>

                        <select
                            value={selectedType}
                            onChange={e => setSelectedType(e.target.value)}
                            className="bg-black border border-primary/20 px-4 py-3 text-[10px] text-primary focus:border-primary outline-none uppercase"
                        >
                            <option value="">All Types</option>
                            {['user', 'event', 'job', 'community', 'marketplace', 'feature_flag'].map(t => (
                                <option key={t} value={t}>{t.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-primary/20 text-primary border border-primary px-8 py-2 text-[10px] font-black uppercase hover:bg-primary hover:text-black transition-all"
                        >
                            Refresh Logs
                        </button>
                    </div>
                </form>

                {/* LOG DATA GRID */}
                <div className="bg-black/40 border border-primary/10 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-primary/5 text-[9px] uppercase tracking-[0.2em] text-primary/60 font-black">
                                <th className="px-6 py-4 border-b border-primary/10 w-48">Timestamp</th>
                                <th className="px-6 py-4 border-b border-primary/10 w-48">Operator</th>
                                <th className="px-6 py-4 border-b border-primary/10 w-64">Action</th>
                                <th className="px-6 py-4 border-b border-primary/10 w-48">Target_Ref</th>
                                <th className="px-6 py-4 border-b border-primary/10">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {logs.data.map((log, idx) => (
                                <motion.tr
                                    key={log.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.01 }}
                                    className="hover:bg-primary/[0.03] transition-colors group"
                                >
                                    <td className="px-6 py-4 text-[9px] text-muted-foreground whitespace-nowrap italic font-mono tabular-nums uppercase">
                                        [{new Date(log.created_at).toLocaleString().replace(',', '')}]
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 border border-primary/20 bg-primary/5 flex items-center justify-center text-[8px] font-black font-mono">
                                                {log.admin.name[0]}
                                            </div>
                                            <div className="text-[10px] font-black uppercase">{log.admin.username}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[8px] px-2 py-0.5 border font-black uppercase tracking-tighter ${getActionTheme(log.action)}`}>
                                            {log.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.target_type ? (
                                            <div className="text-[9px] uppercase font-mono">
                                                <span className="text-muted-foreground">{log.target_type}</span>
                                                <span className="text-primary font-black ml-1">#{log.target_id}</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground opacity-30">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs xl:max-w-lg truncate text-[9px] text-muted-foreground/60 font-mono italic bg-black/20 p-2 border-l border-primary/10 group-hover:text-primary/60 transition-colors">
                                            {log.description || (log.changes ? JSON.stringify(log.changes) : 'SYSTEM_GENERATED_EVENT')}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {logs.data.length === 0 && (
                        <div className="p-20 text-center space-y-4 opacity-20">
                            <Database className="w-12 h-12 mx-auto" />
                            <p className="text-[10px] uppercase font-black tracking-[0.5em]">No log entries found.</p>
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                <div className="flex items-center justify-between p-6 bg-black/40 border border-primary/10">
                    <div className="text-[10px] font-black text-primary/40 uppercase tracking-widest">
                        Page {logs.current_page} // {logs.last_page}
                    </div>
                    <div className="flex gap-1">
                        {logs.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-1.5 border text-[9px] font-black transition-all ${
                                    link.active 
                                    ? 'bg-primary text-black border-primary' 
                                    : 'border-primary/10 text-primary hover:border-primary/40'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* FOOTER ADVISORY */}
                <div className="bg-primary/5 border border-primary/20 p-4 flex items-center gap-4 text-[9px] text-primary italic uppercase tracking-widest">
                    <Shield className="w-4 h-4 shrink-0" />
                    <span>Integrity Advisory: All administrative actions are timestamped and immutable. Temporal anomalies in logs should be reported to the Security Core immediately. Session identity verified by E2E encryption.</span>
                </div>
            </div>

            <style jsx>{`
                .tabular-nums { font-variant-numeric: tabular-nums; }
            `}</style>
        </HackerLayout>
    );
}
