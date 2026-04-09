import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Search, Shield, Trash2, Ban, AlertTriangle, 
    Check, ChevronLeft, Cpu, Star, Ghost, ShieldAlert,
    MoreVertical, Terminal, Filter, RefreshCcw
} from 'lucide-react';

export default function AdminUsers({ users, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [selectedUser, setSelectedUser] = useState(null);
    const [moderationForm, setModerationForm] = useState({ action: 'warn', reason: '' });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', { search, role: filters.role }, { preserveState: true });
    };

    const executeAction = (userId, action) => {
        const payload = { reason: moderationForm.reason };
        const endpoint = `/admin/users/${userId}/${action}`;
        
        router.post(endpoint, payload, {
            onSuccess: () => {
                setSelectedUser(null);
                setModerationForm({ action: 'warn', reason: '' });
            }
        });
    };

    const getStatusTheme = (user) => {
        if (user.deleted_at) return { color: 'text-gray-500', label: 'DELETED', border: 'border-gray-500/30' };
        if (user.banned_at) return { color: 'text-red-500', label: 'BANNED', border: 'border-red-500/30' };
        if (user.suspended_until && new Date(user.suspended_until) > new Date()) return { color: 'text-yellow-500', label: 'SUSPENDED', border: 'border-yellow-500/30' };
        if (user.is_verified_user) return { color: 'text-primary', label: 'VERIFIED', border: 'border-primary/30' };
        return { color: 'text-primary/60', label: 'ACTIVE', border: 'border-primary/10' };
    };

    return (
        <HackerLayout>
            <Head title="Identity_Terminal // Admin" />
            
            <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6 font-mono">
                
                {/* HEADER */}
                <div className="flex items-center justify-between bg-black/40 border border-primary/20 p-6 relative overflow-hidden">
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 border border-primary bg-primary/10">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-widest text-foreground">
                                IDENTITY_VAULT // <span className="text-primary italic">USER_INDEX</span>
                            </h1>
                            <div className="text-[10px] text-primary/60 flex items-center gap-4 mt-1">
                                <span className="flex items-center gap-1.5 font-black uppercase"><Terminal className="w-3 h-3" /> NODE_COUNT: {users.total}</span>
                                <span className="flex items-center gap-1.5 opacity-40 uppercase"><Shield className="w-3 h-3" /> SEC_CLASS: SUDO</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 relative z-10">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="SEARCH_BY_UID_OR_NAME..."
                                    className="bg-black border border-primary/20 pl-10 pr-4 py-2 text-[10px] text-primary w-64 focus:border-primary outline-none uppercase transition-all"
                                />
                            </div>
                            <button type="submit" className="bg-primary/10 border border-primary text-primary px-4 py-2 text-[10px] font-black uppercase hover:bg-primary hover:text-black transition-all">
                                FILTER_SIGNAL
                            </button>
                        </form>
                    </div>
                </div>

                {/* USER GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
                    {/* TABLE AREA */}
                    <div className="lg:col-span-3 bg-black/40 border border-primary/10 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-primary/5 text-[9px] uppercase tracking-widest text-primary/60 font-black">
                                    <th className="px-6 py-4 border-b border-primary/10">Neutral_Node</th>
                                    <th className="px-6 py-4 border-b border-primary/10">Role_Class</th>
                                    <th className="px-6 py-4 border-b border-primary/10">Status_Vector</th>
                                    <th className="px-6 py-4 border-b border-primary/10">XP_Weight</th>
                                    <th className="px-6 py-4 border-b border-primary/10 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {users.data.map(user => {
                                    const theme = getStatusTheme(user);
                                    return (
                                        <tr 
                                            key={user.id} 
                                            className={`hover:bg-primary/[0.03] transition-colors group cursor-pointer ${selectedUser?.id === user.id ? 'bg-primary/5' : ''}`}
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 border border-primary/20 bg-primary/5 flex items-center justify-center font-black text-primary text-xs uppercase overflow-hidden">
                                                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="text-[11px] font-black uppercase text-foreground group-hover:text-primary transition-colors">{user.name}</div>
                                                        <div className="text-[9px] text-muted-foreground font-mono italic">@{user.username}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[9px] font-black px-2 py-0.5 border uppercase ${user.role === 'admin' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-primary/20 text-primary/60'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[9px] font-black px-2 py-0.5 border uppercase ${theme.border} ${theme.color}`}>
                                                    {theme.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-black tabular-nums text-[10px] text-primary italic">
                                                {user.xp} XP
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="w-4 h-4 text-primary" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Pagination UI */}
                        <div className="p-4 bg-black/20 border-t border-primary/10 flex justify-between items-center text-[10px]">
                            <div className="text-muted-foreground uppercase tracking-widest">Expansion_Sync: PAGE_{users.current_page}_OF_{users.last_page}</div>
                            <div className="flex gap-1">
                                {users.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 border text-[9px] font-black transition-all ${
                                            link.active ? 'bg-primary text-black border-primary' : 'border-primary/10 text-primary hover:border-primary/40'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* INSPECTOR PANEL */}
                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            {selectedUser ? (
                                <motion.div
                                    key={selectedUser.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-black/60 border border-primary/30 p-6 flex flex-col gap-6 sticky top-24"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 border-2 border-primary/40 p-1">
                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center font-black text-2xl uppercase">
                                                {selectedUser.name[0]}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-black uppercase text-foreground">{selectedUser.name}</div>
                                            <div className="text-[10px] text-primary italic">UID: {selectedUser.id}</div>
                                            <div className="text-[9px] text-muted-foreground mt-1 uppercase">Joined: {new Date(selectedUser.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-[9px] uppercase font-black">
                                        <div className="p-2 border border-primary/10 bg-primary/5">
                                            <div className="text-primary/40 mb-1 tracking-tighter">Events_Authored</div>
                                            <div>{selectedUser.events_count || 0}</div>
                                        </div>
                                        <div className="p-2 border border-primary/10 bg-primary/5">
                                            <div className="text-primary/40 mb-1 tracking-tighter">Job_Listings</div>
                                            <div>{selectedUser.job_listings_count || 0}</div>
                                        </div>
                                        <div className="p-2 border border-primary/10 bg-primary/5">
                                            <div className="text-primary/40 mb-1 tracking-tighter">AI_Access</div>
                                            <div className={selectedUser.ai_access_until ? 'text-primary' : 'text-red-500'}>
                                                {selectedUser.ai_access_until ? 'GRANTED' : 'RESTRICTED'}
                                            </div>
                                        </div>
                                        <div className="p-2 border border-primary/10 bg-primary/5">
                                            <div className="text-primary/40 mb-1 tracking-tighter">Sec_Clearance</div>
                                            <div>{selectedUser.role.toUpperCase()}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-primary/10">
                                        <div className="text-[9px] font-bold text-primary/40 uppercase tracking-widest flex items-center gap-2">
                                            <ShieldAlert className="w-3 h-3" /> Mitigation_Tools
                                        </div>
                                        
                                        {selectedUser.deleted_at ? (
                                            <button 
                                                onClick={() => executeAction(selectedUser.id, 'reactivate')}
                                                className="w-full bg-blue-500/20 hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 p-3 font-black uppercase text-xs transition-all flex items-center justify-center gap-2"
                                            >
                                                <RefreshCcw className="w-4 h-4" /> REANIMATE_IDENTITY
                                            </button>
                                        ) : (
                                            <div className="space-y-2">
                                                {!selectedUser.is_verified_user && (
                                                    <button 
                                                        onClick={() => executeAction(selectedUser.id, 'verify')}
                                                        className="w-full bg-primary/20 hover:bg-primary text-primary hover:text-black border border-primary p-3 font-black uppercase text-xs transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Check className="w-4 h-4" /> Verify User
                                                    </button>
                                                )}

                                                {selectedUser.banned_at ? (
                                                    <button 
                                                        onClick={() => executeAction(selectedUser.id, 'unban')}
                                                        className="w-full bg-green-500/20 hover:bg-green-500 text-green-500 hover:text-white border border-green-500 p-3 font-black uppercase text-xs transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Shield className="w-4 h-4" /> LIFT_RESTRICTION
                                                    </button>
                                                ) : (
                                                    <>
                                                        <div className="space-y-2 pt-2 border-t border-primary/5">
                                                            <textarea 
                                                                value={moderationForm.reason}
                                                                onChange={e => setModerationForm({...moderationForm, reason: e.target.value})}
                                                                className="w-full h-20 bg-black border border-primary/20 p-2 text-[10px] text-foreground focus:border-primary outline-none resize-none"
                                                                placeholder="SPECIFY_MITIGATION_RATIONALE..."
                                                            />
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => executeAction(selectedUser.id, 'ban')}
                                                                    className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white border border-red-500 p-2 font-black uppercase text-[10px] transition-all"
                                                                >
                                                                    BAN_PURGE
                                                                </button>
                                                                <button 
                                                                    onClick={() => router.delete(`/admin/users/${selectedUser.id}`)}
                                                                    className="flex-1 bg-gray-500/20 hover:bg-gray-500 text-gray-500 hover:text-white border border-gray-500 p-2 font-black uppercase text-[10px] transition-all"
                                                                >
                                                                    Delete User
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-[400px] bg-black/20 border border-primary/10 flex flex-col items-center justify-center text-center p-8 opacity-40">
                                    <Ghost className="w-12 h-12 text-primary mb-4" />
                                    <p className="text-[10px] uppercase font-black tracking-widest leading-relaxed">
                                        Select an identity from the central vault to inspect neural meta-data and execute mitigation vectors.
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>

            <style jsx>{`
                .tabular-nums {
                    font-variant-numeric: tabular-nums;
                }
            `}</style>
        </HackerLayout>
    );
}
