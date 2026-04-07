import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react';

export default function ApprovalQueue({ queue, pendingCounts = {} }) {
    const [selectedType, setSelectedType] = useState('events');
    const [rejectingItem, setRejectingItem] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const currentItems = queue[selectedType]?.data || [];

    const handleApprove = (type, id) => {
        router.post(`/admin/approve/${type}/${id}`, {}, {
            onSuccess: () => alert(`${type} approved!`)
        });
    };

    const handleReject = (type, id) => {
        if (!rejectReason) {
            alert('Please provide a rejection reason');
            return;
        }
        router.post(`/admin/reject/${type}/${id}`, { reason: rejectReason }, {
            onSuccess: () => {
                setRejectingItem(null);
                setRejectReason('');
            }
        });
    };

    return (
        <HackerLayout>
            <Head title="Admin — Approval Queue" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-primary/30 pb-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-mono text-xs">← ADMIN</Link>
                        <span className="text-border">/</span>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <MessageCircle className="w-6 h-6 text-primary" /> APPROVAL_QUEUE
                        </h1>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    {['events', 'jobs', 'communities'].map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-4 py-2 text-xs font-bold border uppercase transition-all ${
                                selectedType === type
                                    ? 'border-primary text-primary bg-primary/10'
                                    : 'border-border text-muted-foreground hover:border-primary/50'
                            }`}
                        >
                            {type.toUpperCase()} ({pendingCounts[type] || 0})
                        </button>
                    ))}
                </div>

                {/* Queue Items */}
                <div className="space-y-4">
                    {currentItems.length === 0 ? (
                        <div className="border border-border/50 p-12 text-center text-muted-foreground">
                            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="font-mono">All {selectedType} have been approved!</p>
                        </div>
                    ) : (
                        currentItems.map(item => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border border-primary/30 p-6 hover:bg-primary/5 transition-colors"
                            >
                                {/* Item Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">
                                            {selectedType === 'communities' ? item.name : item.title}
                                        </h3>
                                        <div className="text-xs text-muted-foreground space-y-0.5">
                                            <div>Posted by: <span className="text-primary">@{item.user.username}</span></div>
                                            <div>{new Date(item.created_at).toLocaleDateString()}</div>
                                            {selectedType === 'events' && <div>Date: {new Date(item.event_date).toLocaleDateString()}</div>}
                                            {selectedType === 'jobs' && <div>Company: {item.company}</div>}
                                            {selectedType === 'communities' && <div>Platform: {item.platform}</div>}
                                        </div>
                                    </div>
                                    <span className="text-[10px] border border-yellow-500 text-yellow-500 bg-yellow-500/10 px-2 py-1 font-bold">
                                        PENDING
                                    </span>
                                </div>

                                {/* Description */}
                                <div className="p-3 bg-black/30 border border-border/30 text-sm mb-4">
                                    <p className="text-muted-foreground line-clamp-3">{item.description}</p>
                                </div>

                                {/* Metadata */}
                                <div className="grid grid-cols-3 gap-4 text-xs mb-4 pb-4 border-b border-border/30">
                                    {selectedType === 'events' && (
                                        <>
                                            <div>
                                                <span className="text-muted-foreground">Location</span>
                                                <p className="text-primary font-bold">{item.city}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Category</span>
                                                <p className="text-primary font-bold">{item.category}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Organizer</span>
                                                <p className="text-primary font-bold">{item.organizer}</p>
                                            </div>
                                        </>
                                    )}
                                    {selectedType === 'jobs' && (
                                        <>
                                            <div>
                                                <span className="text-muted-foreground">Location</span>
                                                <p className="text-primary font-bold">{item.city}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Type</span>
                                                <p className="text-primary font-bold">{item.type}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Remote</span>
                                                <p className="text-primary font-bold">{item.is_remote ? 'Yes' : 'No'}</p>
                                            </div>
                                        </>
                                    )}
                                    {selectedType === 'communities' && (
                                        <>
                                            <div>
                                                <span className="text-muted-foreground">Category</span>
                                                <p className="text-primary font-bold">{item.category}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">City</span>
                                                <p className="text-primary font-bold">{item.city || '—'}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Members</span>
                                                <p className="text-primary font-bold">{item.member_count ?? 0}</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApprove(selectedType.slice(0, -1), item.id)}
                                        className="flex-1 bg-green-500/20 text-green-500 border border-green-500 px-4 py-2 font-bold uppercase hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" /> APPROVE
                                    </button>
                                    <button
                                        onClick={() => setRejectingItem(item.id)}
                                        className="flex-1 bg-red-500/20 text-red-500 border border-red-500 px-4 py-2 font-bold uppercase hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" /> REJECT
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Reject Modal */}
                {rejectingItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
                        onClick={() => setRejectingItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-card border border-primary/50 max-w-md w-full p-6 space-y-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="font-black text-lg flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-500" /> REJECTION_REASON
                            </h2>

                            <textarea
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                placeholder="Why are you rejecting this?"
                                className="w-full bg-black border border-primary/30 p-3 text-sm font-mono focus:outline-none focus:border-primary resize-none"
                                rows={4}
                            />

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleReject(selectedType.slice(0, -1), rejectingItem)}
                                    className="flex-1 bg-red-500/20 text-red-500 border border-red-500 px-4 py-2 font-bold uppercase hover:bg-red-500 hover:text-white transition-all"
                                >
                                    REJECT
                                </button>
                                <button
                                    onClick={() => setRejectingItem(null)}
                                    className="flex-1 bg-border/20 border border-border text-muted-foreground px-4 py-2 font-bold uppercase hover:bg-border/30 transition-all"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </HackerLayout>
    );
}
