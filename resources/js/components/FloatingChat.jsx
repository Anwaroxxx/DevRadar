import React, { useState, useEffect, useRef } from 'react';
import { usePage, Link, useForm } from '@inertiajs/react';
import { MessageSquare, X, Send, ChevronLeft, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function FloatingChat() {
    const { auth } = usePage().props;
    if (!auth?.user) return null;

    // View states: 'inbox' | 'chat'
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('inbox'); // 'inbox' or 'chat'

    // Per-conversation message map: { [userId]: { user, messages, unread } }
    const [conversations, setConversations] = useState({});
    const [activeUserId, setActiveUserId] = useState(null);

    // Global unread counter (sum of all conversation unreads)
    const [totalUnread, setTotalUnread] = useState(auth.user.unread_dm_count || 0);

    // Typing indicator for active chat
    const [isRemoteTyping, setIsRemoteTyping] = useState(false);

    // Toast for incoming messages when closed
    const [toastMsg, setToastMsg] = useState(null);
    const toastTimerRef = useRef(null);

    const scrollRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({ content: '' });

    // Helpers
    const getConv = (userId) => conversations[userId] || { user: null, messages: [], unread: 0 };

    const upsertMessage = (senderId, senderObj, message, incrementUnread = false) => {
        setConversations(prev => {
            const existing = prev[senderId] || { user: senderObj, messages: [], unread: 0 };
            // Dedup by id
            if (existing.messages.find(m => m.id === message.id)) return prev;
            return {
                ...prev,
                [senderId]: {
                    ...existing,
                    user: senderObj || existing.user,
                    messages: [...existing.messages, message],
                    unread: incrementUnread ? existing.unread + 1 : existing.unread,
                    lastAt: message.created_at,
                }
            };
        });
    };

    // WebSocket listener
    useEffect(() => {
        const channel = window.Echo.private(`chat.${auth.user.id}`)
            .listen('MessageSent', (e) => {
                const msg = e.message;
                const sender = msg.sender || { id: msg.sender_id, username: 'Unknown', name: 'Unknown', avatar: null };
                const senderId = msg.sender_id;
                const isViewingThisChat = isOpen && view === 'chat' && activeUserId === senderId;

                upsertMessage(senderId, sender, msg, !isViewingThisChat);

                if (!isViewingThisChat) {
                    setTotalUnread(prev => prev + 1);

                    // Toast notification
                    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
                    setToastMsg({ username: sender.username, userId: senderId, sender });
                    toastTimerRef.current = setTimeout(() => setToastMsg(null), 5000);
                }
            })
            .listen('.user.typing', (e) => {
                if (activeUserId === e.sender_id) {
                    setIsRemoteTyping(e.is_typing);
                    if (e.is_typing) {
                        setTimeout(() => setIsRemoteTyping(false), 3500);
                    }
                }
            });

        return () => window.Echo.leave(`chat.${auth.user.id}`);
    }, [auth.user.id, isOpen, view, activeUserId]);

    // Auto-scroll on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversations, activeUserId, view]);

    // Open a specific conversation
    const openChat = (userId) => {
        // Mark as read
        setConversations(prev => {
            if (!prev[userId]) return prev;
            const unread = prev[userId].unread || 0;
            setTotalUnread(t => Math.max(0, t - unread));
            return { ...prev, [userId]: { ...prev[userId], unread: 0 } };
        });
        setActiveUserId(userId);
        setIsRemoteTyping(false);
        setView('chat');
    };

    // Send message
    const handleSend = (e) => {
        e.preventDefault();
        if (!data.content.trim() || !activeUserId || processing) return;

        const conv = getConv(activeUserId);
        post(`/chat/${activeUserId}`, {
            onSuccess: () => {
                const newMessage = {
                    id: Date.now(),
                    sender_id: auth.user.id,
                    receiver_id: parseInt(activeUserId),
                    content: data.content,
                    created_at: new Date().toISOString(),
                };
                upsertMessage(auth.user.id + '_to_' + activeUserId, null, newMessage);
                // Actually insert into the conversation from the sender's perspective
                setConversations(prev => {
                    const existing = prev[activeUserId] || { user: conv.user, messages: [], unread: 0 };
                    return {
                        ...prev,
                        [activeUserId]: {
                            ...existing,
                            messages: [...existing.messages, newMessage],
                            lastAt: newMessage.created_at,
                        }
                    };
                });
                reset();
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    // Sort conversations by latest activity
    const sortedConvs = Object.entries(conversations).sort(([, a], [, b]) => {
        return new Date(b.lastAt || 0) - new Date(a.lastAt || 0);
    });

    const activeConv = activeUserId ? getConv(activeUserId) : null;

    return (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] font-mono">
            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="chat-panel"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] md:w-80 h-[480px] max-h-[70vh] md:max-h-[480px] bg-black/95 border-2 border-primary/40 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-3 border-b border-primary/20 bg-primary/10 flex items-center gap-2 shrink-0">
                            {view === 'chat' && (
                                <button
                                    onClick={() => { setView('inbox'); setActiveUserId(null); }}
                                    className="text-primary/60 hover:text-primary mr-1"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                            )}
                            <MessageSquare className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary flex-1 truncate">
                                {view === 'chat' && activeConv?.user
                                    ? `@${activeConv.user.username}`
                                    : 'Messages'}
                            </span>
                            {view === 'chat' && activeConv?.user && (
                                <Link
                                    href={`/chat/${activeConv.user.username}`}
                                    onClick={() => setIsOpen(false)}
                                    className="text-[8px] text-primary/40 hover:text-primary border border-primary/20 px-1.5 py-0.5 shrink-0"
                                >
                                    FULL VIEW
                                </Link>
                            )}
                            <button onClick={() => setIsOpen(false)} className="text-primary/60 hover:text-primary shrink-0 ml-auto">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* INBOX VIEW */}
                        <AnimatePresence mode="wait">
                            {view === 'inbox' && (
                                <motion.div
                                    key="inbox"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex-1 flex flex-col overflow-hidden"
                                >
                                    {sortedConvs.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-40 p-6 text-center">
                                            <MessageSquare className="w-10 h-10 text-primary/20" />
                                            <p className="text-[9px] uppercase tracking-widest leading-relaxed">
                                                No conversations yet.<br />
                                                Visit <Link href="/chat" onClick={() => setIsOpen(false)} className="text-primary underline">Chat</Link> to start messaging.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-y-auto">
                                            {sortedConvs.map(([userId, conv]) => (
                                                <button
                                                    key={userId}
                                                    onClick={() => openChat(userId)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 border-b border-primary/10 hover:bg-primary/5 transition-colors text-left group"
                                                >
                                                    {/* Avatar */}
                                                    <div className="w-9 h-9 border border-primary/30 bg-black shrink-0 flex items-center justify-center overflow-hidden">
                                                        {conv.user?.avatar
                                                            ? <img src={conv.user.avatar} className="w-full h-full object-cover" />
                                                            : <span className="text-primary font-black uppercase text-sm">
                                                                {(conv.user?.name || conv.user?.username || '?')[0]}
                                                              </span>
                                                        }
                                                    </div>
                                                    {/* Name & last msg */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[10px] font-black uppercase text-foreground/80 group-hover:text-primary transition-colors truncate">
                                                                {conv.user?.name || conv.user?.username || 'Unknown'}
                                                            </span>
                                                            {conv.unread > 0 && (
                                                                <span className="ml-2 shrink-0 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center text-[9px] font-black bg-primary text-black rounded-none">
                                                                    {conv.unread > 9 ? '9+' : conv.unread}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {conv.messages.length > 0 && (
                                                            <p className="text-[9px] text-muted-foreground/50 truncate mt-0.5">
                                                                {conv.messages[conv.messages.length - 1]?.content || ''}
                                                            </p>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {/* Footer link */}
                                    <div className="p-2 border-t border-primary/10 shrink-0">
                                        <Link
                                            href="/chat"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full text-center text-[9px] uppercase tracking-widest text-primary/40 hover:text-primary transition-colors py-1"
                                        >
                                            Open Full Chat Directory →
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {/* CHAT VIEW */}
                            {view === 'chat' && activeConv && (
                                <motion.div
                                    key={`chat-${activeUserId}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex-1 flex flex-col overflow-hidden"
                                >
                                    {/* Typing indicator */}
                                    <AnimatePresence>
                                        {isRemoteTyping && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="px-4 py-1.5 text-[9px] text-primary/60 italic border-b border-primary/10"
                                            >
                                                {activeConv.user?.username} is typing...
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Messages */}
                                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 text-[10px]">
                                        {activeConv.messages.length === 0 && (
                                            <div className="text-center text-primary/30 uppercase text-[9px] mt-8">
                                                Send the first message!
                                            </div>
                                        )}
                                        {activeConv.messages.map((msg, i) => {
                                            const isMe = msg.sender_id === auth.user.id;
                                            return (
                                                <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[78%] px-2.5 py-1.5 text-[10px] leading-relaxed border ${
                                                        isMe
                                                            ? 'bg-primary/10 border-primary/30 text-primary'
                                                            : 'bg-card border-primary/10 text-foreground'
                                                    }`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Input */}
                                    <form onSubmit={handleSend} className="p-3 border-t border-primary/20 bg-black/60 flex gap-2 shrink-0">
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            className="flex-1 bg-black border border-primary/20 px-2 py-1.5 text-[10px] focus:border-primary outline-none placeholder:text-primary/20"
                                            value={data.content}
                                            onChange={e => setData('content', e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing || !data.content.trim()}
                                            className="p-1.5 border border-primary/30 text-primary hover:bg-primary/20 disabled:opacity-30 transition-colors"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    setIsOpen(o => !o);
                    if (!isOpen) {
                        // Don't reset totalUnread yet — let them see the inbox
                    }
                }}
                className={`w-14 h-14 rounded-none border-2 flex items-center justify-center relative transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
                    isOpen
                        ? 'bg-primary border-primary text-black'
                        : 'bg-black border-primary/60 text-primary hover:border-primary'
                }`}
            >
                <MessageSquare className={`w-6 h-6 ${isOpen ? '' : 'animate-pulse'}`} />

                {totalUnread > 0 && !isOpen && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 border border-white shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                        {totalUnread > 99 ? '99+' : totalUnread}
                    </span>
                )}

                {/* Decorative Corners */}
                <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${isOpen ? 'border-black' : 'border-primary'}`}></div>
                <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${isOpen ? 'border-black' : 'border-primary'}`}></div>
            </motion.button>

            {/* Toast Notification (clickable, opens inbox or direct chat) */}
            <AnimatePresence>
                {toastMsg && !isOpen && (
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onClick={() => {
                            setIsOpen(true);
                            setView('chat');
                            openChat(toastMsg.userId);
                            setToastMsg(null);
                        }}
                        className="absolute bottom-4 right-20 whitespace-nowrap bg-indigo-950/90 border border-primary text-primary px-4 py-2 font-black uppercase text-[10px] tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-md z-[90] hover:bg-primary hover:text-black transition-colors flex items-center gap-2"
                    >
                        <Circle className="w-2 h-2 fill-primary animate-pulse" />
                        New msg from @{toastMsg.username}
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
