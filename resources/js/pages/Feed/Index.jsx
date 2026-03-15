import { Head, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Activity, Radio, Network, GitPullRequest, Bookmark, Hash } from 'lucide-react';

export default function FeedIndex({ recentEvents, recentJobs, recentCommunities, trendingTags }) {
    // Combine logs into a single feed and sort by date descending
    const feed = [
        ...recentEvents.map(e => ({ type: 'event', data: e, date: new Date(e.created_at) })),
        ...recentJobs.map(j => ({ type: 'job', data: j, date: new Date(j.created_at) })),
        ...recentCommunities.map(c => ({ type: 'community', data: c, date: new Date(c.created_at) }))
    ].sort((a, b) => b.date - a.date);

    return (
        <HackerLayout>
            <Head title="System Feed" />
            
            <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                
                {/* Main Action Log */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                        <h1 className="text-3xl font-black uppercase tracking-widest text-primary flex items-center gap-3">
                            <Activity className="w-8 h-8" /> > SYSTEM_LOGS
                        </h1>
                    </div>

                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/50 before:to-transparent">
                        
                        {feed.map((item, idx) => (
                            <motion.div 
                                key={`${item.type}-${item.data.id}`}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                            >
                                {/* Timeline Node */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(34,197,94,0.3)] z-10 transition-transform group-hover:scale-110">
                                    {item.type === 'event' && <Radio className="w-5 h-5 text-primary" />}
                                    {item.type === 'job' && <GitPullRequest className="w-5 h-5 text-primary" />}
                                    {item.type === 'community' && <Network className="w-5 h-5 text-primary" />}
                                </div>
                                
                                {/* Content Card */}
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border p-4 hover:border-primary transition-colors shadow-sm">
                                    <div className="flex items-center justify-between font-mono text-xs mb-2">
                                        <time className="text-muted-foreground">{item.date.toLocaleString()}</time>
                                        <span className="text-primary px-2 py-0.5 border border-primary/30 uppercase bg-primary/10">
                                            {item.type.toUpperCase()}_INIT
                                        </span>
                                    </div>
                                    
                                    <div className="text-sm font-mono text-muted-foreground mb-1">
                                        User <Link href={`/profile/${item.data.user?.username}`} className="text-primary hover:underline">@{item.data.user?.username}</Link> deployed:
                                    </div>
                                    
                                    {item.type === 'event' && (
                                        <div>
                                            <Link href={`/events/${item.data.id}`} className="text-lg font-bold hover:text-primary transition-colors block mb-1">
                                                {item.data.title}
                                            </Link>
                                            <div className="text-xs text-muted-foreground line-clamp-2">{item.data.description}</div>
                                        </div>
                                    )}

                                    {item.type === 'job' && (
                                        <div>
                                            <a href={item.data.apply_link} target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:text-primary transition-colors block mb-1">
                                                {item.data.title} @ {item.data.company}
                                            </a>
                                            <div className="text-xs text-muted-foreground line-clamp-2">{item.data.description}</div>
                                        </div>
                                    )}

                                    {item.type === 'community' && (
                                        <div>
                                            <Link href={`/communities`} className="text-lg font-bold hover:text-primary transition-colors block mb-1">
                                                {item.data.name}
                                            </Link>
                                            <div className="text-xs text-primary mb-1 pl-2 border-l border-primary">Platform: {item.data.platform}</div>
                                            <div className="text-xs text-muted-foreground line-clamp-2">{item.data.description}</div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-64 shrink-0 space-y-8">
                    {/* Trending Tech Tags */}
                    <div className="bg-card border border-primary/30 p-4">
                        <h3 className="font-bold border-b border-border pb-2 mb-4 uppercase text-sm flex items-center gap-2">
                            <Hash className="w-4 h-4 text-primary" /> Trending_Args
                        </h3>
                        <div className="flex flex-wrap gap-2 font-mono text-xs">
                            {trendingTags.map((tag, i) => (
                                <Link key={i} href={`/events?tag=${tag.name}`} className="flex items-center gap-1 border border-border px-2 py-1 hover:border-primary transition-colors">
                                    <span>{tag.name}</span>
                                    <span className="text-primary">[{tag.events_count}]</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats Scanner */}
                    <div className="bg-card border border-primary/30 p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-primary/20 blur-xl"></div>
                        <h3 className="font-bold border-b border-border pb-2 mb-4 uppercase text-sm">System_Health</h3>
                        <ul className="space-y-2 text-xs font-mono text-muted-foreground">
                            <li className="flex justify-between"><span>Status:</span> <span className="text-primary animate-pulse">OPTIMAL</span></li>
                            <li className="flex justify-between"><span>Latency:</span> <span>12ms</span></li>
                            <li className="flex justify-between"><span>Active Nodes:</span> <span>{(Math.random() * 1000).toFixed(0)}</span></li>
                            <li className="flex justify-between"><span>Security:</span> <span className="text-primary">SECURE</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </HackerLayout>
    );
}
