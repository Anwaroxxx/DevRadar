import React from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Terminal, Code, Bot, AlertTriangle, Send, FileText, Cpu, Zap, ShieldCheck } from 'lucide-react';

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript / Node.js' },
    { value: 'php',        label: 'PHP / Laravel' },
    { value: 'python',     label: 'Python' },
    { value: 'java',       label: 'Java' },
    { value: 'go',         label: 'Go' },
    { value: 'rust',       label: 'Rust' },
    { value: 'sql',        label: 'SQL' },
    { value: 'other',      label: 'Other / Text' },
];

const AuditReport = ({ content }) => {
    const [displayedContent, setDisplayedContent] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(true);

    React.useEffect(() => {
        setDisplayedContent('');
        setIsTyping(true);
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedContent(content.slice(0, i));
            i += 5; // Faster typing for reports
            if (i > content.length) {
                setDisplayedContent(content);
                setIsTyping(false);
                clearInterval(interval);
            }
        }, 10);
        return () => clearInterval(interval);
    }, [content]);

    return (
        <div className="relative">
            {isTyping && (
                <div className="flex items-center gap-2 mb-4 text-[10px] text-primary/60 animate-pulse font-black uppercase tracking-widest border-b border-primary/20 pb-2">
                    <Zap className="w-3 h-3" /> Streaming_Neural_Analysis...
                </div>
            )}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-foreground/90 text-sm whitespace-pre-wrap selection:bg-primary/30 leading-relaxed font-mono"
            >
                {displayedContent}
                {isTyping && <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />}
            </motion.div>
        </div>
    );
};

