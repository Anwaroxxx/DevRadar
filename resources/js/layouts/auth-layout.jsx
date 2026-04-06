import { Link } from '@inertiajs/react';
import { Terminal } from 'lucide-react';
import AsciiWaterfall from '@/components/AsciiWaterfall';

export default function AuthLayout({
    children,
    title,
    description,
}) {
    return (
        <div className="min-h-screen bg-[#050505] text-foreground font-sans selection:bg-primary selection:text-primary-foreground relative flex items-center justify-center p-4 overflow-hidden">
            <AsciiWaterfall />
            
            <div className="absolute inset-0 scanline pointer-events-none opacity-[0.05]">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20 animate-scan" />
            </div>

            <div className="w-full max-w-md relative z-10 crt-flicker space-y-8">
                <div className="flex flex-col items-center gap-4 mb-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Terminal className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-black tracking-tighter uppercase">DEV<span className="text-primary">RADAR</span>_</span>
                    </Link>
                    <div className="text-center">
                        <h1 className="text-xl font-black uppercase text-primary tracking-widest leading-none drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">{title}</h1>
                        <p className="font-mono text-[10px] text-muted-foreground mt-2 uppercase tracking-tighter opacity-80">{description}</p>
                    </div>
                </div>

                <div className="bg-card/80 backdrop-blur-xl border-2 border-primary/30 p-8 shadow-[0_0_50px_rgba(34,197,94,0.1)] relative">
                    {/* HUD Corners */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                    
                    {children}
                </div>
                
                <div className="text-center opacity-40 font-mono text-[9px] uppercase tracking-[0.3em]">
                    SECURE_NODE_ACCESS_PROTOCOL_V.1
                </div>
            </div>
        </div>
    );
}
