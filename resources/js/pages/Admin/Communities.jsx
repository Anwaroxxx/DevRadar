import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { 
    Network, Search, Trash2, User, Users, ExternalLink, 
    Activity, Shield, Terminal, Clock, ChevronRight, BarChart3,
    Database, Zap, Target, X
} from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';
import axios from 'axios';

export default function AdminCommunities({ communities, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
    const deleteForm = useForm({});

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/communities', { search }, { preserveState: true });
    };

    const handleDelete = (communityId) => {
        setConfirmDelete({ open: true, id: communityId });
    };

    const performDelete = () => {
        if (!confirmDelete.id) return;
        deleteForm.delete(`/admin/content/community/${confirmDelete.id}`, {
            onSuccess: () => {
                setConfirmDelete({ open: false, id: null });
                setSelectedCommunity(null);
            }
        });
    };

    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [snapshotData, setSnapshotData] = useState([]);
    const [isLoadingStats, setIsLoadingStats] = useState(false);

    const fetchStats = async (community) => {
        setIsLoadingStats(true);
        try {
            const response = await axios.get(`/admin/communities/${community.id}/stats`);
            setSnapshotData(response.data.snapshots);
            setSelectedCommunity(community);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    const handleCaptureSnapshot = (id) => {
        router.post(`/admin/communities/${id}/snapshot`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                const updated = communities.data.find(c => c.id === id);
                if (updated) fetchStats(updated);
            }
        });
    };

    const platformColors = {
        Discord: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
        Telegram: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
        Meetup: 'text-red-400 border-red-400/30 bg-red-400/10',
        Slack: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
        WhatsApp: 'text-green-400 border-green-400/30 bg-green-400/10',
    };

    return (
        <HackerLayout>
            <Head title="Admin — Communities" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                <div className="flex items-center justify-between border-b border-primary/30 pb-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-mono text-xs">← ADMIN</Link>
                        <span className="text-border">/</span>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <Network className="w-6 h-6 text-primary" /> COMMUNITY_MANAGEMENT
                        </h1>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">{communities.total} total communities</div>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search communities..."
                            className="w-full bg-card border border-primary/30 pl-9 pr-4 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-all" />
                    </div>
                    <button type="submit" className="bg-primary/20 text-primary border border-primary px-4 py-2 text-xs font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all">SEARCH</button>
                </form>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Communities Table */}
                    <div className={`border border-primary/30 overflow-hidden bg-black/40 ${selectedCommunity ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm font-mono">
                                <thead>
                                    <tr className="border-b border-primary/30 bg-primary/5">
                                        <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-primary/60">Node_Identity</th>
                                        <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-primary/60">Logic_Type</th>
                                        <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-primary/60">Signals</th>
                                        <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-primary/60">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/10">
                                    {communities.data.map(community => (
                                        <motion.tr 
                                            key={community.id} 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }} 
                                            className={`hover:bg-primary/10 transition-colors cursor-pointer group ${selectedCommunity?.id === community.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}
                                            onClick={() => fetchStats(community)}
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                        <Shield className={`w-4 h-4 ${selectedCommunity?.id === community.id ? 'text-primary' : 'text-primary/40'}`} />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-primary uppercase text-xs">{community.name}</div>
                                                        <div className="text-[10px] text-primary/40 flex items-center gap-2">
                                                            <User className="w-2.5 h-2.5" /> @{community.user?.username}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`text-[9px] px-1.5 py-0.5 border font-bold uppercase w-fit ${platformColors[community.platform] || 'border-border text-muted-foreground'}`}>
                                                        {community.platform}
                                                    </span>
                                                    <span className="text-[9px] text-muted-foreground uppercase opacity-60">{community.category}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-4 text-[10px] font-black">
                                                    <div className="flex items-center gap-1.5 text-primary" title="Followers">
                                                        <Users className="w-3 h-3" /> {community.followers_count}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-blue-400" title="Posts">
                                                        <Zap className="w-3 h-3" /> {community.posts_count}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(community.id); }}
                                                        className="text-primary/40 hover:text-red-500 transition-colors"
                                                        title="Purge Node"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <ChevronRight className="w-4 h-4 text-primary/20" />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Intelligence Inspector Sidebar */}
                    {selectedCommunity && (
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-black border-2 border-primary/40 p-6 flex flex-col space-y-6 shadow-[0_0_30px_rgba(34,197,94,0.05)] relative"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Terminal className="w-32 h-32 text-primary" />
                            </div>

                            <div className="flex items-center justify-between border-b border-primary/20 pb-4">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-black text-primary uppercase leading-none">{selectedCommunity.name}</h2>
                                    <div className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest">NODE_INSPECTOR v2.0</div>
                                </div>
                                <button onClick={() => setSelectedCommunity(null)} className="text-primary/40 hover:text-primary transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-primary/5 border border-primary/10 p-3">
                                    <div className="text-[8px] text-primary/60 uppercase font-black mb-1">ENGAGEMENT_SIGNAL</div>
                                    <div className="text-xl font-black text-primary tracking-tighter flex items-end gap-1">
                                        {(selectedCommunity.followers_count * 1 + selectedCommunity.posts_count * 5 + (selectedCommunity.comments_count || 0) * 2)}
                                        <Activity className="w-3 h-3 text-primary/40 animate-pulse mb-1" />
                                    </div>
                                </div>
                                <div className="bg-primary/5 border border-primary/10 p-3">
                                    <div className="text-[8px] text-primary/60 uppercase font-black mb-1">DATA_CLUSTERS</div>
                                    <div className="text-xl font-black text-primary tracking-tighter">
                                        {(selectedCommunity.posts_count + (selectedCommunity.comments_count || 0)).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <BarChart3 className="w-3 h-3" /> HISTORICAL_INTEL
                                    </h3>
                                    <button 
                                        onClick={() => handleCaptureSnapshot(selectedCommunity.id)}
                                        className="text-[8px] font-black bg-primary/10 hover:bg-primary text-primary hover:text-black border border-primary/40 px-2 py-1 transition-all"
                                    >
                                        CAPTURE_SIGNAL
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto font-mono scrollbar-thin scrollbar-thumb-primary/20">
                                    {snapshotData.length === 0 ? (
                                        <div className="py-8 text-center text-[9px] text-muted-foreground border border-dashed border-primary/10 uppercase italic">
                                            No intelligence recorded. Push CAPTURE_SIGNAL to begin tracking growth.
                                        </div>
                                    ) : (
                                        snapshotData.map(snap => (
                                            <div key={snap.id} className="border border-primary/5 p-2 bg-primary/[0.02] flex items-center justify-between group hover:bg-primary/5 transition-all">
                                                <div className="space-y-0.5">
                                                    <div className="text-[9px] font-black text-primary/80">{new Date(snap.created_at).toLocaleDateString()} {new Date(snap.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                                    <div className="flex gap-2 text-[8px] text-muted-foreground uppercase">
                                                        <span>F:{snap.followers_count}</span>
                                                        <span>P:{snap.posts_count}</span>
                                                        <span>C:{snap.comments_count}</span>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-black text-primary">SIG_{snap.engagement_signal}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="mt-auto space-y-3 pt-6 border-t border-primary/20">
                                <a 
                                    href={`/communities/${selectedCommunity.id}`} 
                                    className="w-full flex items-center justify-center gap-2 bg-primary text-black py-2.5 text-xs font-black uppercase hover:brightness-110 transition-all"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Launch_Public_View
                                </a>
                                <button 
                                    onClick={() => handleDelete(selectedCommunity.id)}
                                    className="w-full flex items-center justify-center gap-2 border border-red-500/40 text-red-500 py-2.5 text-xs font-black uppercase hover:bg-red-500/10 transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Purge_Node
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {communities.links && communities.links.length > 3 && (
                    <div className="flex justify-center gap-2 font-mono">
                        {communities.links.map((link, k) => (
                            <Link key={k} href={link.url || '#'}
                                className={`px-4 py-2 text-[10px] font-black border transition-all ${link.active ? 'border-primary text-primary bg-primary/10 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'border-primary/20 text-muted-foreground hover:border-primary/40'} ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
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
                title="Purge Community Node"
                description="This action will permanently dissolve this community and all its connections. This is a level-zero data wipe."
                confirmText="Delete Community"
                variant="destructive"
            />
        </HackerLayout>
    );
}
