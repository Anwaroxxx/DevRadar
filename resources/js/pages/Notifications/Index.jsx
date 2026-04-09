import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Bell, Trash2, CheckCircle, ExternalLink, Activity, Radio, UserPlus, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsIndex({ notifications }) {
    
    const markAsRead = (id) => {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const markAllAsRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    const deleteNotification = (id) => {
        router.delete(`/notifications/${id}`, { preserveScroll: true });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'follow': return <UserPlus className="w-5 h-5 text-primary" />;
            case 'achievement': return <Zap className="w-5 h-5 text-yellow-500" />;
            case 'system': return <Activity className="w-5 h-5 text-cyan-500" />;
            default: return <Radio className="w-5 h-5 text-primary" />;
        }
    };

    return (
        <HackerLayout>
            <Head title="Notifications" />
            
            <div className="max-w-4xl mx-auto px-4 py-12 font-mono">
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-primary/30 pb-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase text-primary flex items-center gap-3 tracking-tighter">
                            <Bell className="w-10 h-10" /> Notifications
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2 uppercase tracking-[0.3em]">
                            System updates and activity logs.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={markAllAsRead}
                            className="text-[10px] font-black uppercase text-primary border border-primary/50 px-4 py-2 hover:bg-primary/20 transition-all tracking-widest flex items-center gap-2"
                        >
                            <CheckCircle className="w-3 h-3" /> Mark All as Read
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {notifications.data.length > 0 ? (
                            notifications.data.map((notification, idx) => (
                                <motion.div 
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`relative group bg-card border-l-4 p-6 transition-all hover:bg-white/5 ${
                                        notification.read_at ? 'border-border/30 opacity-60' : 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(34,197,94,0.05)]'
                                    }`}
                                >
                                    <div className="flex gap-6 items-start">
                                        {/* Icon & Status */}
                                        <div className="shrink-0 pt-1">
                                            <div className="w-10 h-10 bg-black/40 border border-border flex items-center justify-center relative">
                                                {getIcon(notification.data.type)}
                                                {!notification.read_at && (
                                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary animate-pulse" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    [{notification.data.type || 'ACTIVITY'}] // {new Date(notification.created_at).toLocaleString()}
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!notification.read_at && (
                                                        <button 
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="p-1.5 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                                                            title="Mark as Read"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-1.5 text-destructive hover:bg-destructive/20 transition-colors border border-destructive/20"
                                                        title="Delete Notification"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-foreground text-sm font-bold leading-relaxed mb-4">
                                                {notification.data.message}
                                            </div>

                                            {notification.data.action_url && (
                                                <Link 
                                                    href={notification.data.action_url}
                                                    onClick={() => !notification.read_at && markAsRead(notification.id)}
                                                    className="inline-flex items-center gap-2 text-[10px] font-black text-primary border border-primary/30 px-3 py-1.5 hover:bg-primary hover:text-black transition-all uppercase tracking-widest"
                                                >
                                                    View Details <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {/* Background decorative elements */}
                                    <div className="absolute top-0 right-0 p-2 pointer-events-none opacity-[0.02]">
                                        <div className="text-8xl font-black">{idx + 1}</div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-24 text-center border-2 border-dashed border-border/30 bg-card/20"
                            >
                                <Radio className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest">No new notifications.</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Pagination */}
                {notifications.links && notifications.links.length > 3 && (
                    <div className="mt-12 flex justify-center gap-2">
                        {notifications.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-4 py-2 border text-xs font-black uppercase transition-all ${
                                    link.active 
                                    ? 'bg-primary text-black border-primary' 
                                    : 'bg-card text-muted-foreground border-border/50 hover:border-primary/50'
                                } ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </HackerLayout>
    );
}
