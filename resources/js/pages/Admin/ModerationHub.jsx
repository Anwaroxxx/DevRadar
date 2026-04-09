import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, AlertCircle, CheckCircle, XCircle, Filter, 
    Calendar, Briefcase, Network, Terminal, Search, 
    MoreVertical, ArrowRight, User, Eye, Trash2, Clock
} from 'lucide-react';

export default function ModerationHub({ queue, counts, filters }) {
    const { auth } = usePage().props;
    const [selectedType, setSelectedType] = useState(filters.type || 'reports');
    const [viewingItem, setViewingItem] = useState(null);
    const [actionForm, setActionForm] = useState({ action: 'dismissed', notes: '', reason: '' });

    const handleAction = (type, id, action) => {
        const payload = action === 'approve' ? {} : { reason: actionForm.reason || actionForm.notes };
        const route = `/admin/moderation/${type}/${id}/${action}`;
        
        router.post(route, payload, {
            onSuccess: () => {
                setViewingItem(null);
                setActionForm({ action: 'dismissed', notes: '', reason: '' });
            }
        });
    };

    const handleResolveReport = (reportId) => {
        router.post(`/admin/moderation/reports/${reportId}/resolve`, {
            action: actionForm.action,
            notes: actionForm.notes
        }, {
            onSuccess: () => {
                setViewingItem(null);
                setActionForm({ action: 'dismissed', notes: '', reason: '' });
            }
        });
    };

    const typeIcons = {
        reports: AlertCircle,
        events: Calendar,
        jobs: Briefcase,
        communities: Network
    };

    const Icon = typeIcons[selectedType];

    return (
        <HackerLayout>
            <Head title="Moderation Hub" />
            
            <div className="max-w-[1600px] mx-auto px-4 py-6 h-auto lg:h-[calc(100vh-120px)] flex flex-col font-mono overflow-hidden">
                
                {/* HUB HEADER */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-black/40 border border-primary/20 p-6 mb-6 shrink-0 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 border border-primary bg-primary/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white leading-tight">
                                Content Moderation <span className="hidden md:inline">//</span> <span className="text-primary italic block md:inline">Review Queue</span>
                            </h1>
                            <div className="text-[10px] text-primary/60 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3" /> System: Online</span>
                                <span className="flex items-center gap-1.5"><Filter className="w-3 h-3" /> Category: {selectedType.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 gap-6 overflow-hidden min-h-0">
                    
                    {/* SIDEBAR: SIGNAL TABS - Horizontal on mobile, Vertical on desktop */}
                    <div className="w-full lg:w-64 space-y-2 flex flex-row lg:flex-col shrink-0 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 custom-scrollbar">
                        <div className="flex flex-row lg:flex-col gap-2 flex-nowrap">
                            {[
                                { id: 'reports', label: 'Reports', count: counts.reports, color: 'text-red-500' },
                                { id: 'events', label: 'Events', count: counts.events, color: 'text-primary' },
                                { id: 'jobs', label: 'Jobs', count: counts.jobs, color: 'text-yellow-500' },
                                { id: 'communities', label: 'Communities', count: counts.communities, color: 'text-purple-500' },
                            ].map(tab => (
                                <Link
                                    key={tab.id}
                                    href={`/admin/moderation?type=${tab.id}`}
                                    className={`flex items-center justify-between p-3 lg:p-4 border transition-all group min-w-[120px] lg:min-w-0 ${
                                        selectedType === tab.id 
                                        ? 'bg-primary/10 border-primary text-primary' 
                                        : 'bg-black/20 border-primary/10 text-muted-foreground hover:border-primary/40 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 lg:gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedType === tab.id ? 'bg-primary animate-pulse' : 'bg-primary/20'}`}></div>
                                        <span className="text-[10px] font-black uppercase tracking-tight">{tab.label}</span>
                                    </div>
                                    {tab.count > 0 && (
                                        <span className={`text-[9px] lg:text-[10px] font-black px-1.5 border ml-2 ${selectedType === tab.id ? 'bg-primary text-black border-primary' : 'bg-primary/5 border-primary/20 text-primary'}`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                        
                        <div className="hidden lg:block p-4 bg-red-500/5 border border-red-500/10 text-[9px] text-red-400 leading-relaxed uppercase font-bold">
                            Warning: Actions taken in this hub are permanent and logged to the audit system. Verify details before taking action.
                        </div>
                    </div>

                    {/* MAIN QUEUE: DATA STREAMS */}
                    <div className="flex-1 bg-black/40 border border-primary/20 flex flex-col overflow-hidden relative">
                        {/* Decorative background grid */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:24px_24px]"></div>

                        <div className="p-4 border-b border-primary/20 flex items-center justify-between bg-black/20 relative z-10">
                            <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4 text-primary" />
                                <span className="text-xs font-black uppercase tracking-widest leading-none">Review Queue: {selectedType.toUpperCase()}</span>
                            </div>
                            <div className="text-[10px] text-muted-foreground tabular-nums">SYNCED: {new Date().toLocaleTimeString()}</div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar relative z-10">
                            {queue.data.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30">
                                    <CheckCircle className="w-12 h-12 text-primary" />
                                    <p className="text-[10px] uppercase tracking-[0.3em]">No items requiring review.</p>
                                </div>
                            ) : (
                                queue.data.map(item => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`group border ${viewingItem?.id === item.id ? 'border-primary bg-primary/10' : 'border-primary/10 bg-black/20'} p-5 transition-all relative cursor-pointer`}
                                        onClick={() => setViewingItem(item)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-[10px] font-black text-primary px-2 border border-primary/20 bg-primary/5">#{item.id}</span>
                                                    <h3 className="text-sm font-black uppercase text-white leading-tight">
                                                        {selectedType === 'reports' ? `REPORT: ${item.reason.toUpperCase()}` : (item.title || item.name)}
                                                    </h3>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 text-[9px] text-muted-foreground uppercase tracking-widest mb-3">
                                                    <span className="flex items-center gap-1"><User className="w-2.5 h-2.5" /> {item.user?.username || item.reporter?.username || 'ANONYMOUS'}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {new Date(item.created_at).toLocaleDateString()}</span>
                                                </div>

                                                <p className="text-[10px] text-muted-foreground/60 leading-relaxed truncate max-w-lg">
                                                    {item.description || item.content || 'No detailed information provided.'}
                                                </p>
                                            </div>

                                            <button className="text-primary/40 group-hover:text-primary transition-colors p-1">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Pagination Footer */}
                        {queue.links && queue.data.length > 0 && (
                            <div className="p-4 border-t border-primary/20 bg-black/40 flex justify-between items-center text-[10px] shrink-0">
                                <div className="text-muted-foreground">Showing {queue.from}-{queue.to} of {queue.total} Items</div>
                                <div className="flex gap-2">
                                    {queue.prev_page_url && (
                                        <Link href={queue.prev_page_url} className="px-3 py-1 border border-primary/20 hover:bg-primary/10 hover:border-primary text-primary transition-all">PREV</Link>
                                    )}
                                    {queue.next_page_url && (
                                        <Link href={queue.next_page_url} className="px-3 py-1 border border-primary/20 hover:bg-primary/10 hover:border-primary text-primary transition-all">NEXT</Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <AnimatePresence>
                        {viewingItem && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, width: 0 }}
                                animate={{ opacity: 1, x: 0, width: window.innerWidth > 1024 ? 450 : '100%' }}
                                exit={{ opacity: 0, x: 20, width: 0 }}
                                className="absolute inset-0 lg:relative lg:inset-auto z-50 bg-black/95 lg:bg-black/60 border border-primary/30 flex flex-col overflow-hidden shrink-0 h-full"
                            >
                                <div className="p-4 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-black uppercase tracking-widest text-primary">Item Inspector</span>
                                    </div>
                                    <button onClick={() => setViewingItem(null)} className="text-primary/60 hover:text-primary transition-colors p-1">
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                    <div className="space-y-4">
                                        <div className="text-[9px] font-bold text-primary/40 uppercase tracking-widest pb-1 border-b border-primary/10">Details</div>
                                        <div className="grid grid-cols-2 gap-4 text-[10px]">
                                            <div>
                                                <div className="text-muted-foreground uppercase text-[8px] mb-1">ID</div>
                                                <div className="font-mono text-white font-black">#{viewingItem.id}</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground uppercase text-[8px] mb-1">Status</div>
                                                <div className="font-mono text-yellow-400 font-black">PENDING</div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-muted-foreground uppercase text-[8px] mb-1">Source User</div>
                                                <div className="font-mono text-primary font-black">@{viewingItem.user?.username || viewingItem.reporter?.username || 'SYSTEM'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 font-mono text-[10px] text-white p-3 bg-black/40 border border-primary/5">
                                        <div className="text-[9px] font-bold text-primary/40 uppercase tracking-widest pb-1 border-b border-primary/10 mb-2">Content Overview</div>
                                        <p className="leading-relaxed whitespace-pre-wrap">
                                            "{viewingItem.description || viewingItem.content || 'No content available.'}"
                                        </p>
                                    </div>

                                    {/* MITIGATION ACTIONS */}
                                    <div className="space-y-4 pt-4 border-t border-primary/10">
                                        <div className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">Moderation Actions</div>
                                        
                                        {selectedType === 'reports' ? (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] uppercase font-bold text-muted-foreground">Select Action</label>
                                                    <select 
                                                        value={actionForm.action}
                                                        onChange={e => setActionForm({...actionForm, action: e.target.value})}
                                                        className="w-full bg-black border border-primary/20 p-2 text-[10px] text-primary focus:border-primary outline-none"
                                                    >
                                                        <option value="dismissed">DISMISS (No Violation)</option>
                                                        <option value="warning">WARN (User Alert)</option>
                                                        <option value="suspend">SUSPEND (Temporary)</option>
                                                        <option value="ban">BAN (Permanent Purge)</option>
                                                        <option value="delete">DELETE (Data Wipe)</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] uppercase font-bold text-muted-foreground">Moderation Notes</label>
                                                    <textarea 
                                                        value={actionForm.notes}
                                                        onChange={e => setActionForm({...actionForm, notes: e.target.value})}
                                                        className="w-full h-24 bg-black border border-primary/20 p-2 text-[10px] text-white focus:border-primary outline-none resize-none"
                                                        placeholder="Describe action rationale..."
                                                    />
                                                </div>
                                                <button 
                                                    onClick={() => handleResolveReport(viewingItem.id)}
                                                    className="w-full bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white border border-red-500 p-3 font-black uppercase text-xs transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                                >
                                                    Submit Action
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleAction(selectedType.slice(0, -1), viewingItem.id, 'approve')}
                                                        className="flex-1 bg-primary/20 hover:bg-primary text-primary hover:text-black border border-primary p-3 font-black uppercase text-xs transition-all"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => setActionForm({...actionForm, action: 'reject'})}
                                                        className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white border border-red-500 p-3 font-black uppercase text-xs transition-all"
                                                    >
                                                        REJECT
                                                    </button>
                                                </div>

                                                {actionForm.action === 'reject' && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="space-y-3 pt-4 border-t border-red-500/20"
                                                    >
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] uppercase font-bold text-red-400">Rejection Reason</label>
                                                            <textarea 
                                                                value={actionForm.reason}
                                                                onChange={e => setActionForm({...actionForm, reason: e.target.value})}
                                                                className="w-full h-24 bg-black border border-red-500/20 p-2 text-[10px] text-red-400 focus:border-red-500 outline-none resize-none"
                                                                placeholder="Why are you rejecting this?"
                                                            />
                                                        </div>
                                                        <button 
                                                            onClick={() => handleAction(selectedType.slice(0, -1), viewingItem.id, 'reject')}
                                                            className="w-full bg-red-500 text-white p-3 font-black uppercase text-xs"
                                                        >
                                                            Reject Item
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(34, 197, 94, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(34, 197, 94, 0.5);
                }
            `}</style>
        </HackerLayout>
    );
}
