import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Cpu, Search, ChevronDown, AlertTriangle } from 'lucide-react';

export default function AdminAiAccess({ users, usage_logs, tiers }) {
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ ai_tier: 'free', monthly_tokens: 0 });
    const [search, setSearch] = useState('');

    const handleEdit = (user) => {
        setEditingUser(user.id);
        setEditForm({ ai_tier: user.ai_tier, monthly_tokens: user.ai_monthly_tokens });
    };

    const handleSave = (userId) => {
        router.put(`/admin/users/${userId}/ai-tier`, editForm, {
            onSuccess: () => {
                setEditingUser(null);
                setEditForm({ ai_tier: 'free', monthly_tokens: 0 });
            }
        });
    };

    const handleRevoke = (userId) => {
        if (!confirm('Revoke AI access from this user?')) return;
        router.post(`/admin/users/${userId}/revoke-ai`);
    };

    const handleResetUsage = (userId) => {
        if (!confirm('Reset monthly usage for this user?')) return;
        router.post(`/admin/users/${userId}/reset-ai-usage`);
    };

    const getTierColor = (tier) => {
        return {
            'free': 'text-gray-400',
            'basic': 'text-blue-500',
            'pro': 'text-purple-500',
            'unlimited': 'text-yellow-500',
        }[tier] || 'text-gray-400';
    };

    const getTierBgColor = (tier) => {
        return {
            'free': 'bg-gray-500/10 border-gray-500/30',
            'basic': 'bg-blue-500/10 border-blue-500/30',
            'pro': 'bg-purple-500/10 border-purple-500/30',
            'unlimited': 'bg-yellow-500/10 border-yellow-500/30',
        }[tier] || 'bg-gray-500/10 border-gray-500/30';
    };

    return (
        <HackerLayout>
            <Head title="Admin — AI Access" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-primary/30 pb-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-mono text-xs">← ADMIN</Link>
                        <span className="text-border">/</span>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <Cpu className="w-6 h-6 text-primary" /> AI_ACCESS_CONTROL
                        </h1>
                    </div>
                </div>

                {/* Usage Chart */}
                {usage_logs.length > 0 && (
                    <div className="border border-primary/30 bg-primary/5 p-4">
                        <h2 className="font-bold text-lg mb-4">AI Usage (Last 30 Days)</h2>
                        <div className="flex items-end gap-2 h-24">
                            {usage_logs.map((log, idx) => {
                                const maxTokens = Math.max(...usage_logs.map(l => l.total_tokens || 0));
                                const height = maxTokens > 0 ? (log.total_tokens / maxTokens) * 100 : 0;
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                        <div
                                            className="w-full bg-primary/50 hover:bg-primary transition-all"
                                            style={{ height: `${height}%` }}
                                            title={`${log.total_tokens} tokens on ${log.date}`}
                                        />
                                        <div className="text-[10px] text-muted-foreground text-center leading-tight">{log.total_tokens.toLocaleString()}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Users with AI Access */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold uppercase">Users with AI Access</h2>

                    {users.data.map(user => {
                        const usagePercent = user.ai_monthly_tokens > 0
                            ? Math.round((user.ai_tokens_used_this_month / user.ai_monthly_tokens) * 100)
                            : 0;

                        return (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="border border-primary/30 bg-primary/5 p-4 space-y-3"
                            >
                                {editingUser === user.id ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground">AI Tier</label>
                                                <select
                                                    value={editForm.ai_tier}
                                                    onChange={e => setEditForm({ ...editForm, ai_tier: e.target.value })}
                                                    className="w-full bg-black border border-primary/30 p-2 text-sm font-mono mt-1 focus:outline-none focus:border-primary"
                                                >
                                                    {tiers.map(tier => <option key={tier} value={tier}>{tier.toUpperCase()}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Monthly Tokens</label>
                                                <input
                                                    type="number"
                                                    value={editForm.monthly_tokens}
                                                    onChange={e => setEditForm({ ...editForm, monthly_tokens: parseInt(e.target.value) })}
                                                    min="1000"
                                                    className="w-full bg-black border border-primary/30 p-2 text-sm font-mono mt-1 focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleSave(user.id)}
                                                className="flex-1 bg-primary/20 text-primary border border-primary px-3 py-2 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all"
                                            >
                                                SAVE
                                            </button>
                                            <button
                                                onClick={() => setEditingUser(null)}
                                                className="flex-1 bg-border/20 border border-border text-muted-foreground px-3 py-2 font-bold uppercase hover:bg-border/30 transition-all"
                                            >
                                                CANCEL
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* User Info */}
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-bold text-sm">{user.name}</div>
                                                <div className="text-xs text-muted-foreground">@{user.username} • {user.email}</div>
                                            </div>
                                            <span className={`text-[10px] px-2 py-1 border font-bold uppercase ${getTierBgColor(user.ai_tier)} ${getTierColor(user.ai_tier)}`}>
                                                {user.ai_tier}
                                            </span>
                                        </div>

                                        {/* Token Usage */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Monthly Quota:</span>
                                                <span className="font-bold">{user.ai_monthly_tokens.toLocaleString()} tokens</span>
                                            </div>
                                            <div className="w-full bg-black border border-primary/30 h-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-primary/50"
                                                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                <span>Used: {user.ai_tokens_used_this_month.toLocaleString()}</span>
                                                <span>{usagePercent}%</span>
                                            </div>
                                        </div>

                                        {/* Access Until */}
                                        {user.ai_access_until && (
                                            <div className="text-xs text-muted-foreground border-t border-primary/20 pt-2">
                                                <span>Access until: </span>
                                                <span className="font-bold">{new Date(user.ai_access_until).toLocaleDateString()}</span>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2 border-t border-primary/20">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="flex-1 text-[10px] border border-primary/30 text-primary px-2 py-1 font-bold uppercase hover:bg-primary/10 transition-all"
                                            >
                                                EDIT TIER
                                            </button>
                                            <button
                                                onClick={() => handleResetUsage(user.id)}
                                                className="flex-1 text-[10px] border border-yellow-500/40 text-yellow-500 px-2 py-1 font-bold uppercase hover:bg-yellow-500/10 transition-all"
                                            >
                                                RESET USAGE
                                            </button>
                                            <button
                                                onClick={() => handleRevoke(user.id)}
                                                className="flex-1 text-[10px] border border-red-500/40 text-red-500 px-2 py-1 font-bold uppercase hover:bg-red-500/10 transition-all"
                                            >
                                                REVOKE
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

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
