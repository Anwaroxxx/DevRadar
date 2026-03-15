import { Link } from '@inertiajs/react';
import { Terminal } from 'lucide-react';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background text-foreground font-sans p-6 md:p-10 relative overflow-hidden">
            {/* Hacker Background Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:20px_20px] z-0"></div>
            
            <div className="w-full max-w-md relative z-10">
                <div className="border-2 border-primary/50 bg-card/80 p-8 shadow-[0_0_20px_rgba(34,197,94,0.1)] backdrop-blur-sm relative">
                    
                    {/* Decorative Hacker Elements */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary -translate-x-[2px] -translate-y-[2px]"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary translate-x-[2px] -translate-y-[2px]"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary -translate-x-[2px] translate-y-[2px]"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary translate-x-[2px] translate-y-[2px]"></div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-4 border-b border-border pb-6">
                            
                            <Link href="/">
                                <div className="mb-2 flex items-center justify-center border border-primary p-3 bg-primary/10 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                                    <Terminal className="w-6 h-6 text-primary" />
                                </div>
                                <span className="sr-only">DEV_RADAR</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-bold uppercase tracking-widest text-primary">> {title}_</h1>
                                <p className="text-center text-xs font-mono text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
                
                {/* Simulated Footer Text */}
                <div className="text-center mt-6 text-[10px] font-mono text-muted-foreground uppercase opacity-50">
                    CONNECTION_SECURE // AES-256 ENCRYPTION ACTIVE
                </div>
            </div>
        </div>
    );
}
