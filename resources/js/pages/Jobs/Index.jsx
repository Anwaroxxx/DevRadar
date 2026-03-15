import { Head, Link, usePage } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Code, DollarSign, Building, Plus, User } from 'lucide-react';

export default function JobsIndex({ jobs, filters }) {
    const { auth } = usePage().props;

    return (
        <HackerLayout>
            <Head title="Job Board" />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                    <h1 className="text-3xl font-black uppercase tracking-widest text-primary">&gt; PING_REQUESTS</h1>
                    {auth.user && (
                        <Link href="/jobs/create" className="bg-primary/20 text-primary border border-primary px-6 py-2 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                             <Plus className="w-4 h-4" /> SUBMIT_PING
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-card border border-primary/20 p-4 mb-8 font-mono text-sm flex gap-4 overflow-x-auto">
                    <div className="text-muted-foreground mr-2 border-r border-border pr-4 py-1">FILTER_OPS:</div>
                    <Link href="/jobs" className={`px-3 py-1 border ${!filters.type ? 'border-primary text-primary bg-primary/10' : 'border-transparent hover:border-primary/50'}`}>ALL</Link>
                    <Link href="/jobs?type=full-time" className={`px-3 py-1 border ${filters.type === 'full-time' ? 'border-primary text-primary bg-primary/10' : 'border-transparent hover:border-primary/50'}`}>FULL_TIME</Link>
                    <Link href="/jobs?type=internship" className={`px-3 py-1 border ${filters.type === 'internship' ? 'border-primary text-primary bg-primary/10' : 'border-transparent hover:border-primary/50'}`}>INTERNSHIPS</Link>
                    <Link href="/jobs?remote=1" className={`px-3 py-1 border ${filters.remote ? 'border-primary text-primary bg-primary/10' : 'border-transparent hover:border-primary/50'}`}>REMOTE_NODES</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.data.map((job, idx) => (
                        <motion.div 
                            key={job.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-card border-l-4 border-l-primary/30 border-y border-r border-border p-6 hover:border-l-primary hover:border-r-primary/50 hover:bg-primary/5 transition-all group relative h-full flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-bold group-hover:text-primary transition-colors underline decoration-transparent group-hover:decoration-primary">{job.title}</h2>
                                {job.is_remote && (
                                    <span className="text-xs border border-primary text-primary px-2 py-1 font-mono uppercase bg-primary/10">
                                        [REMOTE_OK]
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm mb-4 flex-wrap">
                                <Building className="w-4 h-4" /> {job.company}
                                <span className="opacity-50">///</span>
                                <MapPin className="w-4 h-4" /> {job.city}
                                <span className="opacity-50">///</span>
                                <Link href={`/profile/${job.user.username}`} className="text-primary/70 hover:text-primary flex items-center gap-1">
                                    <User className="w-4 h-4" /> @{job.user.username}
                                </Link>
                            </div>

                            <p className="text-sm font-mono text-muted-foreground mb-6 flex-1 line-clamp-2">
                                {job.description}
                            </p>

                            <div className="space-y-4 font-mono text-sm border-t border-border pt-4 mt-auto">
                                {job.tech_stack && (
                                    <div className="flex items-start gap-2">
                                        <Code className="w-4 h-4 mt-1" />
                                        <div className="flex flex-wrap gap-2">
                                            {job.tech_stack.map(tech => (
                                                <span key={tech} className="text-xs text-primary bg-primary/20 px-1 py-0.5">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {job.salary_range && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <DollarSign className="w-4 h-4" /> {job.salary_range}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-between items-center text-xs font-mono border-t border-border/50 pt-4">
                                <span className="text-muted-foreground opacity-50">
                                    POSTED: {new Date(job.created_at).toLocaleDateString()}
                                </span>
                                <a 
                                    href={job.apply_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-primary/10 text-primary border border-primary px-4 py-2 uppercase font-bold hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-shadow shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                >
                                    SEND_PACKET //
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {jobs.links && jobs.links.length > 3 && (
                    <div className="mt-12 flex justify-center gap-2 font-mono">
                        {jobs.links.map((link, k) => (
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
