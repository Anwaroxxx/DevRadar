import React from 'react';
import { Head, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Deactivated() {
    return (
        <HackerLayout>
            <Head title="NODE_DEACTIVATED" />
            <div className="min-h-[80vh] flex items-center justify-center p-4 font-mono">
                <div className="max-w-md w-full bg-black/40 border-2 border-destructive/50 p-8 relative overflow-hidden backdrop-blur-sm">
                    {/* Background Glitch Effect */}
                    <div className="absolute inset-0 bg-destructive/5 pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-destructive/50 animate-pulse pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <ShieldAlert className="w-16 h-16 text-destructive mb-6" />
                        
                        <h1 className="text-2xl font-black uppercase text-destructive tracking-widest mb-4">
                            Account_Deactivated
                        </h1>
                        
                        <p className="text-sm text-foreground/80 mb-8 leading-relaxed">
                            This node has been decommissioned. Your account is currently deactivated and access to the DevRadar neural network has been revoked.
                        </p>
                        
                        <div className="w-full h-[1px] bg-destructive/20 mb-8" />
                        
                        <Link 
                            href="/" 
                            className="flex items-center justify-center gap-2 w-full py-3 bg-black border border-primary/30 text-primary hover:bg-primary/10 transition-colors uppercase text-xs font-bold tracking-widest"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Return_To_Surface
                        </Link>
                    </div>
                </div>
            </div>
        </HackerLayout>
    );
}
