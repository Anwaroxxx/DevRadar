import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal, LifeBuoy, ChevronDown, ChevronUp, Send,
    Mail, Tag, MessageSquare, CheckCircle, ArrowRight,
    Shield, Clock, AlertCircle
} from 'lucide-react';

const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
    viewport: { once: true },
});

const FAQS = [
    {
        q: 'How does the XP system work?',
        a: 'XP (experience points) are earned when your content is approved by our team. Posting a verified event, job, or community earns you XP. Logging in daily also gives you a small daily bonus. Use your XP to access premium AI tools on the platform.',
    },
    {
        q: 'Why isn\'t my post appearing on the map?',
        a: 'All new events, jobs, and communities go through an approval queue. Our team reviews submissions within 24 hours. Once approved, your content will appear live on the map and directories — and your XP will be credited.',
    },
    {
        q: 'How do I access the AI tools?',
        a: 'AI tools like code review, resume builder, and post generator are available inside the platform. Each tool costs a small amount of XP per use. You can check your current XP balance in your profile.',
    },
    {
        q: 'Can I edit or delete my posts?',
        a: 'Yes. You can manage all your posts from your profile dashboard. Note that significant edits to approved content may send it back through the approval queue.',
    },
    {
        q: 'How do I report inappropriate content?',
        a: 'Any post or user profile has a "Report" option. Our moderation team reviews all reports and acts within 24 hours. Abusive accounts are permanently banned.',
    },
    {
        q: 'Is DevRadar free to use?',
        a: 'Yes — DevRadar is free to join and use. AI tools cost XP (which you earn for free by contributing), so there\'s nothing to pay for.',
    },
];

const TYPES = ['Bug_Report', 'Account_Inquiry', 'XP_System_Help', 'Partnership'];

export default function Support() {
    const { flash, auth } = usePage().props;
    const [openFaq, setOpenFaq] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        type: 'Bug_Report',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/support', {
            onSuccess: () => { reset(); setSubmitted(true); },
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-foreground font-mono selection:bg-primary/20 selection:text-primary overflow-x-hidden">
            <Head title="Support | DevRadar Morocco" />

            {/* Grid BG */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Nav */}
            <nav className="relative z-50 border-b border-white/[0.04] bg-black/60 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-primary" />
                        <span className="font-black text-sm tracking-tighter uppercase">Dev<span className="text-primary">Radar</span></span>
                    </Link>
                    <div className="flex items-center gap-6 text-[9px] uppercase tracking-widest text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                        {auth?.user ? (
                            <Link href="/dashboard" className="px-3 py-1 bg-primary text-black font-bold hover:bg-white transition-all">Dashboard</Link>
                        ) : (
                            <Link href="/login" className="hover:text-primary transition-colors">Sign In</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative z-10 py-20 px-6 text-center border-b border-white/[0.04]">
                <motion.div {...fade(0)} className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/20 bg-primary/5 mb-8">
                    <LifeBuoy className="w-3 h-3 text-primary animate-spin" style={{ animationDuration: '8s' }} />
                    <span className="text-[9px] uppercase tracking-[0.3em] text-primary font-bold">Help Center</span>
                </motion.div>
                <motion.h1 {...fade(0.1)} className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.88]">
                    We're Here <span className="text-primary italic">to Help.</span>
                </motion.h1>
                <motion.p {...fade(0.2)} className="mt-5 max-w-md mx-auto text-xs text-muted-foreground uppercase tracking-wide leading-relaxed">
                    Browse our FAQ or submit a ticket. Our team responds within 24 hours.
                </motion.p>

                {/* Quick status pills */}
                <motion.div {...fade(0.25)} className="flex flex-wrap justify-center gap-3 mt-8">
                    {[
                        { icon: Clock, label: 'Avg Response: &lt; 24h' },
                        { icon: Shield, label: 'Moderated Platform' },
                        { icon: CheckCircle, label: 'Human Support' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1 border border-white/[0.06] text-[9px] uppercase tracking-widest text-muted-foreground">
                            <item.icon className="w-3 h-3 text-primary/60" />
                            <span dangerouslySetInnerHTML={{ __html: item.label }} />
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* Main Content */}
            <section className="relative z-10 py-20 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">

                    {/* ── FAQ ── */}
                    <div className="lg:col-span-3 space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Frequently Asked Questions
                        </h2>
                        {FAQS.map((faq, i) => (
                            <motion.div
                                key={i}
                                {...fade(i * 0.04)}
                                className="border border-white/[0.05] bg-[#090909] overflow-hidden group"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group-hover:bg-[#0e0e0e] transition-colors"
                                >
                                    <span className="text-xs font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                                        {faq.q}
                                    </span>
                                    {openFaq === i
                                        ? <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                                        : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                                    }
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-white/[0.04]">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    {/* ── Contact Form ── */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <Send className="w-5 h-5 text-primary" />
                            Submit a Ticket
                        </h2>

                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="border border-primary/30 bg-primary/5 p-8 text-center space-y-4"
                            >
                                <CheckCircle className="w-10 h-10 text-primary mx-auto" />
                                <div className="font-black uppercase text-sm tracking-tight">Ticket Submitted!</div>
                                <p className="text-xs text-muted-foreground">Our team will get back to you within 24 hours at the email you provided.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-[9px] uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
                                >
                                    Submit Another
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5 font-bold">
                                        Your Email *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/30" />
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full bg-black/60 border border-white/[0.08] pl-9 pr-4 py-2.5 text-xs focus:border-primary/50 focus:bg-black outline-none transition-all placeholder:text-white/20"
                                        />
                                    </div>
                                    {errors.email && <p className="text-[9px] text-red-400 mt-1">{errors.email}</p>}
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="block text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5 font-bold">
                                        Request Type *
                                    </label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/30" />
                                        <select
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value)}
                                            className="w-full bg-black/60 border border-white/[0.08] pl-9 pr-4 py-2.5 text-xs focus:border-primary/50 focus:bg-black outline-none transition-all appearance-none"
                                        >
                                            {TYPES.map(t => (
                                                <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5 font-bold">
                                        Your Message *
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        placeholder="Describe your issue or request in detail..."
                                        className="w-full bg-black/60 border border-white/[0.08] px-4 py-2.5 text-xs focus:border-primary/50 focus:bg-black outline-none transition-all resize-none placeholder:text-white/20"
                                    />
                                    {errors.message && <p className="text-[9px] text-red-400 mt-1">{errors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    {processing ? 'Sending...' : 'Submit Ticket'}
                                </button>

                                <p className="text-[9px] text-center text-muted-foreground/40 uppercase tracking-widest">
                                    Responses sent to your email within 24h
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <footer className="relative z-10 border-t border-white/[0.04] py-8 text-center text-[9px] uppercase tracking-widest text-muted-foreground">
                © {new Date().getFullYear()} DevRadar Morocco // Help Center
            </footer>
        </div>
    );
}
