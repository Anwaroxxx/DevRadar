import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Calendar, Search, CheckCircle, XCircle, Trash2, AlertTriangle, MapPin, User } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminEvents({ events, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
    const deleteForm = useForm({});

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/events', { search, status: filters.status, category: filters.category }, { preserveState: true });
    };

    const handleApprove = (eventId) => {
        router.post(`/admin/events/${eventId}/approve`);
    };

    const handleReject = (eventId) => {
        router.post(`/admin/events/${eventId}/reject`);
    };

    const handleDelete = (eventId) => {
        setConfirmDelete({ open: true, id: eventId });
    };

    const performDelete = () => {
        if (!confirmDelete.id) return;
        deleteForm.delete(`/admin/content/event/${confirmDelete.id}`, {
            onSuccess: () => setConfirmDelete({ open: false, id: null })
        });
    };

    const categoryColors = {
        event: 'text-primary border-primary/30 bg-primary/10',
        hackathon: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
        workshop: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
        meetup: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    };

    return (
        <HackerLayout>
            <Head title="Admin — Events" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                <div className="flex items-center justify-between border-b border-primary/30 pb-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-mono text-xs">← ADMIN</Link>
                        <span className="text-border">/</span>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-primary" /> Event Moderation
                        </h1>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">{events.total} total events</div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search events..."
                                className="w-full bg-card border border-primary/30 pl-9 pr-4 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-all" />
                        </div>
                        <button type="submit" className="bg-primary/20 text-primary border border-primary px-4 py-2 text-xs font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all">SEARCH</button>
                    </form>
                    <div className="flex gap-2 flex-wrap">
                        {[['', 'ALL'], ['pending', 'PENDING'], ['approved', 'APPROVED']].map(([val, label]) => (
                            <Link key={val} href={`/admin/events?${val ? `status=${val}` : ''}`}
                                className={`px-3 py-2 text-xs font-mono border uppercase ${filters.status === val || (!filters.status && !val) ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Events Table */}
                <div className="border border-primary/30 overflow-hidden">
                    <table className="w-full text-sm font-mono">
                        <thead>
                            <tr className="border-b border-primary/30 bg-primary/5">
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Event</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Location</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Date</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Creator</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Status</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {events.data.map(event => (
                                <motion.tr key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-primary/5 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-sm">{event.title}</div>
                                        <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase ${categoryColors[event.category] || 'text-muted-foreground border-border'}`}>
                                            {event.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="w-3 h-3" /> {event.city}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">
                                        {new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={`/profile/${event.user?.username}`} className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                                            <User className="w-3 h-3" /> @{event.user?.username}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3">
                                        {event.is_approved ? (
                                            <span className="flex items-center gap-1 text-[10px] text-primary border border-primary/30 px-2 py-0.5 bg-primary/10 w-fit">
                                                <CheckCircle className="w-3 h-3" /> LIVE
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] text-yellow-400 border border-yellow-400/30 px-2 py-0.5 bg-yellow-400/10 w-fit">
                                                <AlertTriangle className="w-3 h-3" /> PENDING
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {!event.is_approved && (
                                                <button onClick={() => handleApprove(event.id)} className="text-primary hover:bg-primary/20 p-1 transition-colors" title="Approve">
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            {event.is_approved && (
                                                <button onClick={() => handleReject(event.id)} className="text-yellow-400 hover:bg-yellow-400/10 p-1 transition-colors" title="Reject">
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            <Link href={`/events/${event.id}`} className="text-muted-foreground hover:text-primary p-1 transition-colors" title="View">
                                                <Calendar className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(event.id)} className="text-muted-foreground hover:text-red-400 p-1 transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {events.links && events.links.length > 3 && (
                    <div className="flex justify-center gap-2 font-mono">
                        {events.links.map((link, k) => (
                            <Link key={k} href={link.url || '#'}
                                className={`px-3 py-1 text-xs border ${link.active ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal 
                isOpen={confirmDelete.open}
                onClose={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={performDelete}
                title="Decommission Event"
                description="This action will permanently purge this event from the network grid. All associated data will be lost."
                confirmText="Delete Event"
                variant="destructive"
            />
        </HackerLayout>
    );
}
