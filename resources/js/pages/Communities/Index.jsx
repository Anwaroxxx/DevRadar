import { Head, Link, usePage, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Users, Globe, UserPlus, Fingerprint, Plus, User } from 'lucide-react';

export default function CommunitiesIndex({ communities, filters }) {
    const { auth } = usePage().props;

    return (
        <HackerLayout>
            <Head title="Active Clusters" />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                    <h1 className="text-3xl font-black uppercase tracking-widest text-primary">&gt; Communities</h1>
                    {auth.user && (
                        <Link href="/communities/create" className="bg-primary/20 text-primary border border-primary px-6 py-2 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                             <Plus className="w-4 h-4" /> Create Community
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-card border border-primary/20 p-4 mb-8 font-mono text-sm flex gap-4 overflow-x-auto">
                    <div className="text-muted-foreground mr-2 border-r border-border pr-4 py-1">Category:</div>
                    <Link href="/communities" className={`px-3 py-1 border ${!filters.category ? 'border-primary text-primary bg-primary/10' : 'border-transparent hover:border-primary/50'}`}>ALL</Link>
                    <Link href="/communities?category=frontend" className={`px-3 py-1 border ${filters.category === 'frontend' ? 'border-primary text-primary bg-primary/10' : 'border-transparent hover:border-primary/50'}`}>FRONTEND</Link>
                    <Link href="/communities?category=backend" className={`px-3 py-1 border ${filters.category === 'backend' ? 'border-primary text-primary bg-primary/10' : 'border-transparent hover:border-primary/50'}`}>BACKEND</Link>
                    <Link href="/communities?category=devops" className={`px-3 py-1 border ${filters.category === 'devops' ? 'border-primary text-primary bg-primary/10' : 'border-transparent hover:border-primary/50'}`}>DEVOPS</Link>
                    <Link href="/communities?category=ai" className={`px-3 py-1 border ${filters.category === 'ai' ? 'border-primary text-primary bg-primary/10' : 'border-transparent hover:border-primary/50'}`}>A.I.</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {communities.data.map((community, idx) => {
                        const isFollowing = auth.user && community.followers?.some(f => f.id === auth.user.id);
                        
                        return (
                        <motion.div 
                            key={community.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-card border border-border p-6 hover:border-primary transition-all group flex flex-col h-full relative"
                        >
                            {/* Circuit board accent pattern */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:16px_16px]"></div>

                            <div className="flex justify-between items-start mb-6">
                                <div className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 uppercase border border-primary/30 shadow-[0_0_5px_rgba(34,197,94,0.2)]">
                                    sys.{community.category}
                                </div>
                                <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                                     <Users className="w-3 h-3" /> {community.member_count} members
                                </div>
                            </div>

                            <Link href={`/communities/${community.id}`}>
                                <h2 className="text-2xl font-bold mb-2 break-words group-hover:text-primary transition-colors cursor-pointer">{community.name}</h2>
                            </Link>

                                                        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-4 opacity-70 flex-wrap">
                                 <Fingerprint className="w-3 h-3" /> ID: {community.id.toString().padStart(6, '0')}
                                {community.city && <span className="ml-2 border-l border-border pl-2">Location: {community.city}</span>}
                                {community.user && (
                                    <span className="ml-2 border-l border-border pl-2 flex items-center gap-1">
                                        <User className="w-3 h-3 text-primary" />
                                        <Link href={`/profile/${community.user.username}`} className="hover:text-primary transition-colors">
                                            @{community.user.username}
                                        </Link>
                                    </span>
                                )}
                             </div>

                            <p className="text-sm font-mono text-muted-foreground mb-6 flex-1 line-clamp-3">
                                {community.description}
                            </p>

                            <div className="mt-auto border-t border-border/50 pt-4 flex justify-between items-center">
                                <span className="text-xs font-mono text-primary border border-primary/20 px-2 py-0.5">
                                    [VIA: {community.platform}]
                                </span>
                                
                                <div className="flex gap-2">
                                    {auth.user ? (
                                        <button 
                                            onClick={() => router.post(`/communities/${community.id}/follow`, {}, { preserveScroll: true })}
                                            className={`p-2 border transition-all ${isFollowing ? 'border-primary bg-primary/20 text-primary' : 'border-border text-muted-foreground hover:border-primary hover:text-primary bg-card/50'}`} 
                                            title={isFollowing ? 'Unfollow' : 'Join Community'}
                                        >
                                            <UserPlus className="w-4 h-4" />
                                        </button>
                                    ) : null}
                                    <a 
                                        href={community.join_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-primary/10 transition-colors"
                                        title="External Link"
                                    >
                                        <Globe className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )})}
                </div>

                {communities.links && communities.links.length > 3 && (
                    <div className="mt-12 flex justify-center gap-2 font-mono">
                        {communities.links.map((link, k) => (
                             <Link
                                key={k}
                                href={link.url}
                                className={`px-4 py-2 border ${link.active ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                             />
                        ))}
                    </div>
                )}
            </div>
        </HackerLayout>
    );
}
