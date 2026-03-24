import { Head, useForm, usePage, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Terminal, Code, Bot, AlertTriangle, Send, FileText } from 'lucide-react';

export default function AiCodeReview() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        code: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (processing || !data.code.trim()) return;
        
        post('/ai/code-review', {
            onSuccess: () => reset('code'),
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <HackerLayout>
            <Head title="AI Code Auditor" />
            
            <div className="max-w-5xl mx-auto px-4 py-8">
                
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                    <Terminal className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-black uppercase text-foreground m-0 leading-none">Code_Auditor</h1>
                        <div className="text-xs font-mono text-muted-foreground mt-1">Status: <span className="text-primary animate-pulse">AWAITING_INPUT</span> // SUBSCRIPTION: <span className="text-primary font-bold">ACTIVE</span></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Area */}
                    <div className="bg-card border-2 border-primary/50 flex flex-col relative font-mono text-sm h-[600px]">
                        <div className="p-3 border-b border-primary/30 flex justify-between items-center bg-black/50">
                            <span className="font-bold text-primary uppercase">Raw_Input_Buffer</span>
                            <div className="flex gap-1">
                                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            </div>
                        </div>
                        <form onSubmit={submit} className="flex flex-col flex-1">
                            <textarea
                                value={data.code}
                                onChange={e => setData('code', e.target.value)}
                                className="flex-1 w-full bg-transparent border-0 text-foreground p-4 focus:outline-none focus:ring-0 resize-none font-mono text-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                                placeholder="// Paste your code here for AI analysis..."
                                disabled={processing}
                                spellCheck={false}
                                autoFocus
                            ></textarea>
                            <div className="p-4 border-t border-primary/30 bg-black/80">
                                <button
                                    type="submit"
                                    disabled={processing || !data.code.trim()}
                                    className="w-full bg-primary/20 text-primary border border-primary px-6 py-3 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" /> INITIATE_SCAN
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Output Area */}
                    <div className="bg-card border-2 border-primary/50 flex flex-col relative font-mono h-[600px] overflow-hidden">
                        <div className="p-3 border-b border-primary/30 flex items-center gap-2 bg-black/50">
                            <Bot className="w-4 h-4 text-primary" />
                            <span className="font-bold text-primary uppercase text-sm">Analysis_Output</span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 bg-black/30 relative">
                            {/* Scanline */}
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20"></div>

                            {processing ? (
                                <div className="flex flex-col items-center justify-center h-full text-primary gap-4">
                                    <Bot className="w-12 h-12 animate-bounce" />
                                    <div className="text-sm uppercase tracking-widest animate-pulse border border-primary px-4 py-1">Analyzing_Syntax...</div>
                                </div>
                            ) : usePage().props.flash?.info ? (
                                <div className="text-foreground/90 text-sm whitespace-pre-wrap leading-relaxed relative z-10">
                                    {usePage().props.flash.info}
                                </div>
                            ) : usePage().props.flash?.error ? (
                                <div className="flex flex-col items-center justify-center h-full text-red-500 gap-4 relative z-10">
                                    <AlertTriangle className="w-12 h-12" />
                                    <div className="text-sm uppercase tracking-widest text-center border border-red-500 bg-black/50 p-4">
                                        System Error<br/><br/>
                                        {usePage().props.flash.error}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50 gap-2 relative z-10">
                                    <Code className="w-12 h-12" />
                                    <div className="text-xs uppercase tracking-widest text-center">
                                        Awaiting Code Input<br/>
                                        Standby Mode...
                                    </div>
                                </div>
                            )}
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
