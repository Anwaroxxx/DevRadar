import { useState, useEffect, useRef } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Terminal, Bot, Code, FileText, Send, Cpu, Zap, User } from 'lucide-react';

const QUICK_PROMPTS = [
    'How do I improve my Laravel API performance?',
    'Explain React hooks with examples',
    'Best tech communities to join in Morocco?',
    'How to prepare for a technical interview?',
    'Review this Python function for me',
    'What are the top tech skills in demand in Morocco?',
];

export default function AiChat() {
    const { auth, flash } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({ message: '' });
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: `Greetings, @${auth.user?.username || 'Developer'}. I am DevRadar AI — your Moroccan tech community assistant powered by Groq LLaMA 3.3. I can help with coding, career advice, tech events in Morocco, and more.\n\nHow may I assist you today?`,
        }
    ]);
    const bottomRef = useRef(null);

    // Append AI response when flash.info arrives
    useEffect(() => {
        if (flash?.info) {
            if (flash?.user_message) {
                setMessages(prev => {
                    const lastUserMsg = prev[prev.length - 1];
                    const alreadyAdded = lastUserMsg?.role === 'user' && lastUserMsg?.content === flash.user_message;
                    if (!alreadyAdded) {
                        return [...prev, { role: 'user', content: flash.user_message }, { role: 'ai', content: flash.info }];
                    }
                    return [...prev, { role: 'ai', content: flash.info }];
                });
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: flash.info }]);
            }
        }
        if (flash?.error) {
            setMessages(prev => [...prev, { role: 'error', content: flash.error }]);
        }
    }, [flash?.info, flash?.error]);

    // Auto scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, processing]);

    const submit = (e) => {
        e.preventDefault();
        if (processing || !data.message.trim()) return;

        const userMsg = data.message;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

        post('/ai/chat', {
            onSuccess: () => reset('message'),
            preserveScroll: true,
            preserveState: true,
        });
    };

    const useQuickPrompt = (prompt) => {
        setData('message', prompt);
    };

    return (
        <HackerLayout>
            <Head title="AI Shell — DevRadar" />

            <div className="max-w-5xl mx-auto px-4 py-6 h-[calc(100vh-120px)] flex flex-col gap-4">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-primary/30 pb-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 border border-primary bg-primary/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                            <Cpu className="w-6 h-6 text-primary animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">AI_Shell</h1>
                            <div className="text-xs font-mono text-muted-foreground mt-0.5">
                                Powered by <span className="text-primary">Groq LLaMA 3.3-70B</span> // Status: <span className="text-primary animate-pulse">ONLINE</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground border border-primary/20 px-3 py-1">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        {messages.length - 1} messages
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 overflow-hidden border border-primary/30 bg-card/30 flex flex-col relative">
                    {/* Scanline */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] z-[5] opacity-20" />

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 relative z-10">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                {/* Avatar */}
                                <div className={`w-8 h-8 border flex items-center justify-center shrink-0 ${
                                    msg.role === 'ai' ? 'border-primary bg-primary/20' :
                                    msg.role === 'error' ? 'border-red-500 bg-red-500/20' :
                                    'border-primary/40 bg-card'
                                }`}>
                                    {msg.role === 'ai' ? <Bot className="w-4 h-4 text-primary" /> :
                                     msg.role === 'error' ? <Terminal className="w-4 h-4 text-red-500" /> :
                                     <div className="text-xs font-black text-primary uppercase">{auth.user?.name?.charAt(0)}</div>}
                                </div>

                                {/* Bubble */}
                                <div className={`max-w-[80%] p-3 text-sm font-mono leading-relaxed whitespace-pre-wrap ${
                                    msg.role === 'ai' ? 'bg-black/40 border border-border text-foreground/90' :
                                    msg.role === 'error' ? 'bg-red-500/10 border border-red-500 text-red-400 font-bold' :
                                    'bg-primary/20 border border-primary text-primary/90 text-right'
                                }`}>
                                    {msg.role === 'error' ? `[SYS_ERROR] ${msg.content}` : msg.content}
                                </div>
                            </div>
                        ))}

                        {/* Processing indicator */}
                        {processing && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 border border-primary bg-primary/20 flex items-center justify-center shrink-0">
                                    <Bot className="w-4 h-4 text-primary" />
                                </div>
                                <div className="bg-black/40 border border-border p-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    <span className="text-xs text-muted-foreground ml-1 uppercase tracking-widest">PROCESSING_QUERY...</span>
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-primary/30 bg-black/60 shrink-0 z-10">
                        <form onSubmit={submit} className="flex gap-3">
                            <div className="flex-1 relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold text-sm">›</div>
                                <input
                                    type="text"
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    className="w-full bg-transparent border border-primary/40 text-foreground p-3 pl-7 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(34,197,94,0.15)] transition-all font-mono text-sm placeholder:text-muted-foreground/40"
                                    placeholder="Enter your query..."
                                    disabled={processing}
                                    autoFocus
                                />
                            </div>
                            <button type="submit" disabled={processing || !data.message.trim()}
                                className="bg-primary/20 text-primary border border-primary px-5 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm">
                                <Send className="w-4 h-4" /> EXEC
                            </button>
                        </form>

                        {/* Quick Prompts */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {QUICK_PROMPTS.slice(0, 3).map((prompt, i) => (
                                <button key={i} onClick={() => useQuickPrompt(prompt)}
                                    className="text-[10px] text-muted-foreground border border-border/50 px-2 py-1 hover:border-primary/50 hover:text-primary transition-all font-mono truncate max-w-[200px]">
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Nav */}
                <div className="flex justify-center gap-6 font-mono text-sm border-t border-border pt-3 shrink-0">
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
