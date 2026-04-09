import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Briefcase, Search, Trash2, ToggleLeft, ToggleRight, User, MapPin, ExternalLink } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminJobs({ jobs, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
    const deleteForm = useForm({});

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/jobs', { search, status: filters.status }, { preserveState: true });
    };

    const handleToggle = (jobId) => {
        router.post(`/admin/jobs/${jobId}/toggle`);
    };

    const handleDelete = (jobId) => {
        setConfirmDelete({ open: true, id: jobId });
    };

    const performDelete = () => {
        if (!confirmDelete.id) return;
        deleteForm.delete(`/admin/content/job/${confirmDelete.id}`, {
            onSuccess: () => setConfirmDelete({ open: false, id: null })
        });
    };

    const typeColors = {
        'full-time':  'text-primary border-primary/30 bg-primary/10',
        'internship': 'text-blue-400 border-blue-400/30 bg-blue-400/10',
        'freelance':  'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    };

    return (
        <HackerLayout>
            <Head title="Admin — Jobs" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                <div className="flex items-center justify-between border-b border-primary/30 pb-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-mono text-xs">← ADMIN</Link>
                        <span className="text-border">/</span>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-primary" /> Job Management
                        </h1>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">{jobs.total} total jobs</div>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search jobs or companies..."
                                className="w-full bg-card border border-primary/30 pl-9 pr-4 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-all" />
                        </div>
                        <button type="submit" className="bg-primary/20 text-primary border border-primary px-4 py-2 text-xs font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all">SEARCH</button>
                    </form>
                    <div className="flex gap-2">
                        {[['', 'ALL'], ['active', 'ACTIVE'], ['inactive', 'INACTIVE']].map(([val, label]) => (
                            <Link key={val} href={`/admin/jobs?${val ? `status=${val}` : ''}`}
                                className={`px-3 py-2 text-xs font-mono border uppercase ${filters.status === val || (!filters.status && !val) ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Jobs Table */}
                <div className="border border-primary/30 overflow-hidden">
                    <table className="w-full text-sm font-mono">
                        <thead>
                            <tr className="border-b border-primary/30 bg-primary/5">
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Job</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Company</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Type</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Posted By</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Status</th>
                                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {jobs.data.map(job => (
                                <motion.tr key={job.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-primary/5 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-bold">{job.title}</div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="w-3 h-3" /> {job.city} {job.is_remote && '(Remote)'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{job.company}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase ${typeColors[job.type] || 'border-border text-muted-foreground'}`}>
                                            {job.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={`/profile/${job.user?.username}`} className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                                            <User className="w-3 h-3" /> @{job.user?.username}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase ${job.is_active ? 'border-primary text-primary bg-primary/10' : 'border-red-400/30 text-red-400 bg-red-400/10'}`}>
                                            {job.is_active ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleToggle(job.id)} title={job.is_active ? 'Deactivate' : 'Activate'}
                                                className={`p-1 transition-colors ${job.is_active ? 'text-primary hover:text-yellow-400' : 'text-muted-foreground hover:text-primary'}`}>
                                                {job.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                                            </button>
                                            <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary p-1 transition-colors" title="View apply link">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button onClick={() => handleDelete(job.id)} className="text-muted-foreground hover:text-red-400 p-1 transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {jobs.links && jobs.links.length > 3 && (
                    <div className="flex justify-center gap-2 font-mono">
                        {jobs.links.map((link, k) => (
                            <Link key={k} href={link.url || '#'}
                                className={`px-3 py-1 text-xs border ${link.active ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
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
                title="Wipe Job Listing"
                description="This action will permanently remove this job from the index. Recruiters and candidates will no longer be able to track this signal."
                confirmText="Delete Job"
                variant="destructive"
            />
        </HackerLayout>
    );
}
