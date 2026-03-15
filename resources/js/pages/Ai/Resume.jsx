import { Head, useForm, usePage, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Terminal, FileText, Bot, AlertTriangle, Send, Code } from 'lucide-react';

export default function AiResume() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        skills: auth.user.skills?.map(s => s.name).join(', ') || '',
        experience: '2 years backend development, 1 year freelance',
        target_role: 'Full Stack Engineer'
    });

    const submit = (e) => {
        e.preventDefault();
        if (processing) return;

        post('/ai/resume', {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <HackerLayout>
            <Head title="AI Logic CV Compiler" />
            
            <div className="max-w-6xl mx-auto px-4 py-8">
                
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                    <Terminal className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-black uppercase text-foreground m-0 leading-none">Logic_CV_Compiler</h1>
                        <div className="text-xs font-mono text-muted-foreground mt-1">Status: <span className="text-primary animate-pulse">AWAITING_PRMS</span> // SUBSCRIPTION: <span className="text-primary font-bold">ACTIVE</span></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono text-sm">
                    {/* Input Area */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-card border-2 border-primary/50 p-6 relative">
                            {/* Decorative Hacker Elements */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary -translate-x-[2px] -translate-y-[2px]"></div>
                            
                            <h2 className="font-bold text-primary uppercase border-b border-primary/30 pb-2 mb-4 flex items-center gap-2">
                                <Terminal className="w-4 h-4" /> Input_Parameters
                            </h2>
                            
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase text-muted-foreground mb-1">Target_Process_Role</label>
                                    <input
                                        type="text"
                                        value={data.target_role}
                                        onChange={e => setData('target_role', e.target.value)}
                                        className="w-full bg-black/50 border border-primary/30 p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-all"
                                        placeholder="e.g. Senior Backend Dev"
                                        required
                                        disabled={processing}
                                        autoFocus
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs uppercase text-muted-foreground mb-1">Loaded_Modules (Skills)</label>
                                    <input
                                        type="text"
                                        value={data.skills}
                                        onChange={e => setData('skills', e.target.value)}
                                        className="w-full bg-black/50 border border-primary/30 p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-all"
                                        placeholder="Laravel, React, PostgreSQL..."
                                        disabled={processing}
                                    />
                                    <div className="text-[10px] text-muted-foreground mt-1 opacity-70">Auto-filled from user profile matrices.</div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase text-muted-foreground mb-1">Execution_History (Experience)</label>
                                    <textarea
                                        rows="4"
                                        value={data.experience}
                                        onChange={e => setData('experience', e.target.value)}
                                        className="w-full bg-black/50 border border-primary/30 p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-all resize-none"
                                        placeholder="Briefly list past projects or jobs..."
                                        disabled={processing}
                                    ></textarea>
                                </div>

                                <div className="pt-4 border-t border-primary/30">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-primary/20 text-primary border border-primary px-6 py-4 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                                    >
                                        <Send className="w-4 h-4" /> COMPILE_CV_DATA
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        <div className="bg-black/50 border border-border p-4 text-xs text-muted-foreground opacity-80 border-l-2 border-l-primary leading-relaxed">
                            <span className="text-primary font-bold">&gt; INSTRUCTION:</span> 
                            Specify your target operational role and current module list. The AI will cross-reference market requirements and output an optimized markdown CV matrix.
                        </div>
                    </div>

                    {/* Output Area */}
                    <div className="lg:col-span-7">
                        <div className="bg-card border-2 border-primary/50 flex flex-col relative h-[800px] overflow-hidden">
                            <div className="p-3 border-b border-primary/30 flex justify-between items-center bg-black/50 shadow-md relative z-20">
                                <span className="font-bold text-primary uppercase flex items-center gap-2">
                                    <Code className="w-4 h-4" /> CV_Output_Buffer
                                </span>
                                <div className="text-xs text-muted-foreground border border-border px-2">MARKDOWN</div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 bg-[#050505] relative leading-relaxed whitespace-pre-wrap selection:bg-primary selection:text-primary-foreground">
                                {/* Scanline */}
                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-[0.15] z-0"></div>

                                <div className="relative z-10 font-sans text-base">
                                    {processing ? (
                                        <div className="flex flex-col items-center justify-center h-full text-primary gap-6 font-mono py-20">
                                            <div className="relative">
                                                <Bot className="w-16 h-16 animate-pulse" />
                                                <div className="absolute top-0 left-0 w-full h-full border-2 border-primary rounded-full animate-ping opacity-20"></div>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <div className="text-sm uppercase tracking-widest bg-primary/20 border border-primary px-6 py-2">
                                                    Compiling_Matrix...
                                                </div>
                                                <div className="text-xs mt-2 text-primary/60 font-mono">Simulating human syntax patterns</div>
                                            </div>
                                        </div>
                                    ) : usePage().props.flash?.info ? (
                                        <div 
                                            className="text-foreground/90 markdown-body prose prose-invert prose-p:text-foreground/90 prose-headings:text-primary prose-a:text-primary prose-strong:text-primary max-w-none font-mono"
                                            dangerouslySetInnerHTML={{__html: usePage().props.flash.info}}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30 gap-4 font-mono py-20">
                                            <FileText className="w-16 h-16" />
                                            <div className="text-sm uppercase tracking-widest text-center border border-muted-foreground/30 p-4">
                                                Buffer Empty<br/><br/>
                                                Awaiting execution parameters...
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* AI Tools Nav */}
                <div className="mt-8 flex justify-center gap-6 font-mono text-sm border-t border-border pt-4 shrink-0 overflow-x-auto pb-2">
                    <Link href="/ai/chat" className={`flex items-center gap-2 pb-1 transition-colors ${usePage().url === '/ai/chat' ? 'text-primary border-b border-primary' : 'text-muted-foreground hover:text-primary'}`}>
                        <Bot className="w-4 h-4" /> AI_Chat
                    </Link>
                    <Link href="/ai/code-review" className={`flex items-center gap-2 pb-1 transition-colors ${usePage().url === '/ai/code-review' ? 'text-primary border-b border-primary' : 'text-muted-foreground hover:text-primary'}`}>
                        <Code className="w-4 h-4" /> Code_Review
                    </Link>
                    <Link href="/ai/resume" className={`flex items-center gap-2 pb-1 transition-colors ${usePage().url === '/ai/resume' ? 'text-primary border-b border-primary' : 'text-muted-foreground hover:text-primary'}`}>
                        <FileText className="w-4 h-4" /> Logic_CV
                    </Link>
                </div>

            </div>
        </HackerLayout>
    );
}
