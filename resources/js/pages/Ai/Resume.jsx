import { Head, useForm, usePage, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Terminal, FileText, Bot, AlertTriangle, Send, Code } from 'lucide-react';

export default function AiResume() {
    const { auth } = usePage().props;
    const { data, setData, post, processing } = useForm({
        name: auth.user?.name || '',
        target_role: '',
        skills: auth.user?.skills?.map(s => s.name).join(', ') || '',
        experience: '',
        education: '',
        type: 'cv',
    });

    const submit = (e) => {
        e.preventDefault();
        if (processing) return;
        post('/ai/resume', {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const flash = usePage().props.flash;

    return (
        <HackerLayout>
            <Head title="AI CV Compiler — DevRadar" />

            <div className="max-w-6xl mx-auto px-4 py-8">

                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                    <Terminal className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-black uppercase text-foreground m-0 leading-none">Logic_CV_Compiler</h1>
                        <div className="text-xs font-mono text-muted-foreground mt-1">
                            Status: <span className="text-primary animate-pulse">AWAITING_PARAMS</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono text-sm">
                    {/* Input */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-card border-2 border-primary/50 p-6 relative">
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary -translate-x-[2px] -translate-y-[2px]" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary translate-x-[2px] -translate-y-[2px]" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary -translate-x-[2px] translate-y-[2px]" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary translate-x-[2px] translate-y-[2px]" />

                            <h2 className="font-bold text-primary uppercase border-b border-primary/30 pb-2 mb-4 flex items-center gap-2">
                                <Terminal className="w-4 h-4" /> Input_Parameters
                            </h2>

                            <form onSubmit={submit} className="space-y-4">
                                {/* Output Type */}
                                <div>
                                    <label className="block text-xs uppercase text-muted-foreground mb-2">Output_Type</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: 'cv',        label: 'CV / Resume' },
                                            { value: 'linkedin',  label: 'LinkedIn' },
                                            { value: 'portfolio', label: 'Portfolio' },
                                        ].map(opt => (
                                            <button key={opt.value} type="button"
                                                onClick={() => setData('type', opt.value)}
                                                className={`py-2 text-xs border font-bold uppercase transition-all ${data.type === opt.value ? 'border-primary bg-primary/20 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase text-muted-foreground mb-1">Full_Name</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-black/50 border border-primary/30 p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-all"
                                        placeholder="Your full name" required disabled={processing} />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase text-muted-foreground mb-1">Target_Role</label>
                                    <input type="text" value={data.target_role} onChange={e => setData('target_role', e.target.value)}
                                        className="w-full bg-black/50 border border-primary/30 p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-all"
                                        placeholder="e.g. Senior Backend Developer" required disabled={processing} />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase text-muted-foreground mb-1">Skills (comma-separated)</label>
                                    <input type="text" value={data.skills} onChange={e => setData('skills', e.target.value)}
                                        className="w-full bg-black/50 border border-primary/30 p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-all"
                                        placeholder="Laravel, React, Docker, PostgreSQL..." disabled={processing} />
                                    {auth.user?.skills?.length > 0 && (
                                        <div className="text-[10px] text-muted-foreground mt-1">Auto-filled from your profile skills.</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs uppercase text-muted-foreground mb-1">Experience</label>
                                    <textarea rows="3" value={data.experience} onChange={e => setData('experience', e.target.value)}
                                        className="w-full bg-black/50 border border-primary/30 p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-all resize-none"
                                        placeholder="Briefly describe your work experience, projects, internships..."
                                        disabled={processing} />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase text-muted-foreground mb-1">Education</label>
                                    <input type="text" value={data.education} onChange={e => setData('education', e.target.value)}
                                        className="w-full bg-black/50 border border-primary/30 p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-all"
                                        placeholder="e.g. BSc Computer Science, Mohammed V University" disabled={processing} />
                                </div>

                                <div className="pt-2 border-t border-primary/30">
                                    <button type="submit" disabled={processing}
                                        className="w-full bg-primary/20 text-primary border border-primary px-6 py-4 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                                        <Send className="w-4 h-4" /> COMPILE_OUTPUT
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="bg-black/50 border border-border p-4 text-xs text-muted-foreground border-l-2 border-l-primary leading-relaxed">
                            <span className="text-primary font-bold">&gt; INSTRUCTION:</span>&nbsp;
                            Fill in your details above. The AI will generate professional {data.type === 'cv' ? 'CV content' : data.type === 'linkedin' ? 'LinkedIn profile text' : 'portfolio bio'} optimized for Moroccan and international tech companies.
                        </div>
                    </div>

                    {/* Output */}
                    <div className="lg:col-span-7">
                        <div className="bg-card border-2 border-primary/50 flex flex-col relative h-[700px] overflow-hidden">
                            <div className="p-3 border-b border-primary/30 flex justify-between items-center bg-black/50 relative z-20">
                                <span className="font-bold text-primary uppercase flex items-center gap-2">
                                    <Code className="w-4 h-4" /> Output_Buffer
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="text-xs text-muted-foreground border border-border px-2">{data.type.toUpperCase()}</div>
                                    {flash?.info && (
                                        <button onClick={() => navigator.clipboard.writeText(flash.info)}
                                            className="text-[10px] text-primary border border-primary/30 px-2 py-0.5 hover:bg-primary/10 transition-all">
                                            COPY
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-[#050505] relative leading-relaxed">
                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-[0.15] z-0" />

                                <div className="relative z-10">
                                    {processing ? (
                                        <div className="flex flex-col items-center justify-center h-full text-primary gap-6 font-mono py-20">
                                            <Bot className="w-16 h-16 animate-pulse" />
                                            <div className="text-sm uppercase tracking-widest bg-primary/20 border border-primary px-6 py-2">
                                                Compiling_Matrix...
                                            </div>
                                            <div className="text-xs text-primary/60">Generating {data.type} for {data.name}...</div>
                                        </div>
                                    ) : flash?.info ? (
                                        <div className="text-foreground/90 whitespace-pre-wrap text-sm leading-relaxed">
                                            {flash.info}
                                        </div>
                                    ) : flash?.error ? (
                                        <div className="flex flex-col items-center justify-center h-full text-red-500 gap-6 font-mono py-20">
                                            <AlertTriangle className="w-16 h-16" />
                                            <div className="text-sm uppercase tracking-widest text-center border border-red-500 bg-black/50 p-4">
                                                {flash.error}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30 gap-4 font-mono py-20">
                                            <FileText className="w-16 h-16" />
                                            <div className="text-sm uppercase tracking-widest text-center border border-muted-foreground/20 p-4">
                                                Buffer Empty<br /><br />
                                                Fill in your details and click COMPILE_OUTPUT
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Tools Nav */}
                <div className="mt-8 flex justify-center gap-6 font-mono text-sm border-t border-border pt-4 shrink-0">
                    {[
                        { href: '/ai/chat', label: 'AI_Chat', icon: Bot },
                        { href: '/ai/code-review', label: 'Code_Review', icon: Code },
                        { href: '/ai/resume', label: 'Logic_CV', icon: FileText },
                    ].map(({ href, label, icon: Icon }) => {
                        const active = usePage().url.startsWith(href);
                        return (
                            <Link key={href} href={href} className={`flex items-center gap-2 pb-1 transition-colors ${active ? 'text-primary border-b border-primary' : 'text-muted-foreground hover:text-primary'}`}>
                                <Icon className="w-4 h-4" /> {label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </HackerLayout>
    );
}
