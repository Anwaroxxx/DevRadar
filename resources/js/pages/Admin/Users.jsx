import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Users, Search, Shield, Trash2, Cpu, ChevronLeft, ChevronRight, Zap, Edit, Check, X, Clock } from 'lucide-react';

export default function AdminUsers({ users, filters }) {
    const [editingUser, setEditingUser] = useState(null);
    const [aiDays, setAiDays] = useState(30);
    const [search, setSearch] = useState(filters.search || '');

    const deleteForm  = useForm({});
    const updateForm  = useForm({ role: '', xp: 0 });
    const aiGrantForm = useForm({ days: 30 });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', { search, role: filters.role }, { preserveState: true });
    };

    const handleDelete = (userId) => {
        if (!confirm('Delete this user? This action is irreversible.')) return;
        deleteForm.delete(`/admin/users/${userId}`);
    };

    const handleUpdate = (user) => {
        updateForm.put(`/admin/users/${user.id}`, { onSuccess: () => setEditingUser(null) });
    };

    const startEdit = (user) => {
        setEditingUser(user.id);
        updateForm.setData({ role: user.role, xp: user.xp });
    };

    const handleGrantAi = (userId) => {
        aiGrantForm.setData('days', aiDays);
        aiGrantForm.post(`/admin/users/${userId}/grant-ai`);
    };

    const handleRevokeAi = (userId) => {
        if (!confirm('Revoke AI access from this user?')) return;
        router.post(`/admin/users/${userId}/revoke-ai`);
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
                    <div className="flex gap-2">
                        {['', 'admin', 'developer'].map(role => (
                            <Link key={role} href={`/admin/users?${role ? `role=${role}` : ''}`}
                                className={`px-3 py-2 text-xs font-mono border uppercase ${filters.role === role || (!filters.role && !role) ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                                {role || 'ALL'}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Users Table */}
                <div className="border border-primary/30 overflow-hidden">
                    <table className="w-full text-sm font-mono">
                        <thead>
                            <tr className="border-b border-primary/30 bg-primary/5">
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">User</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Email</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Role</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">XP</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Stats</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">AI Access</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Actions</th>
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
                                    <td className="px-4 py-3 text-xs text-muted-foreground">{user.email}</td>
                                    <td className="px-4 py-3">
                                        {editingUser === user.id ? (
                                            <select
                                                value={updateForm.data.role}
                                                onChange={e => updateForm.setData('role', e.target.value)}
                                                className="bg-black border border-primary/50 text-xs p-1 focus:outline-none"
                                            >
                                                <option value="developer">developer</option>
                                                <option value="admin">admin</option>
                                            </select>
                                        ) : (
                                            <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase ${user.role === 'admin' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}>
                                                {user.role === 'admin' && <Shield className="w-3 h-3 inline mr-1" />}
                                                {user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {editingUser === user.id ? (
                                            <input
                                                type="number"
                                                value={updateForm.data.xp}
                                                onChange={e => updateForm.setData('xp', parseInt(e.target.value))}
                                                className="bg-black border border-primary/50 text-xs p-1 w-20 focus:outline-none"
                                            />
                                        ) : (
                                            <span className="text-primary font-bold">{user.xp}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">
                                        <div>{user.events_count || 0} events</div>
                                        <div>{user.job_listings_count || 0} jobs</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {user.ai_access_until && new Date(user.ai_access_until) > new Date() ? (
                                            <div>
                                                <div className="text-[10px] text-primary border border-primary/30 px-1 py-0.5 bg-primary/10 mb-1 flex items-center gap-1">
                                                    <Cpu className="w-3 h-3" /> ACTIVE
                                                </div>
                                                <button onClick={() => handleRevokeAi(user.id)} className="text-[9px] text-red-400 hover:underline">REVOKE</button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1">
                                                <input type="number" value={aiDays} onChange={e => setAiDays(e.target.value)}
                                                    className="bg-black border border-border text-xs p-1 w-12 focus:outline-none" min="1" max="3650" />
                                                <button onClick={() => handleGrantAi(user.id)} className="text-[9px] text-primary border border-primary/30 px-1 py-0.5 hover:bg-primary/10 transition-all">
                                                    GRANT
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {editingUser === user.id ? (
                                                <>
                                                    <button onClick={() => handleUpdate(user)} className="text-primary hover:text-white transition-colors" title="Save">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => setEditingUser(null)} className="text-muted-foreground hover:text-white transition-colors" title="Cancel">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => startEdit(user)} className="text-muted-foreground hover:text-primary transition-colors" title="Edit">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(user.id)} className="text-muted-foreground hover:text-red-400 transition-colors" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
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
