import { Head, useForm, usePage, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Terminal, Bot, Code, FileText, Send } from 'lucide-react';

export default function AiChat() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (processing || !data.message.trim()) return;
        
        post('/ai/chat', {
            onSuccess: () => reset('message'),
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <HackerLayout>
            <Head title="AI Shell Chat" />
            
            <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-140px)] flex flex-col">
                
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4 shrink-0">
                    <Terminal className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-black uppercase text-foreground m-0 leading-none">AI_Shell</h1>
                        <div className="text-xs font-mono text-muted-foreground mt-1">Status: <span className="text-primary animate-pulse">ONLINE & LISTENING</span></div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden border border-primary/30 bg-card/50 flex flex-col relative font-mono text-sm">
                    {/* Scanline effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-[400] opacity-30"></div>

                    {/* Chat Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
                        {/* System Greeting */}
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 border border-primary bg-primary/20 flex items-center justify-center shrink-0">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div className="bg-black/50 border border-border p-3 rounded-none max-w-[80%] text-foreground/90">
                                Greetings, Node @{auth.user.username}. I am the Groq-powered logical unit. How may I assist your operations today?
                                <br/><br/>
                                <span className="text-xs text-muted-foreground border-t border-border/50 block pt-2 mt-2 italic">
                                    [SYS_MSG] Every prompt execution is powered by your active subscription. Current XP: {auth.user.xp}
                                </span>
                            </div>
                        </div>

                        {/* Recent Response (if any) */}
                        {usePage().props.flash?.info && (
                            <>
                                <div className="flex items-start gap-4 flex-row-reverse">
                                    <div className="w-8 h-8 border border-primary bg-card flex items-center justify-center shrink-0">
                                        <div className="text-primary font-bold text-xs">{auth.user.name.charAt(0)}</div>
                                    </div>
                                    <div className="bg-primary/20 border border-primary p-3 rounded-none max-w-[80%] text-primary/90 text-right">
                                        [PREVIOUS_INPUT_PROCESSED]
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 border border-primary bg-primary/20 flex items-center justify-center shrink-0">
                                        <Bot className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="bg-black/50 border border-border p-3 rounded-none max-w-[80%] text-foreground/90 whitespace-pre-wrap">
                                        {usePage().props.flash.info}
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {/* Loading State */}
                        {processing && (
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 border border-primary bg-primary/20 flex items-center justify-center shrink-0">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                                <div className="bg-black/50 border border-border p-3 rounded-none max-w-[80%] text-primary/80 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary animate-bounce"></span>
                                    <span className="w-2 h-2 bg-primary animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-primary animate-bounce delay-150"></span>
                                    <span className="ml-2 uppercase tracking-widest text-xs">PROCESSING_QUERY</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-primary/30 bg-black/80 relative z-10 shrink-0">
                        <form onSubmit={submit} className="flex gap-4">
                            <div className="flex-1 relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold">&gt;</div>
                                <input
                                    type="text"
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    className="w-full bg-transparent border border-primary/50 text-foreground p-3 pl-8 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-[inset_0_0_10px_rgba(34,197,94,0.1)] transition-all"
                                    placeholder="Input logical query..."
                                    disabled={processing}
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing || !data.message.trim()}
                                className="bg-primary/20 text-primary border border-primary px-6 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" /> EXEC
                            </button>
                        </form>
                    </div>
                </div>
                
                {/* AI Tools Nav */}
                <div className="mt-6 flex justify-center gap-6 font-mono text-sm border-t border-border pt-4 shrink-0 overflow-x-auto pb-2">
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
