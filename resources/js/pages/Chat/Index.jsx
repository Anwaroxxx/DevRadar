import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Search, Send, User, MessageSquare, Terminal, Shield, Zap, ChevronLeft, MoreVertical, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function ChatIndex({ chatUsers = [], selectedUser = null, messages = [], isRestricted = false }) {
    const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [sentToast, setSentToast] = useState(false);
    const scrollRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({
        content: '',
    });

    const [localMessages, setLocalMessages] = useState(messages);
    const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);
    const [isRemoteTyping, setIsRemoteTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        setLocalMessages(messages);
    }, [messages]);

    useEffect(() => {
        if (!auth.user || !window.Echo) {
            if (!window.Echo && auth.user) {
                console.warn("ChatIndex: Real-time updates disabled (Echo not initialized).");
            }
            return;
        }

        const channel = window.Echo.private(`chat.${auth.user.id}`)
            .listen('MessageSent', (e) => {
                // If message is for current selection, add it
                if (selectedUser && e.message.sender_id === selectedUser.id) {
                    setLocalMessages(prev => {
                        if (prev.find(m => m.id === e.message.id)) return prev;
                        return [...prev, e.message];
                    });
                    
                    // Auto-scroll check
                    if (scrollRef.current) {
                        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
                        if (scrollHeight - scrollTop - clientHeight > 100) {
                            setShowNewMessageIndicator(true);
                        }
                    }
                }
            })
            .listen('.user.typing', (e) => {
                if (selectedUser && e.sender_id === selectedUser.id) {
                    setIsRemoteTyping(e.is_typing);
                }
            });

        return () => {
            window.Echo.leave(`chat.${auth.user.id}`);
        };
    }, [selectedUser, auth.user]);

    // Send typing status
    useEffect(() => {
        if (!selectedUser) return;

        const broadcastTyping = (isTyping) => {
            axios.post(`/chat/${selectedUser.id}/typing`, { is_typing: isTyping }).catch(() => {});
        };

        if (data.content.length > 0) {
            broadcastTyping(true);
            
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                broadcastTyping(false);
            }, 3000);
        } else {
            broadcastTyping(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        }
    }, [data.content, selectedUser]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            setShowNewMessageIndicator(false);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollHeight - scrollTop - clientHeight < 150) {
                scrollToBottom();
            }
        }
    }, [localMessages]);

    useEffect(() => {
        if (searchQuery.length > 2) {
            setIsSearching(true);
            axios.get(`/chat/search?query=${searchQuery}`)
                .then(res => {
                    setSearchResults(res.data);
                    setIsSearching(false);
                })
                .catch(() => setIsSearching(false));
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!data.content.trim() || processing) return;
        
        post(`/chat/${selectedUser.id}`, {
            onSuccess: () => {
                reset();
                setSentToast(true);
                window.setTimeout(() => setSentToast(false), 2000);
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <HackerLayout>
            <Head title="Direct Messages | DevRadar" />
            
            <div className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-120px)] flex flex-col font-mono">
                <div className="flex flex-1 bg-black/40 border border-primary/20 overflow-hidden relative rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
                    {/* Sent toast */}
                    <AnimatePresence>
                        {sentToast && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-3 right-3 z-30 border border-primary/30 bg-primary/10 text-primary px-3 py-2 text-[10px] font-black uppercase tracking-widest"
                            >
                                MESSAGE SENT
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:24px_24px]"></div>
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

                    {/* Sidebar: Node Directory */}
                    <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-primary/10 flex flex-col bg-black/30 z-20`}>
                        <div className="p-4 border-b border-primary/10 space-y-4 bg-primary/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-primary">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="font-black uppercase text-[10px] tracking-widest">Active Conversations</span>
                                </div>
                                <div className="text-[8px] font-black text-primary/40 px-1 border border-primary/20">V.4.0.2</div>
                            </div>
                            
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/40 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="w-full bg-black/60 border border-primary/20 pl-9 pr-4 py-2.5 text-[10px] font-mono focus:border-primary/50 outline-none transition-all placeholder:text-primary/20"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {isSearching && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>}
                            </div>
                        </div>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {searchResults.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-black/90 border-b border-primary/20 overflow-hidden shadow-2xl"
                                >
                                    <div className="text-[8px] font-black p-2 text-primary/40 uppercase tracking-tighter">Search Results:</div>
                                    {searchResults.map(u => (
                                        <Link
                                            key={u.id}
                                            href={`/chat/${u.username}`}
                                            className="flex items-center gap-3 p-3 hover:bg-primary/10 transition-colors border-b border-primary/5 last:border-0"
                                            onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                                        >
                                            <div className="w-8 h-8 rounded-none border border-primary/30 bg-black flex items-center justify-center font-bold text-primary uppercase text-xs">
                                                {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : u.name[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[10px] font-bold truncate text-foreground">{u.name}</div>
                                                <div className="text-[9px] font-mono text-primary/60 truncate">@{u.username}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {chatUsers.length > 0 ? (
                                chatUsers.map(user => (
                                    <Link
                                        key={user.id}
                                        href={`/chat/${user.username}`}
                                        className={`flex items-center gap-4 p-4 border-b border-primary/10 transition-all relative overflow-hidden group ${
                                            selectedUser?.id === user.id ? 'bg-primary/5' : 'hover:bg-primary/5'
                                        }`}
                                    >
                                        {selectedUser?.id === user.id && (
                                            <motion.div 
                                                layoutId="active-indicator"
                                                className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_15px_rgba(34,197,94,0.5)]" 
                                            />
                                        )}
                                        
                                        <div className="relative shrink-0">
                                            <div className={`w-11 h-11 border ${selectedUser?.id === user.id ? 'border-primary shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'border-primary/20 group-hover:border-primary/40'} bg-black p-0.5 transition-all`}>
                                                <div className="w-full h-full bg-card overflow-hidden">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary/30 uppercase cursor-default">
                                                            {user.name[0]}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-primary border border-black shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <span className={`text-[11px] font-black uppercase truncate tracking-tight transition-colors ${selectedUser?.id === user.id ? 'text-primary' : 'text-foreground/80 group-hover:text-primary'}`}>
                                                    {user.name}
                                                </span>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {user.unread_count > 0 && (
                                                        <span className="min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center text-[9px] font-black bg-primary text-black border border-primary shadow-[0_0_10px_rgba(34,197,94,0.25)]">
                                                            {user.unread_count > 99 ? '99+' : user.unread_count}
                                                        </span>
                                                    )}
                                                    {user.last_message_time && (
                                                        <span className="text-[8px] font-mono text-primary/30 whitespace-nowrap">
                                                            {new Date(user.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-[9px] font-mono text-muted-foreground truncate opacity-60 leading-tight">
                                                {user.last_message ? (
                                                    <span className="italic">"{user.last_message}"</span>
                                                ) : (
                                                    <span className="animate-pulse">Waiting for messages...</span>
                                                )}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-12 text-center space-y-4 opacity-40 h-full flex flex-col justify-center">
                                    <Shield className="w-10 h-10 mx-auto text-primary/20" />
                                    <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-primary/50 leading-relaxed">
                                        No conversations yet<br/>Start a chat to see it here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Interface: Neural_Link */}
                    <div className={`${!selectedUser ? 'hidden md:flex' : 'flex'} flex-1 flex flex-col bg-black/20 relative z-10`}>
                        {selectedUser ? (
                            <>
                                {/* Interface Header */}
                                <div className="p-4 border-b border-primary/10 bg-black/40 backdrop-blur-xl flex items-center justify-between shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <Link href="/chat" className="md:hidden text-primary p-1 hover:bg-primary/10 rounded-full">
                                            <ChevronLeft className="w-5 h-5" />
                                        </Link>
                                        <div className="w-10 h-10 border border-primary/30 p-0.5 bg-black">
                                            <div className="w-full h-full bg-card overflow-hidden">
                                                {selectedUser.avatar ? <img src={selectedUser.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-primary/50 font-bold">{selectedUser.name[0]}</div>}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                                                {selectedUser.name}
                                                <span className="w-1.5 h-1.5 bg-primary animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                                            </div>
                                            <div className="text-[9px] font-mono text-primary/40 flex items-center gap-2">
                                                <Shield className="w-2.5 h-2.5" /> SECURE CONVERSATION WITH @{selectedUser.username.toUpperCase()}
                                                {isRemoteTyping && (
                                                    <span className="text-primary animate-pulse ml-2 font-black italic">
                                                        [ typing... ]
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="hidden sm:flex gap-1.5">
                                            <span className="px-1.5 py-0.5 border border-primary/20 text-[7px] font-black text-primary/60 uppercase tracking-tighter">E2E_RSA_READY</span>
                                            <span className="px-1.5 py-0.5 border border-primary/20 text-[7px] font-black text-primary/60 uppercase tracking-tighter">SIG_VALID</span>
                                        </div>
                                        <button className="text-primary/40 hover:text-primary transition-colors p-1">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Buffer Area (Messages) */}
                                <div 
                                    ref={scrollRef}
                                    className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-black/5"
                                >
                                    {localMessages.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20">
                                            <Terminal className="w-16 h-16 text-primary animate-pulse" />
                                            <div className="text-[10px] font-mono uppercase tracking-[0.5em] text-center leading-loose">
                                                Waiting for messages...<br/>
                                                [0% Data Synced]
                                            </div>
                                        </div>
                                    )}
                                    
                                    <AnimatePresence initial={false}>
                                        {localMessages.map((msg, idx) => {
                                            const isMe = msg.sender_id === auth.user.id;
                                            const showTimestamp = idx === 0 || 
                                                new Date(msg.created_at).getTime() - new Date(localMessages[idx-1].created_at).getTime() > 1000 * 60 * 5;

                                            return (
                                                <motion.div 
                                                    key={msg.id}
                                                    initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                                >
                                                    {showTimestamp && (
                                                        <div className="w-full flex justify-center mb-6">
                                                            <span className="text-[7px] font-black text-primary/30 uppercase tracking-[0.3em] bg-black/40 px-3 py-1 border border-primary/5 rounded-full">
                                                                {new Date(msg.created_at).toLocaleDateString()} // Time: {new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                                            </span>
                                                        </div>
                                                    )}
                                                    
                                                    <div className={`max-w-[85%] sm:max-w-[70%] group relative`}>
                                                        <div className={`p-3.5 text-[11px] font-mono leading-relaxed break-words relative border ${
                                                            isMe 
                                                            ? 'bg-primary/10 border-primary/40 text-primary rounded-l-sm rounded-tr-sm shadow-[0_0_15px_rgba(34,197,94,0.05)]' 
                                                            : 'bg-card/90 border-primary/20 text-foreground/90 rounded-r-sm rounded-tl-sm shadow-xl'
                                                        }`}>
                                                            {/* Message Corner Decoration */}
                                                            <div className={`absolute top-0 ${isMe ? 'right-0' : 'left-0'} w-1.5 h-1.5 border-t border-r ${isMe ? 'border-primary' : 'border-primary/50'}`}></div>
                                                            
                                                            <div className="text-[7px] mb-1 font-black opacity-40 uppercase tracking-widest flex justify-between items-center">
                                                                <span>{isMe ? 'SENT' : 'RECEIVED'}</span>
                                                                <span className="text-[6px]">{new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'})}</span>
                                                            </div>
                                                            
                                                            <div className="relative z-10">{msg.content}</div>
                                                            
                                                            {/* Scanning animation on new messages */}
                                                            {idx === localMessages.length - 1 && processing && (
                                                                <motion.div 
                                                                    initial={{ top: 0 }}
                                                                    animate={{ top: '100%' }}
                                                                    transition={{ duration: 1, repeat: Infinity }}
                                                                    className="absolute left-0 right-0 h-[2px] bg-primary/30 z-0 pointer-events-none"
                                                                />
                                                            )}
                                                        </div>
                                                        
                                                        {isMe && idx === localMessages.length - 1 && (
                                                            <div className="text-[8px] mt-1.5 font-black text-primary/40 uppercase italic tracking-tighter self-end flex items-center gap-1">
                                                                <Shield className="w-2 h-2" /> Delivered
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>

                                    {showNewMessageIndicator && (
                                        <button
                                            onClick={scrollToBottom}
                                            className="sticky bottom-4 left-1/2 -translate-x-1/2 bg-primary text-black px-4 py-2 font-bold uppercase text-xs animate-bounce shadow-xl border border-primary/50"
                                        >
                                            New Data ↓
                                        </button>
                                    )}
                                </div>

                                {/* Transmission Interface (Input) */}
                                <div className="p-4 border-t border-primary/10 bg-black/40 backdrop-blur-md">
                                    {isRestricted ? (
                                        <div className="flex flex-col items-center justify-center p-6 border border-destructive/20 bg-destructive/5 rounded-sm">
                                            <Shield className="w-8 h-8 text-destructive mb-3 animate-pulse" />
                                            <div className="text-xs font-black text-destructive uppercase tracking-widest mb-1">Conversation Restricted</div>
                                            <div className="text-[10px] text-muted-foreground font-mono uppercase text-center">
                                                Communications are offline due to user-defined filters.
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
                                            <div className="flex-1 relative group">
                                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors">
                                                    <Terminal className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Type your message..."
                                                    className="w-full bg-black/60 border border-primary/20 pl-11 pr-4 py-3.5 text-xs font-mono focus:border-primary/50 outline-none transition-all placeholder:text-primary/40 shadow-[inset_0_0_20px_rgba(34,197,94,0.02)]"
                                                    value={data.content}
                                                    onChange={(e) => setData('content', e.target.value)}
                                                    disabled={processing}
                                                    autoFocus
                                                />
                                                {/* Input Glitch Decorative Line */}
                                                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-focus-within:w-full transition-all duration-700"></div>
                                            </div>
                                            <button 
                                                type="submit" 
                                                disabled={processing || !data.content.trim()}
                                                className="px-8 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50 group relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                                <Send className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                <span className="font-black uppercase text-[10px] tracking-[0.2em] relative z-10 hidden sm:inline">Send</span>
                                            </button>
                                        </form>
                                    )}
                                    <div className="mt-3 text-center">
                                        <div className="text-[7px] font-black text-primary/20 uppercase tracking-[0.5em] italic">{isRestricted ? 'Neural Transmission Offline' : 'End-to-End Encryption Active'}</div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
                                {/* Large Decorative Watermark */}
                                <Terminal className="absolute w-[80%] h-[80%] text-primary/[0.02] -rotate-12 pointer-events-none" />
                                
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative space-y-8 max-w-sm"
                                >
                                    <div className="relative inline-block">
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                            className="w-32 h-32 border-2 border-dashed border-primary/10 rounded-full flex items-center justify-center"
                                        >
                                            <Zap className="w-12 h-12 text-primary/10" />
                                        </motion.div>
                                        <Shield className="absolute inset-x-0 -bottom-2 w-10 h-10 mx-auto text-primary animate-pulse" />
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <h2 className="text-2xl font-black uppercase text-primary/40 tracking-[0.4em]">Say Hi</h2>
                                        <p className="text-[10px] font-mono text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
                                            Select a conversation from the directory to start messaging securely.
                                        </p>
                                    </div>
                                    
                                    <div className="pt-4 flex flex-col gap-2">
                                        <div className="text-[7px] font-black text-primary/20 uppercase tracking-widest">[ONLINE]</div>
                                        <div className="text-[7px] font-black text-primary/20 uppercase tracking-widest">[AWAITING MESSAGE]</div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(34, 197, 94, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(34, 197, 94, 0.5);
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </HackerLayout>
    );
}
