import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { AlertCircle, Search, Trash2, Check, X, Filter } from 'lucide-react';

export default function AdminReports({ reports, filters }) {
    const [reviewingReport, setReviewingReport] = useState(null);
    const [reviewForm, setReviewForm] = useState({ action: 'dismissed', notes: '' });
    const [statusFilter, setStatusFilter] = useState(filters.status || 'pending');

    const handleReview = (reportId) => {
        router.post(`/admin/reports/${reportId}/review`, reviewForm, {
            onSuccess: () => {
                setReviewingReport(null);
                setReviewForm({ action: 'dismissed', notes: '' });
            }
        });
    };

    const getReasonBadge = (reason) => {
        const colors = {
            spam: 'text-purple-500 border-purple-500/30 bg-purple-500/10',
            harassment: 'text-red-500 border-red-500/30 bg-red-500/10',
            fake: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10',
            scam: 'text-orange-500 border-orange-500/30 bg-orange-500/10',
            plagiarism: 'text-blue-500 border-blue-500/30 bg-blue-500/10',
            inappropriate: 'text-red-500 border-red-500/30 bg-red-500/10',
        };
        return colors[reason] || 'text-muted-foreground border-border/30 bg-border/10';
    };

    return (
        <HackerLayout>
            <Head title="Admin — Reports" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-primary/30 pb-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-mono text-xs">← ADMIN</Link>
                        <span className="text-border">/</span>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-primary" /> CONTENT_REPORTS
                        </h1>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                        {reports.total} total reports
                    </div>
                </div>

                {/* Status Filter */}
                <div className="flex gap-2">
                    {['pending', 'reviewed', 'resolved', 'dismissed'].map(status => (
                        <Link
                            key={status}
                            href={`/admin/reports?status=${status}`}
                            className={`px-4 py-2 text-xs font-bold border uppercase transition-all ${
                                statusFilter === status
                                    ? 'border-primary text-primary bg-primary/10'
                                    : 'border-border text-muted-foreground hover:border-primary/50'
                            }`}
                        >
                            {status}
                        </Link>
                    ))}
                </div>

                {/* Reports List */}
                <div className="space-y-4">
                    {reports.data.length === 0 ? (
                        <div className="border border-border/50 p-8 text-center text-muted-foreground">
                            No reports found.
                        </div>
                    ) : (
                        reports.data.map(report => (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border border-primary/30 p-6 space-y-4 hover:bg-primary/5 transition-colors"
                            >
                                {/* Report Header */}
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] px-2 py-1 border font-bold uppercase ${getReasonBadge(report.reason)}`}>
                                                {report.reason}
                                            </span>
                                            <span className={`text-[10px] px-2 py-1 border font-bold uppercase ${
                                                report.status === 'pending'
                                                    ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10'
                                                    : 'border-primary text-primary bg-primary/10'
                                            }`}>
                                                {report.status}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {report.content_type.toUpperCase()} #{report.content_id}
                                            </span>
                                        </div>
                                        <div className="text-sm font-mono">
                                            Reported by: <span className="text-primary">@{report.reporter.username}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {report.description && (
                                    <div className="p-3 bg-black/30 border border-border/30 text-sm">
                                        <p className="text-muted-foreground italic">{report.description}</p>
                                    </div>
                                )}

                                {/* Admin Notes (if reviewed) */}
                                {report.status !== 'pending' && report.admin_notes && (
                                    <div className="p-3 bg-primary/5 border border-primary/30">
                                        <div className="text-[10px] font-bold text-primary uppercase mb-1">Admin Notes</div>
                                        <p className="text-sm text-muted-foreground">{report.admin_notes}</p>
                                        <div className="text-[10px] text-muted-foreground mt-2">
                                            Reviewed by: <span className="text-primary">@{report.admin.username}</span> • Action: <span className="text-primary font-bold">{report.action_taken}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Action */}
                                {report.status === 'pending' && (
                                    <button
                                        onClick={() => {
                                            setReviewingReport(report.id);
                                            setReviewForm({ action: 'dismissed', notes: '' });
                                        }}
                                        className="w-full bg-primary/20 text-primary border border-primary px-4 py-2 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        REVIEW_REPORT
                                    </button>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Review Modal */}
                {reviewingReport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
                        onClick={() => setReviewingReport(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-card border border-primary/50 max-w-md w-full p-6 space-y-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="font-black text-lg">REVIEW_REPORT #{reviewingReport}</h2>

                            <div className="space-y-3">
                                {/* Action */}
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Action</label>
                                    <select
                                        value={reviewForm.action}
                                        onChange={e => setReviewForm({ ...reviewForm, action: e.target.value })}
                                        className="w-full bg-black border border-primary/30 p-2 text-sm font-mono mt-1 focus:outline-none focus:border-primary"
                                    >
                                        <option value="dismissed">DISMISS (no action)</option>
                                        <option value="warning">WARN (user)</option>
                                        <option value="suspend">SUSPEND (user)</option>
                                        <option value="ban">BAN (user)</option>
                                        <option value="delete">DELETE (content)</option>
                                    </select>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Notes</label>
                                    <textarea
                                        value={reviewForm.notes}
                                        onChange={e => setReviewForm({ ...reviewForm, notes: e.target.value })}
                                        className="w-full bg-black border border-primary/30 p-2 text-sm font-mono mt-1 focus:outline-none focus:border-primary resize-none"
                                        rows={3}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleReview(reviewingReport)}
                                    className="flex-1 bg-primary/20 text-primary border border-primary px-4 py-2 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all"
                                >
                                    CONFIRM
                                </button>
                                <button
                                    onClick={() => setReviewingReport(null)}
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
