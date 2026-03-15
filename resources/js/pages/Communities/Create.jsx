import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Terminal, Users, Globe, Save, Fingerprint, Plus } from 'lucide-react';

export default function CreateCommunity() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        platform: 'Discord',
        join_link: '',
        city: '',
        category: 'general',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/communities');
    };

    return (
        <HackerLayout>
            <Head title="Initialize Cluster" />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8 border-b border-primary/30 pb-4">
                    <div className="p-3 border-2 border-primary bg-primary/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground leading-none">
                            INIT_CLUSTER_NODE
                        </h1>
                        <div className="text-xs font-mono text-primary/60 mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            CLUSTER_SYNC_AWAITING...
                        </div>
                    </div>
                </div>

                <div className="bg-card border-2 border-primary/40 relative overflow-hidden p-8 shadow-[0_0_50px_rgba(34,197,94,0.05)]">
                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    
                    <form onSubmit={submit} className="relative z-10 font-mono space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] text-primary/60 uppercase mb-2 tracking-widest font-black">
                                         [0x01] Cluster_Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-black/40 border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                                        placeholder="EX: React Morocco"
                                        required
                                    />
                                    {errors.name && <div className="text-destructive text-[10px] mt-1">{errors.name}</div>}
                                </div>

                                <div>
                                    <label className="block text-[10px] text-primary/60 uppercase mb-2 tracking-widest font-black">
                                         [0x02] Primary_Platform
                                    </label>
                                    <select
                                        value={data.platform}
                                        onChange={e => setData('platform', e.target.value)}
                                        className="w-full bg-black/40 border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Discord" className="bg-black">DISCORD</option>
                                        <option value="Slack" className="bg-black">SLACK</option>
                                        <option value="Telegram" className="bg-black">TELEGRAM</option>
                                        <option value="WhatsApp" className="bg-black">WHATSAPP</option>
                                        <option value="Meetup" className="bg-black">MEETUP</option>
                                        <option value="Other" className="bg-black">OTHER</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] text-primary/60 uppercase mb-2 tracking-widest font-black">
                                         [0x03] Category_Class
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        className="w-full bg-black/40 border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="frontend" className="bg-black">FRONTEND</option>
                                        <option value="backend" className="bg-black">BACKEND</option>
                                        <option value="devops" className="bg-black">DEVOPS</option>
                                        <option value="ai" className="bg-black">AI / ML</option>
                                        <option value="mobile" className="bg-black">MOBILE</option>
                                        <option value="general" className="bg-black">GENERAL_TECH</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] text-primary/60 uppercase mb-2 tracking-widest font-black">
                                         [0x04] Gateway_Link (URL)
                                    </label>
                                    <input
                                        type="url"
                                        value={data.join_link}
                                        onChange={e => setData('join_link', e.target.value)}
                                        className="w-full bg-black/40 border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="https://discord.gg/..."
                                        required
                                    />
                                    {errors.join_link && <div className="text-destructive text-[10px] mt-1">{errors.join_link}</div>}
                                </div>

                                <div>
                                    <label className="block text-[10px] text-primary/60 uppercase mb-2 tracking-widest font-black">
                                         [0x05] Operation_Base (City)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={e => setData('city', e.target.value)}
                                        className="w-full bg-black/40 border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="EX: Casablanca (Optional)"
                                    />
                                </div>

                                <div className="p-4 border border-primary/20 bg-primary/5 text-[9px] text-primary/60 leading-relaxed">
                                    <span className="font-bold text-primary">NOTICE:</span> Initializing a new cluster will broadcast a signal to the entire DevRadar network. Ensure all protocols are followed.
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] text-primary/60 uppercase mb-2 tracking-widest font-black">
                                 [0x06] Manifest_Summary (Description)
                            </label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows="5"
                                className="w-full bg-black/40 border border-primary/30 p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                                placeholder="Describe the mission and community focus..."
                                required
                            ></textarea>
                            {errors.description && <div className="text-destructive text-[10px] mt-1">{errors.description}</div>}
                        </div>

                        <div className="border-t border-primary/30 pt-8 flex flex-col items-center gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full md:w-2/3 bg-primary/20 text-primary border-2 border-primary py-4 font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-primary-foreground transition-all shadow-[0_0_30px_rgba(34,197,94,0.1)] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                <Fingerprint className="w-5 h-5" /> AUTHORIZE_LINK
                            </button>
                            <Link 
                                href="/communities"
                                className="text-muted-foreground hover:text-primary transition-colors text-xs uppercase"
                            >
                                &gt; ABORT_INITIALIZATION
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </HackerLayout>
    );
}
