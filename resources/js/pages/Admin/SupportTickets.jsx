import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { 
    LifeBuoy, MessageSquare, CheckCircle, Clock, Filter,
    MailOpen, Tag, User, CalendarDays, ChevronDown, Send,
    ShieldCheck, X
} from 'lucide-react';

const statusColors = {
    open:     'border-amber-500 text-amber-400 bg-amber-500/10',
    resolved: 'border-primary text-primary bg-primary/10',
};

const typeColors = {
    Bug_Report:      'text-red-400',
    Account_Inquiry: 'text-blue-400',
    XP_System_Help:  'text-purple-400',
    Partnership:     'text-cyan-400',
};

export default function SupportTickets({ tickets, filters, counts }) {
    const [viewing, setViewing] = useState(null);
    const [notes, setNotes]     = useState('');

    const handleResolve = (ticketId) => {
        router.post(`/admin/support-tickets/${ticketId}/resolve`, { admin_notes: notes }, {
            onSuccess: () => { setViewing(null); setNotes(''); }
        });
    };

    return (
        <HackerLayout>
            <Head title="Admin — Support Tickets" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-primary/20 pb-6">
                    <div className="flex items-center gap-3">
                        <LifeBuoy className="w-7 h-7 text-primary animate-pulse" />
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter">Support Tickets</h1>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                                Inbound user requests
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 border border-amber-500/30 bg-amber-500/5 text-center">
                            <div className="text-xl font-black text-amber-400">{counts.open}</div>
                            <div className="text-[9px] uppercase text-muted-foreground tracking-widest">Open</div>
                        </div>
                        <div className="px-4 py-2 border border-primary/30 bg-primary/5 text-center">
                            <div className="text-xl font-black text-primary">{counts.resolved}</div>
                            <div className="text-[9px] uppercase text-muted-foreground tracking-widest">Resolved</div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 flex-wrap">
                    {['', 'open', 'resolved'].map(s => (
                        <button
                            key={s}
                            onClick={() => router.get('/admin/support-tickets', { ...filters, status: s || undefined }, { preserveState: true })}
                            className={`px-4 py-1.5 text-[10px] uppercase font-black tracking-widest border transition-all ${
                                (filters.status || '') === s
                                    ? 'border-primary bg-primary text-black'
                                    : 'border-white/10 hover:border-primary/40 text-muted-foreground'
                            }`}
                        >
                            {s || 'All'}
                        </button>
                    ))}
                </div>

                {/* Ticket List */}
                <div className="space-y-3">
                    {tickets.data.length === 0 && (
                        <div className="py-20 text-center text-muted-foreground font-mono text-sm uppercase border border-dashed border-white/5">
                            No tickets in queue.
                        </div>
                    )}
                    {tickets.data.map(ticket => (
                        <div
                            key={ticket.id}
                            className="bg-card border border-white/5 hover:border-primary/30 transition-all p-5 cursor-pointer group"
                            onClick={() => { setViewing(ticket); setNotes(ticket.admin_notes || ''); }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className={`text-[9px] px-2 py-0.5 border font-black uppercase tracking-widest ${statusColors[ticket.status] || 'border-white/10 text-muted-foreground'}`}>
                                            {ticket.status}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase ${typeColors[ticket.type] || 'text-muted-foreground'}`}>
                                            {ticket.type?.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <p className="text-sm font-mono text-foreground/80 leading-snug line-clamp-2">
                                        {ticket.message}
                                    </p>
                                    <div className="flex items-center gap-4 text-[9px] text-muted-foreground uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><MailOpen className="w-3 h-3" />{ticket.email}</span>
                                        <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{new Date(ticket.created_at).toLocaleDateString()}</span>
                                        {ticket.user && <span className="flex items-center gap-1"><User className="w-3 h-3" />@{ticket.user.username}</span>}
                                    </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 -rotate-90" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {tickets.last_page > 1 && (
                    <div className="flex justify-center gap-2 pt-4">
                        {Array.from({ length: tickets.last_page }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => router.get('/admin/support-tickets', { ...filters, page: p })}
                                className={`w-8 h-8 text-xs font-bold border transition-all ${tickets.current_page === p ? 'bg-primary text-black border-primary' : 'border-white/10 hover:border-primary/40'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Panel */}
            {viewing && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur z-[100] flex items-center justify-center p-4" onClick={() => setViewing(null)}>
                    <div className="bg-[#0c0c0c] border border-primary/30 w-full max-w-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <LifeBuoy className="w-5 h-5 text-primary" />
                                <span className="font-black uppercase text-sm tracking-wide">Ticket #{viewing.id}</span>
                                <span className={`text-[9px] px-2 py-0.5 border font-black uppercase tracking-widest ${statusColors[viewing.status]}`}>
                                    {viewing.status}
                                </span>
                            </div>
                            <button onClick={() => setViewing(null)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 space-y-5">
                            <div className="grid grid-cols-2 gap-4 text-[10px] font-mono uppercase text-muted-foreground">
                                <div><span className="text-primary/60 block mb-0.5">Email</span>{viewing.email}</div>
                                <div><span className="text-primary/60 block mb-0.5">Type</span>{viewing.type?.replace(/_/g, ' ')}</div>
                                <div><span className="text-primary/60 block mb-0.5">Submitted</span>{new Date(viewing.created_at).toLocaleString()}</div>
                                {viewing.user && <div><span className="text-primary/60 block mb-0.5">Account</span>@{viewing.user.username}</div>}
                            </div>

                            <div className="bg-black/40 border border-white/5 p-4">
                                <div className="text-[9px] uppercase text-primary/60 font-bold tracking-widest mb-2">Message</div>
                                <p className="text-sm font-mono text-foreground/80 leading-relaxed whitespace-pre-wrap">{viewing.message}</p>
                            </div>

                            {viewing.status === 'open' ? (
                                <div className="space-y-3">
                                    <label className="block text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Admin Notes (optional)</label>
                                    <textarea
                                        rows={3}
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                        placeholder="Internal resolution notes..."
                                        className="w-full bg-black/60 border border-white/10 px-4 py-2 text-xs font-mono focus:border-primary outline-none resize-none transition-colors"
                                    />
                                    <button
                                        onClick={() => handleResolve(viewing.id)}
                                        className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-primary/90 transition-all"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Mark as Resolved
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-primary/5 border border-primary/20 p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                                        <ShieldCheck className="w-4 h-4" /> Resolved by {viewing.resolver?.username || 'admin'}
                                    </div>
                                    {viewing.admin_notes && (
                                        <p className="text-xs font-mono text-muted-foreground">{viewing.admin_notes}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </HackerLayout>
    );
}
