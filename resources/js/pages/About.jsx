import { Head } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Terminal, Shield, Zap, Cpu } from 'lucide-react';

export default function About() {
    return (
        <HackerLayout>
            <Head title="About" />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                
                <div className="bg-card border-2 border-primary/50 relative overflow-hidden p-8 mb-8">
                    {/* Matrix overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:20px_20px]"></div>
                    
                    <div className="flex items-center gap-3 mb-8 border-b border-border pb-4 relative z-10">
                        <Terminal className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-black uppercase text-foreground m-0">About_Sys.Core</h1>
                    </div>

                    <div className="space-y-6 relative z-10 font-mono text-sm leading-relaxed text-muted-foreground">
                        <p>
                            <strong className="text-primary">&gt; INIT_SEQUENCE:</strong><br/>
                            DevRadar Morocco was initialized to solve a core networking fragmentation issue within the regional tech ecosystem. 
                            It serves as a centralized intelligence hub and communication grid for developers, engineers, and technologists across the territory.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="bg-black/30 p-4 border border-border hover:border-primary transition-colors">
                                <Shield className="w-5 h-5 text-primary mb-3" />
                                <h3 className="text-foreground font-bold uppercase mb-2">Protocol_One: Discover</h3>
                                <p className="text-xs">
                                    A continuously updated radar mapping all active tech nodes (events, meetups, hackathons) in the territory. Never miss a ping.
                                </p>
                            </div>
                            
                            <div className="bg-black/30 p-4 border border-border hover:border-primary transition-colors">
                                <Zap className="w-5 h-5 text-primary mb-3" />
                                <h3 className="text-foreground font-bold uppercase mb-2">Protocol_Two: Evolve</h3>
                                <p className="text-xs">
                                    Earn network experience (XP) by contributing intelligence (posting jobs, sharing events) to the grid. Level up your node status.
                                </p>
                            </div>

                            <div className="bg-black/30 p-4 border border-border hover:border-primary transition-colors">
                                <Cpu className="w-5 h-5 text-primary mb-3" />
                                <h3 className="text-foreground font-bold uppercase mb-2">Protocol_Three: Leverage_AI</h3>
                                <p className="text-xs">
                                    Expend earned XP to access advanced AI subroutines for code review, profile optimization, and logic debugging.
                                </p>
                            </div>
                            
                            <div className="bg-black/30 p-4 border-primary/30 border bg-primary/5 hover:border-primary transition-colors">
                                <Terminal className="w-5 h-5 text-primary mb-3" />
                                <h3 className="text-primary font-bold uppercase mb-2">System_Ops</h3>
                                <p className="text-xs text-foreground/80">
                                    Built on a high-octane Laravel backplane with an Inertia+React routing matrix. Styled via standard CSS terminal protocols.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HackerLayout>
    );
}
