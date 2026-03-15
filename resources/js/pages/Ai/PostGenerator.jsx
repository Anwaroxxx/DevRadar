import { Head, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Terminal, Send, Bot } from 'lucide-react';

export default function PostGenerator() {
    return (
        <HackerLayout>
            <Head title="AI Post Generator" />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                    <Terminal className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-black uppercase text-foreground m-0 leading-none">Post_Generator</h1>
                        <div className="text-xs font-mono text-muted-foreground mt-1 text-primary animate-pulse">UNDER_CONSTRUCTION // AWAITING_CORE_SYNC</div>
                    </div>
                </div>

                <div className="bg-card border-2 border-primary/50 p-12 text-center font-mono relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none digital-noise opacity-10"></div>
                    <Bot className="w-16 h-16 text-primary mx-auto mb-6 opacity-50" />
                    <h2 className="text-2xl font-bold text-primary mb-4 uppercase tracking-tighter">System_Maintenance</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        The AI Post Generator module is currently undergoing logic restructuring. Please use the AI Shell Chat in the interim.
                    </p>
                    <Link href="/ai/chat" className="inline-block bg-primary/20 text-primary border border-primary px-8 py-3 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all">
                        Initialize_Alt_Terminal
                    </Link>
                </div>
            </div>
        </HackerLayout>
    );
}
