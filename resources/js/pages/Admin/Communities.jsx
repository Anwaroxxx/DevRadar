import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Network, Search, Trash2, User, Users, ExternalLink } from 'lucide-react';

export default function AdminCommunities({ communities, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const deleteForm = useForm({});

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/communities', { search }, { preserveState: true });
    };

    const handleDelete = (communityId) => {
        if (!confirm('Delete this community? This action is irreversible.')) return;
        deleteForm.delete(`/admin/communities/${communityId}`);
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

                {/* Communities Table */}
                <div className="border border-primary/30 overflow-hidden">
                    <table className="w-full text-sm font-mono">
                        <thead>
                            <tr className="border-b border-primary/30 bg-primary/5">
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Community</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Platform</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Category</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Members</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Creator</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {communities.data.map(community => (
                                <motion.tr key={community.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-primary/5 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-bold">{community.name}</div>
                                        <div className="text-xs text-muted-foreground line-clamp-1">{community.description}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase ${platformColors[community.platform] || 'border-border text-muted-foreground'}`}>
                                            {community.platform}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground uppercase">{community.category}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 text-primary font-bold">
                                            <Users className="w-3 h-3" /> {community.member_count?.toLocaleString()}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">{community.followers_count} followers</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={`/profile/${community.user?.username}`} className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                                            <User className="w-3 h-3" /> @{community.user?.username}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <a href={community.join_link} target="_blank" rel="noopener noreferrer"
                                                className="text-muted-foreground hover:text-primary p-1 transition-colors" title="Join link">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button onClick={() => handleDelete(community.id)}
                                                className="text-muted-foreground hover:text-red-400 p-1 transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {communities.links && communities.links.length > 3 && (
                    <div className="flex justify-center gap-2 font-mono">
                        {communities.links.map((link, k) => (
                            <Link key={k} href={link.url || '#'}
                                className={`px-3 py-1 text-xs border ${link.active ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </HackerLayout>
    );
}
