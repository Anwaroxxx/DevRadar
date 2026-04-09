import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Terminal, Users, Globe, Save, Fingerprint, Plus, Activity } from 'lucide-react';

export default function CreateCommunity() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        platform: 'Discord',
        join_link: '',
        category: 'general',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/communities');
    };

    return (
        <HackerLayout>
            <Head title="Create Community" />
            
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8 border-b border-primary/30 pb-4">
                    <div className="p-3 border-2 border-primary bg-primary/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground leading-none font-mono">
                            Deploy_Community
                        </h1>
                        <div className="text-[10px] font-mono text-primary/60 mt-2 flex items-center gap-2 tracking-[0.2em] uppercase">
                            <Activity className="w-3 h-3 animate-pulse text-primary" />
                            Establishing new network cluster...
                        </div>
                    </div>
                </div>

                <div className="bg-card border-2 border-primary/40 relative overflow-hidden p-10 shadow-[0_0_50px_rgba(34,197,94,0.05)]">
                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    
                    <form onSubmit={submit} className="relative z-10 font-mono space-y-8">
                        {/* Phase 1: Identity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-primary/10 pb-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] text-primary/60 uppercase mb-2 tracking-widest font-black">
                                         [0x01] Hub_Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-black/40 border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] uppercase text-sm"
                                        placeholder="EX: CYBER_SPACE_RE"
                                        required
                                    />
                                    {errors.name && <div className="text-destructive text-[10px] mt-1">{errors.name}</div>}
                                </div>

                                <div>
                                    <label className="block text-[10px] text-primary/60 uppercase mb-2 tracking-widest font-black">
                                         [0x02] Host_Platform
                                    </label>
                                    <select
                                        value={data.platform}
                                        onChange={e => setData('platform', e.target.value)}
                                        className="w-full bg-black/40 border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer uppercase text-xs"
                                    >
                                        <option value="Discord" className="bg-black">DISCORD</option>
                                        <option value="Slack" className="bg-black">SLACK</option>
                                        <option value="Telegram" className="bg-black">TELEGRAM</option>
                                        <option value="WhatsApp" className="bg-black">WHATSAPP</option>
                                        <option value="Meetup" className="bg-black">MEETUP</option>
                                        <option value="Other" className="bg-black">OTHER</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] text-primary/60 uppercase mb-2 tracking-widest font-black">
                                         [0x03] System_Sector
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        className="w-full bg-black/40 border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer uppercase text-xs"
                                    >
                                        <option value="frontend" className="bg-black">FRONTEND</option>
                                        <option value="backend" className="bg-black">BACKEND</option>
                                        <option value="devops" className="bg-black">DEVOPS</option>
                                        <option value="ai" className="bg-black">AI / ML</option>
                                        <option value="mobile" className="bg-black">MOBILE</option>
                                        <option value="general" className="bg-black">GENERAL_TECH</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] text-primary/60 uppercase mb-3 tracking-widest font-black">
                                         [0x04] Signal_Invite (URL)
                                    </label>
                                    <input
                                        type="url"
                                        value={data.join_link}
                                        onChange={e => setData('join_link', e.target.value)}
                                        className="w-full bg-black/40 border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-xs"
                                        placeholder="https://hub-access.signal/..."
                                        required
                                    />
                                    {errors.join_link && <div className="text-destructive text-[10px] mt-1">{errors.join_link}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Phase 2: Transmission Content */}
                        <div>
                            <label className="block text-[10px] text-primary/60 uppercase mb-2 tracking-widest font-black">
                                 [0x05] Hub_Encryption (Description)
                            </label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows="6"
                                className="w-full bg-black/40 border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none text-sm placeholder:opacity-30"
                                placeholder="Define the hub parameters and mission parameters..."
                                required
                            ></textarea>
                            {errors.description && <div className="text-destructive text-[10px] mt-1">{errors.description}</div>}
                        </div>

                        <div className="p-4 border border-primary/20 bg-primary/5 text-[9px] text-primary/60 leading-relaxed uppercase tracking-widest text-center italic">
                            By deploying this hub, you agree to anchor it within the primary DevRadar online network.
                        </div>

                        <div className="pt-4 flex flex-col items-center gap-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-primary/20 text-primary border-2 border-primary py-5 font-black uppercase tracking-[0.4em] hover:bg-primary hover:text-black transition-all shadow-[0_0_30px_rgba(34,197,94,0.1)] disabled:opacity-50 flex items-center justify-center gap-3 text-sm group"
                            >
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
                                Initialize_Cluster
                            </button>
                            <Link 
                                href="/communities"
                                className="text-muted-foreground hover:text-primary transition-colors text-[10px] uppercase font-black tracking-widest border-b border-transparent hover:border-primary pb-1"
                            >
                                /abort_operation
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </HackerLayout>
    );
}
