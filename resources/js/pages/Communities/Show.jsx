import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Globe, UserPlus, Fingerprint, Plus, User, 
    MessageSquare, ArrowBigUp, ArrowBigDown, Share2, Terminal, Code,
    ChevronLeft, Send, Activity, Shield, Hash, AlertTriangle, AlertOctagon, X,
    Check, Copy
} from 'lucide-react';

export default function CommunityShow({ community, posts, isFollowing }) {
    const { auth } = usePage().props;
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    
    const [reportingContent, setReportingContent] = useState(null); 
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    
    const reportUrl = reportingContent
        ? (reportingContent.type === 'post'
            ? `/community-posts/${reportingContent.id}/report`
            : `/community-comments/${reportingContent.id}/report`)
        : null;
    
    const { data: reportData, setData: setReportData, post: postReport, processing: reporting, reset: resetReport, errors: reportErrors } = useForm({
        reason: 'spam',
        description: ''
    });

    const openReportModal = (type, id) => {
        setReportingContent({ type, id });
        setIsReportModalOpen(true);
    };

    const submitReport = (e) => {
        e.preventDefault();
        if (!reportingContent || !reportUrl) return;
        postReport(reportUrl, {
            onSuccess: () => {
                setIsReportModalOpen(false);
                resetReport();
            }
        });
    };

    // Post Form
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        content: '',
        code_snippet: '',
        language: 'javascript'
    });

    const submitPost = (e) => {
        e.preventDefault();
        post(`/communities/${community.id}/posts`, {
            onSuccess: () => {
                setIsPostModalOpen(false);
                reset();
            }
        });
    };

    const handleUpvote = (postId) => {
        router.post(`/community-posts/${postId}/upvote`, {}, {
            preserveScroll: true
        });
    };

    const handleFollow = () => {
        router.post(`/communities/${community.id}/follow`, {}, {
            preserveScroll: true
        });
    };

    return (
        <HackerLayout>
            <Head title={`${community.name} // Hub`} />

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-mono">
                {/* ── Community Header ── */}
                <div className="relative border-b-2 border-primary/20 pb-8 overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-5 text-[80px] font-black pointer-events-none select-none">
                        {community.category?.toUpperCase()}
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-black border-2 border-primary flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                                <Globe className="w-10 h-10 text-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">{community.name}</h1>
                                    <span className="text-[10px] px-2 py-0.5 border border-primary/40 text-primary uppercase">Active</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-primary" /> {community.member_count} Members</span>
                                    <span className="flex items-center gap-1.5"><Fingerprint className="w-3.5 h-3.5" /> ID: {community.id.toString().padStart(6, '0')}</span>
                                    <span className="flex items-center gap-1.5 text-primary/60"><Activity className="w-3.5 h-3.5" /> {community.platform}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {auth.user && (
                            <button 
                                onClick={handleFollow}
                                className={`flex-1 md:flex-none px-6 py-3 border-2 font-black uppercase text-xs transition-all flex items-center justify-center gap-2 ${
                                    isFollowing 
                                        ? 'border-primary bg-primary text-black' 
                                        : 'border-primary/40 text-primary hover:bg-primary/10'
                                }`}
                            >
                                <UserPlus className="w-4 h-4" />
                                {isFollowing ? 'Joined_Hub' : 'Join_Community'}
                            </button>
                            )}
                            <a 
                                href={community.join_link}
                                target="_blank"
                                className="px-6 py-3 border-2 border-primary/20 text-muted-foreground hover:border-primary hover:text-primary transition-all text-xs font-black uppercase flex items-center gap-2"
                            >
                                <Globe className="w-4 h-4" /> Link
                            </a>
                        </div>
                    </div>
                    
                    <p className="mt-8 text-sm text-muted-foreground leading-relaxed max-w-3xl border-l-2 border-primary/10 pl-6 bg-primary/[0.02] py-4">
                        {community.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* ── Main Feed ── */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* New Post Trigger */}
                        {auth.user && (
                        <div className="bg-black/40 border border-primary/20 p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <button 
                                onClick={() => setIsPostModalOpen(true)}
                                className="flex-1 text-left px-4 py-2 bg-primary/5 border border-primary/10 text-muted-foreground text-xs hover:border-primary/30 transition-all uppercase tracking-widest font-black"
                            >
                                Broadcast a thought...
                            </button>
                        </div>
                        )}

                        {/* Recent Activity Label */}
                        <div className="flex items-center gap-3 text-primary/40">
                            <div className="h-[1px] flex-1 bg-primary/10"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Latest_Broadcasts</span>
                            <div className="h-[1px] flex-1 bg-primary/10"></div>
                        </div>

                        {/* Posts List */}
                        <div className="space-y-6">
                            {posts.data.length === 0 ? (
                                <div className="py-20 text-center space-y-4 border border-dashed border-primary/10 bg-primary/[0.01]">
                                    <Shield className="w-12 h-12 text-primary/10 mx-auto" />
                                    <div className="text-xs text-primary/20 uppercase font-black tracking-widest">Sector Empty. No signals detected.</div>
                                </div>
                            ) : (
                                posts.data.map((post) => (
                                    <PostCard key={post.id} post={post} onUpvote={handleUpvote} communityId={community.id} onReport={openReportModal} auth={auth} />
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="py-8 flex justify-center">
                            {posts.links && posts.links.length > 3 && (
                                <div className="flex gap-2">
                                    {posts.links.map((link, k) => (
                                         <Link
                                            key={k}
                                            href={link.url}
                                            className={`px-4 py-2 border text-[10px] font-black ${link.active ? 'border-primary text-primary bg-primary/10' : 'border-primary/20 text-muted-foreground hover:border-primary/40'} ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                         />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Sidebar ── */}
                    <div className="space-y-6">
                        <div className="bg-primary/5 border border-primary/30 p-6 space-y-6">
                            <h3 className="text-sm font-black uppercase text-primary border-b border-primary/20 pb-2">Community_Core</h3>
                            
                            <div className="space-y-4 text-xs">
                                <div className="flex flex-col">
                                    <span className="text-muted-foreground text-[10px] uppercase mb-1">Custodian</span>
                                    <Link href={`/profile/${community.user?.username}`} className="text-foreground hover:text-primary font-black uppercase flex items-center gap-2">
                                        <Shield className="w-3.5 h-3.5 text-primary" />
                                        @{community.user?.username}
                                    </Link>
                                </div>
                                
                                <div className="flex flex-col">
                                    <span className="text-muted-foreground text-[10px] uppercase mb-1">Established</span>
                                    <span className="font-black text-foreground">{new Date(community.created_at).toLocaleDateString()}</span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-muted-foreground text-[10px] uppercase mb-1">Location</span>
                                    <span className="font-black text-foreground">{community.city || 'Undisclosed'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/40 border border-primary/10 p-6">
                            <h3 className="text-xs font-black uppercase text-muted-foreground mb-4">Network_Rules</h3>
                            <ul className="space-y-3 text-[10px] text-muted-foreground leading-relaxed uppercase">
                                <li>• Respect the code, respect the peer.</li>
                                <li>• No spamming identical solutions.</li>
                                <li>• Quality over quantity in every signal.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── New Post Modal ── */}
            <AnimatePresence>
                {isPostModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                            onClick={() => setIsPostModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-black border-2 border-primary shadow-[0_0_50px_rgba(34,197,94,0.2)] p-8 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Terminal className="w-20 h-20 text-primary" />
                            </div>

                            <h2 className="text-2xl font-black uppercase text-primary mb-6 flex items-center gap-3">
                                <Code className="w-6 h-6" /> Initialize_Broadcast
                            </h2>

                            <form onSubmit={submitPost} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-primary/60 uppercase font-black tracking-widest">Thread_Title</label>
                                    <input 
                                        type="text"
                                        placeholder="Brief summary of your thought..."
                                        className="w-full bg-primary/5 border border-primary/20 p-3 text-sm focus:border-primary outline-none transition-all placeholder:text-primary/20"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        required
                                    />
                                    {errors.title && <div className="text-red-500 text-[10px] mt-1">{errors.title}</div>}
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-[10px] text-primary/60 uppercase font-black tracking-widest">Transmission_Content</label>
                                        <span className="text-[9px] text-primary/40 font-mono italic">MARKDOWN_SNIPPETS_SUPPORTED (```lang)</span>
                                    </div>
                                    <textarea 
                                        rows={8}
                                        placeholder="Describe your thoughts... Use ```lang to embed code signals."
                                        className="w-full bg-primary/5 border border-primary/20 p-3 text-sm focus:border-primary outline-none transition-all placeholder:text-primary/20 resize-none font-mono"
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        required
                                    />
                                    {errors.content && <div className="text-red-500 text-[10px] mt-1">{errors.content}</div>}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="flex-1 bg-primary text-black font-black uppercase py-4 hover:brightness-125 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4 group-hover:translate-x-1" />
                                        Commit_Broadcast
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setIsPostModalOpen(false)}
                                        className="px-8 border border-primary/40 text-primary hover:bg-primary/10 font-black uppercase transition-all"
                                    >
                                        Abort
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Report Modal ── */}
            <AnimatePresence>
                {isReportModalOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            onClick={() => setIsReportModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-black border-2 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.1)] p-6 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 text-red-500 mb-6">
                                <AlertOctagon className="w-6 h-6" />
                                <h2 className="text-xl font-black uppercase tracking-tighter">Transmit_Violation</h2>
                            </div>

                            <form onSubmit={submitReport} className="space-y-4 font-mono">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-red-500/60 uppercase font-black uppercase tracking-widest">Violation_Type</label>
                                    <select 
                                        className="w-full bg-red-500/5 border border-red-500/20 p-2 text-xs text-red-200 outline-none focus:border-red-500/50 transition-all uppercase"
                                        value={reportData.reason}
                                        onChange={e => setReportData('reason', e.target.value)}
                                    >
                                        <option value="spam">SPAM / FLOODING</option>
                                        <option value="harassment">HARASSMENT / TOXICITY</option>
                                        <option value="inappropriate">INAPPROPRIATE_CONTENT</option>
                                        <option value="misinformation">MISINFORMATION</option>
                                        <option value="other">OTHER_ANOMALY</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] text-red-500/60 uppercase font-black uppercase tracking-widest">Encryption_Description</label>
                                    <textarea 
                                        rows={3}
                                        placeholder="Details of the violation..."
                                        className="w-full bg-red-500/5 border border-red-500/20 p-2 text-xs text-red-200 outline-none focus:border-red-500/50 transition-all placeholder:text-red-500/10 resize-none"
                                        value={reportData.description}
                                        onChange={e => setReportData('description', e.target.value)}
                                        required
                                    />
                                    {reportErrors.description && <div className="text-red-400 text-[10px] mt-1">{reportErrors.description}</div>}
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button 
                                        type="submit" 
                                        disabled={reporting}
                                        className="flex-1 bg-red-600 text-white font-black uppercase py-3 hover:bg-red-500 transition-all text-xs disabled:opacity-50"
                                    >
                                        Send_Signal
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setIsReportModalOpen(false)}
                                        className="px-6 border border-red-500/20 text-red-500/60 hover:text-red-500 transition-all font-black uppercase text-xs"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </HackerLayout>
    );
}

// Neural Code Sniffer components correctly placed outside main component
function SignalRenderer({ content }) {
    // Regex for Discord-style code blocks: ```[lang]\n[code]```
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
        <div className="space-y-4">
            {parts.map((part, index) => {
                if (part.startsWith('```') && part.endsWith('```')) {
                    const block = part.slice(3, -3).trim();
                    const firstNewlineEdge = block.indexOf('\n');
                    
                    let lang = '';
                    let code = block;

                    if (firstNewlineEdge !== -1 && firstNewlineEdge < 20) {
                        const potentialLang = block.slice(0, firstNewlineEdge).trim().toUpperCase();
                        if (potentialLang.length > 0 && potentialLang.length < 10) {
                            lang = potentialLang;
                            code = block.slice(firstNewlineEdge).trim();
                        }
                    }

                    if (!lang) lang = detectLanguage(code);

                    return <SignalTerminal key={index} code={code} lang={lang} />;
                }
                return (
                    <p key={index} className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {part}
                    </p>
                );
            })}
        </div>
    );
}

function SignalTerminal({ code, lang }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-6 relative group/code">
            <div className="flex items-center justify-between px-3 py-1.5 bg-primary/20 border border-primary/40 text-[9px] font-black uppercase text-primary border-b-0">
                <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3" />
                    <span>SIGNAL_SEGMENT.{lang}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                    >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'COPIED' : 'COPY'}</span>
                    </button>
                    <Activity className="w-3 h-3 opacity-30 animate-pulse" />
                </div>
            </div>
            <div className="bg-black/80 border border-primary/40 p-4 font-mono text-[11px] text-primary/90 overflow-x-auto shadow-inner relative z-10">
                <pre className="leading-relaxed">
                    <code>{code}</code>
                </pre>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover/code:opacity-5 flex items-center gap-2">
                <Shield className="w-32 h-32" />
            </div>
        </div>
    );
}

function PostCard({ post, onUpvote, communityId, onReport, auth }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isPostingComment, setIsPostingComment] = useState(false);

    const submitComment = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        
        setIsPostingComment(true);
        router.post(`/community-posts/${post.id}/comments`, {
            content: commentText
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setCommentText('');
                setIsExpanded(true);
            },
            onFinish: () => setIsPostingComment(false)
        });
    };

    return (
        <motion.div 
            layout
            className="bg-black/60 border border-primary/20 overflow-hidden relative group hover:border-primary/40 transition-all"
        >
            <div className="flex">
                {/* Voting Col */}
                <div className="w-12 border-r border-primary/10 flex flex-col items-center py-4 bg-primary/[0.02]">
                    {auth?.user ? (
                    <button 
                        onClick={() => onUpvote(post.id)}
                        className="p-1 hover:text-primary transition-colors text-muted-foreground"
                    >
                        <ArrowBigUp className="w-6 h-6" />
                    </button>
                    ) : (
                    <div className="p-1 text-muted-foreground/30"><ArrowBigUp className="w-6 h-6" /></div>
                    )}
                    <span className="text-[10px] font-black text-primary my-1">{post.upvotes_count ?? 0}</span>
                </div>

                {/* Content Col */}
                <div className="flex-1 p-5">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-3 font-mono">
                        <Link href={`/profile/${post.user?.username}`} className="text-primary hover:underline flex items-center gap-1 font-black">
                            <User className="w-3 h-3" /> @{post.user?.username}
                        </Link>
                        <span>•</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-lg font-bold mb-3 uppercase tracking-tight leading-tight">{post.title}</h3>
                    
                    <SignalRenderer content={post.content} />

                    {post.code_snippet && (
                        <SignalTerminal code={post.code_snippet} lang={post.language || 'LEGACY'} />
                    )}

                    <div className="flex items-center gap-6 text-[10px] font-black border-t border-primary/10 pt-4 mt-4">
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={`flex items-center gap-2 transition-colors ${isExpanded ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {post.comments_count} COMMENTS
                        </button>
                        <button 
                            onClick={() => onReport('post', post.id)}
                            className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors ml-auto group/report"
                        >
                            <AlertTriangle className="w-3.5 h-3.5 group-hover/report:animate-pulse" />
                            REPORT
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-black/30 border-t border-primary/10"
                    >
                        <div className="p-6 space-y-6">
                            {/* Comment Form */}
                            {auth?.user && (
                            <form onSubmit={submitComment} className="flex flex-col gap-2">
                                <textarea 
                                    className="w-full bg-black/50 border border-primary/20 p-3 text-xs outline-none focus:border-primary/50 transition-all placeholder:text-primary/10 resize-none h-20"
                                    placeholder="Execute response... (Markdown snippets supported)"
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                />
                                <div className="flex justify-end">
                                    <button 
                                        type="submit"
                                        disabled={isPostingComment || !commentText.trim()}
                                        className="px-4 py-2 bg-primary/10 border border-primary/40 text-[9px] font-black text-primary hover:bg-primary hover:text-black transition-all disabled:opacity-30 uppercase flex items-center gap-2"
                                    >
                                        <Send className="w-3 h-3" />
                                        Commit_Signal
                                    </button>
                                </div>
                            </form>
                            )}

                            {/* Comments List */}
                            <div className="space-y-4 border-l border-primary/20 pl-4">
                                {post.comments?.length === 0 ? (
                                    <div className="text-[9px] text-primary/30 uppercase italic font-mono">No signals detected in this cluster.</div>
                                ) : (
                                    post.comments?.map((comment) => (
                                        <div key={comment.id} className="group/comment pb-4 border-b border-primary/5 last:border-0">
                                            <div className="flex items-center gap-2 text-[9px] mb-1">
                                                <Link href={`/profile/${comment.user?.username}`} className="text-primary font-black uppercase">
                                                    @{comment.user?.username}
                                                </Link>
                                                <span className="text-muted-foreground opacity-30">• {new Date(comment.created_at).toLocaleDateString()}</span>
                                                <button 
                                                    onClick={() => onReport('comment', comment.id)}
                                                    className="ml-auto opacity-0 group-hover/comment:opacity-100 transition-opacity text-muted-foreground hover:text-red-400"
                                                    title="Report Signal"
                                                >
                                                    <AlertTriangle className="w-2.5 h-2.5" />
                                                </button>
                                            </div>
                                            <SignalRenderer content={comment.content} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
