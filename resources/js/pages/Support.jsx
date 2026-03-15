import { Head } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Terminal, LifeBuoy, AlertTriangle, Send } from 'lucide-react';

export default function Support() {
    return (
        <HackerLayout>
            <Head title="System Support" />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                
                <div className="bg-card border-2 border-primary/50 relative overflow-hidden p-8 mb-8">
                    {/* Matrix overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:20px_20px]"></div>
                    
                    <div className="flex items-center gap-3 mb-8 border-b border-border pb-4 relative z-10">
                        <LifeBuoy className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-black uppercase text-foreground m-0">Sys.Support // Comms</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        {/* FAQ Side */}
                        <div className="space-y-6 font-mono">
                            <h2 className="text-xl font-bold uppercase text-primary mb-4 border-b border-primary/30 pb-2">> COMMON_QUERIES</h2>
                            
                            <div className="space-y-4">
                                <div className="border border-border p-4 bg-black/20 hover:border-primary transition-colors">
                                    <h3 className="font-bold text-sm mb-2 uppercase flex items-start gap-2">
                                        <Terminal className="w-4 h-4 text-primary mt-0.5" /> How do I earn XP?
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        XP is awarded for engaging with the grid: logging in daily (+5), posting jobs (+50), creating events (+50), and establishing communities (+30).
                                    </p>
                                </div>
                                
                                <div className="border border-border p-4 bg-black/20 hover:border-primary transition-colors">
                                    <h3 className="font-bold text-sm mb-2 uppercase flex items-start gap-2">
                                        <Terminal className="w-4 h-4 text-primary mt-0.5" /> What is AI_Shell?
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        AI_Shell contains advanced Groq-powered logic routines. Accessing these tools costs XP (e.g., Code Review costs 15 XP). If your power level is too low, access is denied.
                                    </p>
                                </div>
                                
                                <div className="border border-border p-4 bg-black/20 hover:border-primary transition-colors">
                                    <h3 className="font-bold text-sm mb-2 uppercase flex items-start gap-2">
                                        <Terminal className="w-4 h-4 text-primary mt-0.5" /> Can I update my hardware modules?
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Yes. Access your Node Profile and execute the 'RECONFIG_PROFILE' routine to adjust your installed skills and metadata.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form Side */}
                        <div className="font-mono bg-black/40 border border-primary/30 p-6">
                            <h2 className="text-xl font-bold uppercase text-primary mb-4 border-b border-primary/30 pb-2">> OPEN_TICKET</h2>
                            
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <div>
                                    <label className="block text-xs uppercase text-muted-foreground mb-1">Issue_Type</label>
                                    <select className="w-full bg-card border border-border p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground text-sm uppercase">
                                        <option>Bug Report (Logic Error)</option>
                                        <option>Feature Request (Upgrade)</option>
                                        <option>Account Issue (Auth Error)</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-xs uppercase text-muted-foreground mb-1">Severity_Level</label>
                                    <select className="w-full bg-card border border-border p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground text-sm uppercase">
                                        <option>Low (Cosmetic)</option>
                                        <option>Medium (Degraded Service)</option>
                                        <option>High (Core Failure)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase text-muted-foreground mb-1">Describe_Anomaly</label>
                                    <textarea 
                                        rows="4" 
                                        className="w-full bg-card border border-border p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground text-sm resize-none"
                                        placeholder="Enter log details here..."
                                    ></textarea>
                                </div>

                                <button 
                                    type="button"
                                    className="w-full border border-primary bg-primary/10 text-primary px-4 py-3 text-sm font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" /> TRANSMIT_DATA
                                </button>
                                
                                <div className="text-[10px] text-muted-foreground text-center mt-4 opacity-50">
                                    <AlertTriangle className="w-3 h-3 inline mr-1" /> Note: This action is currently simulated in the dev environment.
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </HackerLayout>
    );
}
