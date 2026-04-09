import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Zap, Plus, Edit, AlertTriangle } from 'lucide-react';

export default function AdminXpEconomy({ rewards, stats }) {
    const [editingReward, setEditingReward] = useState(null);
    const [editForm, setEditForm] = useState({ amount: 0, is_active: true });
    const [creating, setCreating] = useState(false);
    const [createForm, setCreateForm] = useState({ action: '', amount: 0, description: '' });

    const handleEdit = (reward) => {
        setEditingReward(reward.id);
        setEditForm({ amount: reward.amount, is_active: reward.is_active });
    };

    const handleSaveEdit = (rewardId) => {
        router.put(`/admin/xp-rewards/${rewardId}`, editForm, {
            onSuccess: () => {
                setEditingReward(null);
                setEditForm({ amount: 0, is_active: true });
            }
        });
    };

    const handleCreateReward = () => {
        router.post('/admin/xp-rewards', createForm, {
            onSuccess: () => {
                setCreating(false);
                setCreateForm({ action: '', amount: 0, description: '' });
            }
        });
    };

    return (
        <HackerLayout>
            <Head title="Admin — XP Economy" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-primary/30 pb-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-mono text-xs">← ADMIN</Link>
                        <span className="text-border">/</span>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <Zap className="w-6 h-6 text-primary" /> XP Economy
                        </h1>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-primary/30 bg-primary/5 p-4">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total Users</div>
                        <div className="text-3xl font-black text-primary mt-2">{stats.user_count}</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-primary/30 bg-primary/5 p-4">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total XP Earned</div>
                        <div className="text-3xl font-black text-primary mt-2">{stats.total_earned.toLocaleString()}</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-primary/30 bg-primary/5 p-4">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Avg XP Per User</div>
                        <div className="text-3xl font-black text-primary mt-2">{stats.avg_earned.toLocaleString()}</div>
                    </motion.div>
                </div>

                {/* Create New Reward */}
                {!creating ? (
                    <button
                        onClick={() => setCreating(true)}
                        className="w-full border border-primary/50 text-primary px-4 py-3 font-bold uppercase hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Create New Reward
                    </button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-primary/50 bg-primary/5 p-4 space-y-3"
                    >
                        <h3 className="font-bold text-lg">Create New Reward</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Action Name</label>
                                <input
                                    type="text"
                                    value={createForm.action}
                                    onChange={e => setCreateForm({ ...createForm, action: e.target.value })}
                                    placeholder="e.g., create_event"
                                    className="w-full bg-black border border-primary/30 p-2 text-sm font-mono mt-1 focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">XP Amount</label>
                                <input
                                    type="number"
                                    value={createForm.amount}
                                    onChange={e => setCreateForm({ ...createForm, amount: parseInt(e.target.value) })}
                                    min="1"
                                    max="10000"
                                    className="w-full bg-black border border-primary/30 p-2 text-sm font-mono mt-1 focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Description</label>
                                <textarea
                                    value={createForm.description}
                                    onChange={e => setCreateForm({ ...createForm, description: e.target.value })}
                                    placeholder="Optional description..."
                                    className="w-full bg-black border border-primary/30 p-2 text-sm font-mono mt-1 focus:outline-none focus:border-primary resize-none"
                                    rows={2}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCreateReward}
                                className="flex-1 bg-primary/20 text-primary border border-primary px-4 py-2 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                                CREATE
                            </button>
                            <button
                                onClick={() => setCreating(false)}
                                className="flex-1 bg-border/20 border border-border text-muted-foreground px-4 py-2 font-bold uppercase hover:bg-border/30 transition-all"
                            >
                                CANCEL
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Rewards List */}
                <div className="space-y-3">
                    <h2 className="text-lg font-bold uppercase">Current Rewards</h2>
                    {rewards.map(reward => (
                        <motion.div
                            key={reward.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`border p-4 transition-all ${reward.is_active ? 'border-primary/30 bg-primary/5' : 'border-muted-foreground/30 bg-muted/5'}`}
                        >
                            {editingReward === reward.id ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="font-bold text-sm">{reward.action}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{reward.description}</div>
                                        </div>
                                        <span className={`text-xs px-2 py-1 border font-bold ${reward.is_active ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-red-500 text-red-500 bg-red-500/10'}`}>
                                            {reward.is_active ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground">XP Amount</label>
                                            <input
                                                type="number"
                                                value={editForm.amount}
                                                onChange={e => setEditForm({ ...editForm, amount: parseInt(e.target.value) })}
                                                min="1"
                                                max="10000"
                                                className="w-full bg-black border border-primary/30 p-2 text-sm font-mono mt-1 focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={editForm.is_active}
                                                onChange={e => setEditForm({ ...editForm, is_active: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                            <label className="text-sm font-bold">active</label>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => handleSaveEdit(reward.id)}
                                            className="flex-1 bg-primary/20 text-primary border border-primary px-3 py-1 text-xs font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all"
                                        >
                                            SAVE
                                        </button>
                                        <button
                                            onClick={() => setEditingReward(null)}
                                            className="flex-1 bg-border/20 border border-border text-muted-foreground px-3 py-1 text-xs font-bold uppercase hover:bg-border/30 transition-all"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-sm">{reward.action}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{reward.description}</div>
                                        <div className="text-sm font-black text-primary mt-2">{reward.amount} XP</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-2 py-1 border font-bold ${reward.is_active ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-red-500 text-red-500 bg-red-500/10'}`}>
                                            {reward.is_active ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                        <button
                                            onClick={() => handleEdit(reward)}
                                            className="text-primary hover:text-primary/80 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </HackerLayout>
    );
}