export default function AiCodeReview() {
    const { auth, flash } = usePage().props;
    const { data, setData, post, processing } = useForm({
        code: '',
        language: 'javascript',
    });

    const submit = (e) => {
        e.preventDefault();
        if (processing || !data.code.trim()) return;
        
        post('/ai/code-review', {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <HackerLayout>
            <Head title="AI Code Auditor — DevRadar" />
            
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-mono">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-primary/30 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 border-2 border-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Code_Security_Audit</h1>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                SCANNER_STATUS: <span className="text-primary">OPTIMIZED</span> // MODE: HEURISTIC_ANALYSIS
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Input Panel */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        <div className="bg-card border-2 border-primary/50 relative overflow-hidden h-[600px] flex flex-col">
                            {/* Decorative corners */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary" />
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary" />
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary" />

                            <div className="p-3 border-b border-primary/30 flex justify-between items-center bg-black/50 z-10">
                                <span className="font-bold text-primary uppercase text-xs flex items-center gap-2">
                                    <Terminal className="w-4 h-4" /> Input_Buffer
                                </span>
                                <select 
                                    value={data.language} 
                                    onChange={e => setData('language', e.target.value)}
                                    className="bg-black border border-primary/30 text-[10px] text-primary focus:outline-none focus:border-primary p-1 uppercase"
                                >
                                    {LANGUAGES.map(lang => (
                                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                                    ))}
                                </select>
                            </div>

                            <form onSubmit={submit} className="flex-1 flex flex-col relative z-0">
                                <textarea
                                    value={data.code}
                                    onChange={e => setData('code', e.target.value)}
                                    className="flex-1 w-full bg-[#050505] border-0 text-foreground p-6 focus:outline-none focus:ring-0 resize-none font-mono text-sm placeholder:text-muted-foreground/20 leading-relaxed"
                                    placeholder="// Paste your code here to begin high-fidelity AI audit...
// Supporting clean code principles, security vulnerabilities, 
// and logic optimization."
                                    disabled={processing}
                                    spellCheck={false}
                                />
                                
                                <div className="p-4 border-t border-primary/30 bg-black/80 flex flex-col gap-3">
                                    <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase">
                                        <span>LOC: {data.code.split('\n').length}</span>
                                        <span>CHARS: {data.code.length}</span>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing || !data.code.trim()}
                                        className="w-full bg-primary/20 text-primary border border-primary px-6 py-4 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-primary/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
                                        <Cpu className={`w-5 h-5 ${processing ? 'animate-spin' : ''}`} /> 
                                        {processing ? 'AUDITING...' : 'RUN_AUDIT_SEQUENCE'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="border border-border/50 bg-primary/5 p-4 text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                            <span className="text-primary font-bold mr-2">&gt; SYS_ADVISORY:</span>
                            The AI auditor performs deep static analysis to detect memory leaks, 
                            redundant logic, and architectural flaws specific to the chosen language.
                        </div>
                    </div>

                    {/* Output Panel */}
                    <div className="lg:col-span-7">
                        <div className="bg-card border-2 border-primary/50 relative overflow-hidden h-full min-h-[600px] flex flex-col">
                            <div className="p-3 border-b border-primary/30 flex items-center gap-3 bg-black/50">
                                <Bot className="w-5 h-5 text-primary" />
                                <span className="font-bold text-primary uppercase text-xs">Heuristic_Audit_Report</span>
                                <div className="ml-auto flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-75" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-150" />
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-8 bg-[#050505] relative">
                                {/* Scanline effect */}
                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-10 z-[5]" />

                                <div className="relative z-10 leading-relaxed">
                                    {processing ? (
                                        <div className="flex flex-col items-center justify-center h-full py-20 text-primary gap-6">
                                            <Zap className="w-12 h-12 animate-pulse text-primary/60" />
                                            <div className="text-sm uppercase tracking-[0.2em] border border-primary px-8 py-3 bg-primary/10 relative">
                                                <div className="absolute inset-0 border-primary animate-ping opacity-20" />
                                                Decompiling_Matrix...
                                            </div>
                                            <div className="text-[10px] text-primary/40 animate-pulse uppercase tracking-[0.2em]">Running {data.language.toUpperCase()} syntax tree validation</div>
                                        </div>
                                    ) : flash?.info ? (
                                        <AuditReport content={flash.info} />
                                    ) : flash?.error ? (
                                        <div className="flex flex-col items-center justify-center h-full py-20 text-red-500 gap-6">
                                            <AlertTriangle className="w-16 h-16" />
                                            <div className="text-xs font-bold uppercase tracking-widest text-center border border-red-500 bg-black/50 p-6 leading-loose max-w-md">
                                                [AUDIT_FAILED]<br/><br/>
                                                {flash.error}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full py-32 text-muted-foreground/20 gap-4">
                                            <Code className="w-20 h-20" />
                                            <div className="text-xs uppercase tracking-[0.3em] font-black text-center border border-muted-foreground/10 p-4">
                                                Audit Buffer Empty<br/>
                                                Standby for Scan Signal
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer stats if info present */}
                            {flash?.info && (
                                <div className="p-3 border-t border-primary/30 bg-black/50 text-[9px] text-muted-foreground flex justify-between uppercase tracking-widest font-bold">
                                    <span>Audit_Complete</span>
                                    <span>Sec_Score: High</span>
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(flash.info)}
                                        className="text-primary hover:underline"
                                    >
                                        [COPY_REPORT]
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Tools Navigation */}
                <div className="flex flex-wrap justify-center gap-10 font-mono text-sm border-t border-border/30 pt-8 mt-12 pb-4">
                    {[
                        { href: '/ai/chat', label: 'AI_Shell', icon: Bot },
                        { href: '/ai/code-review', label: 'Audit_Sequence', icon: Code },
                        { href: '/ai/resume', label: 'Logic_CV', icon: FileText },
                    ].map(({ href, label, icon: Icon }) => {
                        const active = usePage().url.startsWith(href);
                        return (
                            <Link 
                                key={href} 
                                href={href} 
                                className={`flex items-center gap-3 pb-2 transition-all relative group ${active ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                            >
                                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                                <span className="tracking-widest font-black uppercase text-xs">{label}</span>
                                {active && <motion.div layoutId="ai-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_#22c55e]" />}
                            </Link>
                        );
                    })}
                </div>

            </div>
        </HackerLayout>
    );
}
