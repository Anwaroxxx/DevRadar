import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Users, Search, Shield, Trash2, Ban, AlertTriangle, Check, ChevronLeft } from 'lucide-react';

export default function AdminUsers({ users, filters }) {
    const [editingUser, setEditingUser] = useState(null);
    const [moderationUser, setModerationUser] = useState(null);
    const [moderationForm, setModerationForm] = useState({ action: 'warn', days: 7, reason: '' });
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', { search, role: filters.role }, { preserveState: true });
    };

    const handleModeration = (userId) => {
        const endpoints = {
            warn: `/admin/users/${userId}/warn`,
            ban: `/admin/users/${userId}/ban`,
            suspend: `/admin/users/${userId}/suspend`,
            verify: `/admin/users/${userId}/verify`,
        };

        const data = { reason: moderationForm.reason };
        if (moderationForm.action === 'suspend') {
            data.days = moderationForm.days;
        }

        router.post(endpoints[moderationForm.action], data, {
            onSuccess: () => {
                setModerationUser(null);
                setModerationForm({ action: 'warn', days: 7, reason: '' });
            }
        });
    };

    return (
        <HackerLayout>
            <Head title="Admin — Users" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-primary/30 pb-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-mono text-xs">← ADMIN</Link>
                        <span className="text-border">/</span>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <Users className="w-6 h-6 text-primary" /> USER_MANAGEMENT
                        </h1>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                        {users.total} total users
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name, email or username..."
                                className="w-full bg-card border border-primary/30 pl-9 pr-4 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <button type="submit" className="bg-primary/20 text-primary border border-primary px-4 py-2 text-xs font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all">
                            SEARCH
                        </button>
                    </form>
                </div>

                {/* Users Table */}
                <div className="border border-primary/30 overflow-hidden">
                    <table className="w-full text-sm font-mono">
                        <thead>
                            <tr className="border-b border-primary/30 bg-primary/5">
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">User</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Status</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Warnings</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {users.data.map(user => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-primary/5 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 border border-primary/40 bg-primary/10 flex items-center justify-center text-xs font-black text-primary uppercase shrink-0">
                                                {user.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">{user.name}</div>
                                                <div className="text-xs text-muted-foreground">@{user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="space-y-1">
                                            {user.banned_at && <div className="text-[10px] text-red-500 border border-red-500/30 px-1 py-0.5 bg-red-500/10 font-bold">🚫 BANNED</div>}
                                            {user.suspended_until && new Date(user.suspended_until) > new Date() && <div className="text-[10px] text-yellow-500 border border-yellow-500/30 px-1 py-0.5 bg-yellow-500/10 font-bold">⏸ SUSPENDED</div>}
                                            {user.is_verified_user && <div className="text-[10px] text-green-500 border border-green-500/30 px-1 py-0.5 bg-green-500/10 font-bold">✓ VERIFIED</div>}
                                            {!user.banned_at && !user.suspended_until && !user.is_verified_user && <div className="text-[10px] text-muted-foreground">ACTIVE</div>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`font-bold ${user.warning_count >= 3 ? 'text-red-500' : user.warning_count > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
                                            {user.warning_count || 0}/3
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            {!user.banned_at && (
                                                <button
                                                    onClick={() => setModerationUser(user.id)}
                                                    className="text-[10px] border border-primary/40 px-2 py-1 hover:bg-primary/10 transition-all font-bold"
                                                >
                                                    ACTION
                                                </button>
                                            )}
                                            {user.banned_at && (
                                                <button
                                                    onClick={() => router.post(`/admin/users/${user.id}/unban`)}
                                                    className="text-[10px] border border-green-500/40 px-2 py-1 text-green-500 hover:bg-green-500/10 transition-all font-bold"
                                                >
                                                    UNBAN
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Moderation Modal */}
                {moderationUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
                        onClick={() => setModerationUser(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-card border border-primary/50 max-w-md w-full p-6 space-y-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="font-black text-lg flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-500" /> MODERATION_ACTION
                            </h2>

                            <div className="space-y-3">
                                {/* Action type */}
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Action</label>
                                    <select
                                        value={moderationForm.action}
                                        onChange={e => setModerationForm({ ...moderationForm, action: e.target.value })}
                                        className="w-full bg-black border border-primary/30 p-2 text-sm font-mono mt-1 focus:outline-none focus:border-primary"
                                    >
                                        <option value="warn">⚠️ WARN (3 strikes = auto-suspend)</option>
                                        <option value="suspend">⏸ SUSPEND</option>
                                        <option value="ban">🚫 BAN</option>
                                        <option value="verify">✓ VERIFY</option>
                                    </select>
                                </div>

                                {/* Suspension days (if suspend) */}
                                {moderationForm.action === 'suspend' &&  (
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Suspension Days</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="365"
                                            value={moderationForm.days}
                                            onChange={e => setModerationForm({ ...moderationForm, days: parseInt(e.target.value) })}
                                            className="w-full bg-black border border-primary/30 p-2 text-sm font-mono mt-1 focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                )}

                                {/* Reason (if not verify) */}
                                {moderationForm.action !== 'verify' && (
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Reason</label>
                                        <textarea
                                            value={moderationForm.reason}
                                            onChange={e => setModerationForm({ ...moderationForm, reason: e.target.value })}
                                            className="w-full bg-black border border-primary/30 p-2 text-sm font-mono mt-1 focus:outline-none focus:border-primary resize-none"
                                            rows={3}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleModeration(moderationUser)}
                                    className="flex-1 bg-primary/20 text-primary border border-primary px-4 py-2 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all"
                                >
                                    CONFIRM
                                </button>
                                <button
                                    onClick={() => setModerationUser(null)}
                                    className="flex-1 bg-border/20 border border-border text-muted-foreground px-4 py-2 font-bold uppercase hover:bg-border/30 transition-all"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-muted-foreground">
                        Page {users.current_page} of {users.last_page}
                    </div>
                    <div className="flex gap-2">
                        {users.links.map((link, idx) => (
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
            </div>
        </HackerLayout>
    );
}

                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.links && users.links.length > 3 && (
                    <div className="flex justify-center gap-2 font-mono">
                        {users.links.map((link, k) => (
                            <Link key={k} href={link.url || '#'}
                                className={`px-3 py-1 text-xs border ${link.active ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </HackerLayout>
    );
}
