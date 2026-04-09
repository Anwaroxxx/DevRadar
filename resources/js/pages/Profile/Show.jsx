import { Head, Link, usePage, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Terminal, MapPin, Calendar, Users, Star, Award, Edit, Zap, Briefcase, Hash, MessageSquare, UserPlus, Lock, Shield, AlertTriangle, MoreVertical, X } from 'lucide-react';
import TechIcon from '@/components/TechIcon';
import AchievementIcon from '@/components/AchievementIcon';
import React from 'react';

const TRACK_LABELS = {
    welcome: 'Onboarding',
    signal: 'Activity',
    cartographer: 'Events',
    operator: 'Jobs',
    founder: 'Communities built',
    anchor: 'Communities joined',
    magnet: 'Followers',
    web: 'Following',
    archivist: 'Saved events',
    relay: 'Messages',
    pulse: 'Attendance',
};

export default function ProfileShow({ profileUser, isOwnProfile, achievementCatalog = [], achievementsData = [] }) {
    const { auth } = usePage().props;

    const [activeTab, setActiveTab] = React.useState('activity');
    const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
    const [reportReason, setReportReason] = React.useState('');
    const [reportDescription, setReportDescription] = React.useState('');
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const { hasBlocked, isBlocked } = usePage().props;

    const handleReport = (e) => {
        e.preventDefault();
        router.post(`/profile/${profileUser.id}/report`, {
            reason: reportReason,
            description: reportDescription
        }, {
            onSuccess: () => {
                setIsReportModalOpen(false);
                setReportReason('');
                setReportDescription('');
            }
        });
    };

    const tracksGrouped = React.useMemo(() => {
        const map = new Map();
        for (const row of achievementCatalog) {
            const t = row.track || 'other';
            if (!map.has(t)) map.set(t, []);
            map.get(t).push(row);
        }
        return Array.from(map.entries()).sort((a, b) => (a[0] || '').localeCompare(b[0] || ''));
    }, [achievementCatalog]);

    const earnedCount = achievementCatalog.filter((r) => r.earned).length;
    const totalCount = achievementCatalog.length;

    const accentMap = {
        primary: { 
            text: 'text-primary', 
            border: 'border-primary', 
            bg: 'bg-primary', 
            bgLight: 'bg-primary/10', 
            shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.1)]',
            glow: 'rgba(34,197,94,0.3)'
        },
        amber: { 
            text: 'text-amber-500', 
            border: 'border-amber-500', 
            bg: 'bg-amber-500', 
            bgLight: 'bg-amber-500/10', 
            shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)]',
            glow: 'rgba(245,158,11,0.3)'
        },
        cyan: { 
            text: 'text-cyan-400', 
            border: 'border-cyan-400', 
            bg: 'bg-cyan-400', 
            bgLight: 'bg-cyan-400/10', 
            shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.1)]',
            glow: 'rgba(34,211,238,0.3)'
        },
        rose: { 
            text: 'text-rose-500', 
            border: 'border-rose-500', 
            bg: 'bg-rose-500', 
            bgLight: 'bg-rose-500/10', 
            shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.1)]',
            glow: 'rgba(244,63,94,0.3)'
        },
        purple: { 
            text: 'text-purple-500', 
            border: 'border-purple-500', 
            bg: 'bg-purple-500', 
            bgLight: 'bg-purple-500/10', 
            shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.1)]',
            glow: 'rgba(168,85,247,0.3)'
        },
    };

    const accent = accentMap[profileUser.profile_accent_color] || accentMap.primary;
    const glowEnabled = profileUser.profile_glow_effect ?? true;

    return (
        <HackerLayout>
            <Head title={`${profileUser.name} (@${profileUser.username})`} />
            
            <div className="max-w-5xl mx-auto px-4 py-8">
                {isBlocked && (
                    <div className="bg-destructive/10 border-2 border-destructive p-12 text-center mb-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-destructive/5 animate-pulse pointer-events-none" />
                        <Lock className="w-16 h-16 text-destructive mx-auto mb-4" />
                        <h2 className="text-3xl font-black uppercase text-destructive tracking-widest mb-2">Profile Restricted</h2>
                        <p className="font-mono text-sm text-muted-foreground uppercase opacity-80">
                            Connection refused. This user has restricted their profile access.
                        </p>
                    </div>
                )}

                {!isBlocked && (
                    <>
                {hasBlocked && (
                    <div className="bg-yellow-500/10 border-2 border-yellow-500 p-6 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <Shield className="w-8 h-8 text-yellow-500" />
                            <div>
                                <div className="font-black uppercase text-yellow-500 tracking-widest">Access Restricted</div>
                                <div className="text-xs font-mono text-muted-foreground uppercase">You have blocked all communications with this user.</div>
                            </div>
                        </div>
                        <Link 
                            href={`/profile/${profileUser.id}/block`} 
                            method="post" 
                            as="button"
                            className="bg-yellow-500 text-black px-6 py-2 font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-all"
                        >
                            Unblock User
                        </Link>
                    </div>
                )}
                
                {/* Profile Header */}
                <div className="bg-card border-2 border-primary/50 relative overflow-hidden mb-8 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-center text-center md:text-left">
                    {/* Matrix overlay */}
                    <div className={`absolute inset-0 pointer-events-none ${
                        profileUser.profile_matrix_intensity === 'none' ? 'hidden' : 
                        profileUser.profile_matrix_intensity === 'low' ? 'opacity-[0.01]' :
                        profileUser.profile_matrix_intensity === 'high' ? 'opacity-[0.05]' : 'opacity-[0.03]'
                    } bg-[radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:20px_20px]`}></div>
                    
                    {/* Avatar Block */}
                    <div className="relative shrink-0 group focus:outline-none">
                        <div className={`w-32 h-32 border-2 ${accent.border} bg-card flex items-center justify-center text-5xl font-bold ${accent.text} uppercase z-10 relative overflow-hidden text-center ${glowEnabled ? `shadow-[0_0_20px_${accent.glow}]` : ''}`}>
                            {profileUser.avatar ? (
                                <img src={profileUser.avatar} alt={profileUser.username} className="w-full h-full object-cover" />
                            ) : (
                                profileUser.name.charAt(0)
                            )}
                            {/* Scanning line animation */}
                            <div className={`absolute top-0 left-0 w-full h-1 ${accent.bg}/80 transform translate-y-[-100%] group-hover:translate-y-[128px] transition-transform duration-[2s] ease-linear`}></div>
                        </div>
                        {/* Status dot */}
                        <div className={`absolute -bottom-2 -right-2 w-6 h-6 bg-card border-2 ${accent.border} flex items-center justify-center z-20`}>
                            <div className={`w-2 h-2 ${accent.bg} animate-pulse`}></div>
                        </div>
                    </div>

                    {/* User Info Block */}
                    <div className="flex-1 z-10 w-full">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-6">
                            <div className="flex flex-col items-center md:items-start">
                                <h1 className="text-4xl font-black uppercase text-foreground m-0 leading-none tracking-tight">{profileUser.name}</h1>
                                <div className={`text-lg font-mono ${accent.text} mt-1 flex items-center gap-2`}>
                                    @{profileUser.username}
                                    {profileUser.has_ai_access && (
                                        <span className={`text-[10px] ${accent.bg} text-primary-foreground px-2 py-0.5 font-bold animate-pulse tracking-widest`}>AI_ACCESS_ACTIVE</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap justify-center md:justify-end gap-3">
                                {!isOwnProfile && (
                                    <>
                                        <Link 
                                            href={`/chat/${profileUser.username}`} 
                                            className={`${accent.bgLight} ${accent.text} border ${accent.border} px-6 py-2 font-bold uppercase hover:${accent.bg} hover:text-primary-foreground transition-all flex items-center gap-2 text-sm ${glowEnabled ? accent.shadow : ''}`}
                                        >
                                            <MessageSquare className="w-4 h-4" /> SEND_MESSAGE
                                        </Link>
                                        <Link 
                                            href={`/profile/${profileUser.id}/follow`} 
                                            method="post" 
                                            as="button"
                                            className={`px-6 py-2 font-bold uppercase transition-all flex items-center gap-2 text-sm border ${
                                                usePage().props.isFollowing 
                                                ? 'bg-card text-muted-foreground border-border hover:border-destructive hover:text-destructive' 
                                                : `${accent.bgLight} ${accent.text} ${accent.border} hover:${accent.bg} hover:text-primary-foreground ${glowEnabled ? accent.shadow : ''}`
                                            }`}
                                        >
                                            <UserPlus className="w-4 h-4" /> {usePage().props.isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
                                        </Link>

                                        <div className="relative">
                                            <button 
                                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                                className="bg-card text-muted-foreground border border-border p-2 hover:border-primary hover:text-primary transition-all"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>

                                            {isMenuOpen && (
                                                <div className="absolute right-0 mt-2 w-48 bg-card border border-border shadow-2xl z-50 font-mono text-[10px] uppercase font-bold">
                                                    <Link 
                                                        href={`/profile/${profileUser.id}/block`} 
                                                        method="post" 
                                                        as="button"
                                                        className="w-full text-left px-4 py-3 hover:bg-destructive/10 hover:text-destructive flex items-center gap-2 transition-all border-b border-border/50 text-destructive"
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        <Shield className="w-3 h-3" /> {hasBlocked ? 'Unblock' : 'Block User'}
                                                    </Link>
                                                    <button 
                                                        className="w-full text-left px-4 py-3 hover:bg-primary/10 hover:text-primary flex items-center gap-2 transition-all"
                                                        onClick={() => {
                                                            setIsMenuOpen(false);
                                                            setIsReportModalOpen(true);
                                                        }}
                                                    >
                                                        <AlertTriangle className="w-3 h-3" /> Report User
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                                {isOwnProfile && (
                                    <>
                                        <Link href="/marketplace" className={`${accent.bgLight} ${accent.text} border ${accent.border} px-4 py-2 font-bold uppercase hover:${accent.bg} hover:text-primary-foreground transition-all flex items-center gap-2 text-sm ${glowEnabled ? accent.shadow : ''}`}>
                                             <Zap className="w-4 h-4" /> REWARDS
                                        </Link>
                                        <Link href="/profile/edit" className={`bg-card text-muted-foreground border border-border px-4 py-2 font-bold uppercase hover:${accent.border} hover:${accent.text} transition-all flex items-center gap-2 text-sm`}>
                                             <Edit className="w-4 h-4" /> Edit Profile
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-mono text-muted-foreground mb-6">
                            {profileUser.city && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profileUser.city}</span>}
                            {profileUser.github_url && (
                                <a href={profileUser.github_url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1 hover:${accent.text} transition-colors`}>
                                     <Hash className="w-4 h-4" /> Developer Hub
                                </a>
                            )}
                            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {profileUser.role}</span>
                        </div>

                        <div className={`${accent.bgLight} border-l-2 md:border-l-2 border-t-2 md:border-t-0 ${accent.border} p-4 md:p-3 font-mono text-sm max-w-2xl text-foreground/80 italic text-center md:text-left mx-auto md:mx-0`}>
                            "{profileUser.bio || "This user is still configuring their neural profile description."}"
                        </div>
                    </div>

                    {/* LEVEL_HUD_MODULE */}
                    <div className={`bg-black/80 border-2 ${accent.border} p-6 shrink-0 relative overflow-hidden z-10 w-full md:w-64 ${glowEnabled ? `shadow-[0_0_20px_${accent.glow}]` : ''}`}>
                        {/* Level Indicator Shell */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Level Ranking</span>
                            <span className={`text-[10px] font-mono font-black ${accent.text} animate-pulse`}>Lv.{profileUser.level}</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <div className={`text-5xl font-black ${accent.text} tracking-tighter mb-1 select-none`}>
                                {profileUser.xp}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-4">
                                Total XP Earned
                            </div>

                            {/* Level Title Badge */}
                            <div className={`w-full py-1.5 px-3 mb-4 bg-black border ${accent.border}/40 text-center relative group`}>
                                <div className={`absolute left-0 top-0 bottom-0 ${accent.bg}/20 w-1 group-hover:w-full transition-all duration-500`}></div>
                                <span className={`relative text-[10px] font-black uppercase tracking-tighter ${accent.text}`}>
                                    {profileUser.level_title}
                                </span>
                            </div>

                            {/* Progress Bar HUD */}
                            <div className="w-full space-y-1">
                                <div className="flex justify-between text-[8px] font-mono text-muted-foreground uppercase">
                                    <span>Level Progress</span>
                                    <span>{profileUser.xp_progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-black/60 border border-white/5 relative overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${profileUser.xp_progress}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full ${accent.bg} relative`}
                                    >
                                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
                                    </motion.div>
                                </div>
                                <div className="text-[7px] font-mono text-muted-foreground text-right uppercase mt-1">
                                    Next Level: {profileUser.next_level_xp} XP
                                </div>
                            </div>
                        </div>

                        <div className={`mt-6 pt-4 border-t ${accent.border}/20 grid grid-cols-2 gap-2 text-[10px] font-mono uppercase`}>
                            <div className="flex flex-col">
                                <span className="text-muted-foreground text-[8px]">Followers</span>
                                <span className={accent.text}>{profileUser.followers_count || 0}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-muted-foreground text-[8px]">Following</span>
                                <span className={accent.text}>{profileUser.following_count || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar: Skills & Badges */}
                    <div className="space-y-8 md:col-span-1">
                        {/* Skills */}
                        <div className={`bg-card border ${accent.border}/30 p-6 relative`}>
                            <h3 className={`text-xs font-black border-b border-border pb-2 mb-4 uppercase flex items-center gap-2 tracking-widest ${accent.text}`}>
                                 <Terminal className="w-3 h-3" /> Tech Stack
                            </h3>
                            {profileUser.skills?.length > 0 ? (
                                <div className="space-y-3">
                                    {profileUser.skills.map(skill => (
                                        <div key={skill.id} className="flex items-center gap-3 group">
                                            <TechIcon name={skill.name} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span className={`text-xs font-mono text-foreground/80 group-hover:${accent.text} transition-colors`}>{skill.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs font-mono text-muted-foreground">0 skills listed.</div>
                            )}
                        </div>

                        {/* Achievements (leveled tracks, Lucide icons) */}
                        {totalCount > 0 && (
                            <div className={`bg-card border ${accent.border}/30 p-6 relative overflow-hidden mb-6`}>
                                <div className={`absolute top-0 right-0 w-24 h-24 ${accent.bg}/[0.04] rounded-full blur-2xl pointer-events-none`} />
                                <h3 className={`text-xs font-black border-b border-border pb-2 mb-3 uppercase flex items-center justify-between gap-2 tracking-widest ${accent.text}`}>
                                    <span className="flex items-center gap-2"><Award className="w-3 h-3" /> Achievements</span>
                                    <span className="text-[10px] font-mono text-muted-foreground normal-case">
                                        {earnedCount}/{totalCount}
                                    </span>
                                </h3>
                                <p className="text-[10px] font-mono text-muted-foreground mb-4 leading-relaxed">
                                    Level up by shipping events, jobs, communities, DMs, saves, and showing up consistently.
                                </p>
                                <div className="space-y-5 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
                                    {tracksGrouped.map(([track, rows]) => (
                                        <div key={track} className="border border-border/60 bg-black/30 p-3">
                                            <div className="flex items-center justify-between mb-2 gap-2">
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${accent.text}/90`}>
                                                    {TRACK_LABELS[track] || track}
                                                </span>
                                                <span className="text-[9px] font-mono text-muted-foreground">
                                                    {rows.filter((r) => r.earned).length}/{rows.length} tiers
                                                </span>
                                            </div>
                                            <div className="flex gap-1.5 flex-wrap">
                                                {rows.map((tier) => (
                                                    <div
                                                        key={tier.id}
                                                        title={`${tier.name}\n${tier.description}`}
                                                        className={`relative flex-1 min-w-[72px] max-w-[100px] border px-2 py-2 transition-all ${
                                                            tier.earned
                                                                ? `${accent.border} ${accent.bgLight} shadow-[0_0_12px_rgba(34,197,94,0.12)]`
                                                                : 'border-border/50 bg-black/40 opacity-55'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-center mb-1">
                                                            {tier.earned ? (
                                                                <AchievementIcon name={tier.icon_key} className={`w-6 h-6 ${accent.text}`} />
                                                            ) : (
                                                                <Lock className="w-5 h-5 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <div className="text-[8px] font-black font-mono uppercase text-center leading-tight line-clamp-2 text-foreground/90">
                                                            L{tier.level}
                                                        </div>
                                                        <div className="text-[7px] font-mono text-muted-foreground text-center line-clamp-2 mt-0.5 leading-snug">
                                                            {tier.name}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Achievements System */}
                        {achievementsData.length > 0 && (
                            <div className="bg-card border border-primary/30 p-6 relative overflow-hidden mt-8">
                                <h3 className="text-xs font-black border-b border-border pb-2 mb-3 uppercase flex items-center justify-between gap-2 tracking-widest text-primary">
                                    <span className="flex items-center gap-2"><Star className="w-3 h-3 text-yellow-500" /> Milestones</span>
                                    <span className="text-[10px] font-mono text-muted-foreground normal-case">
                                        {achievementsData.filter(a => a.earned).length}/{achievementsData.length}
                                    </span>
                                </h3>
                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                                    {achievementsData.map(ach => (
                                        <div key={ach.id} className={`p-3 border flex gap-3 items-center ${ach.earned ? 'border-primary/50 bg-primary/10' : 'border-border/50 bg-card opacity-60'}`}>
                                            <div className="shrink-0 w-10 h-10 border border-primary/30 flex items-center justify-center bg-black/40">
                                                <AchievementIcon name={ach.icon || 'star'} className={`w-5 h-5 ${ach.earned ? 'text-primary' : 'text-muted-foreground'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-black uppercase text-foreground">{ach.name}</div>
                                                <div className="text-[9px] text-muted-foreground font-mono leading-tight mt-0.5">{ach.description}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Content: Tabs */}
                    <div className="md:col-span-3">
                        <div className="flex gap-4 border-b border-border/50 mb-8 font-mono overflow-x-auto pb-0.5 custom-scrollbar scrollbar-hide">
                            <button 
                                onClick={() => setActiveTab('activity')}
                                className={`pb-4 px-2 uppercase font-bold text-sm tracking-widest transition-all ${activeTab === 'activity' ? `border-b-2 ${accent.border} ${accent.text}` : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                [ FEED ]
                            </button>
                            <button 
                                onClick={() => setActiveTab('vault')}
                                className={`pb-4 px-2 uppercase font-bold text-sm tracking-widest transition-all ${activeTab === 'vault' ? `border-b-2 ${accent.border} ${accent.text}` : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                [ COLLECTION ]
                            </button>
                            <button 
                                onClick={() => setActiveTab('shop')}
                                className={`pb-4 px-2 uppercase font-bold text-sm tracking-widest transition-all ${activeTab === 'shop' ? `border-b-2 ${accent.border} ${accent.text}` : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                [ SHOP APEX ]
                            </button>
                            {isOwnProfile && (
                                <button 
                                    onClick={() => setActiveTab('inventory')}
                                    className={`pb-4 px-2 uppercase font-bold text-sm tracking-widest transition-all ${activeTab === 'inventory' ? `border-b-2 ${accent.border} ${accent.text}` : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    [ INVENTORY ]
                                </button>
                            )}
                        </div>

                        {activeTab === 'activity' ? (
                            <div className="space-y-8">
                                {/* Event History */}
                                <div className={`bg-card/30 border ${accent.border}/10 p-6`}>
                                    <h3 className="font-bold border-b border-border pb-2 mb-6 uppercase flex items-center gap-2 text-sm">
                                         <Calendar className={`w-4 h-4 ${accent.text}`} /> Events Created ({profileUser.events?.length || 0})
                                    </h3>
                                    {profileUser.events?.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {profileUser.events.map(event => (
                                                <div key={event.id} className={`group border border-border/50 p-4 hover:${accent.border} hover:${accent.bgLight} transition-all`}>
                                                    <div className="flex justify-between items-start">
                                                        <Link href={`/events/${event.id}`} className={`font-bold text-lg group-hover:${accent.text} transition-colors`}>
                                                            {event.title}
                                                        </Link>
                                                        <span className="text-[10px] font-mono text-muted-foreground uppercase px-2 py-0.5 border border-border">
                                                            {event.category}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground font-mono mt-2 flex items-center gap-4">
                                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.city}</span>
                                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(event.event_date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm font-mono text-muted-foreground opacity-50 py-12 text-center border-2 border-dashed border-border/30">
                                            No events created yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : activeTab === 'vault' ? (
                            <div className="space-y-6">
                                {/* Saved Events (Vault) */}
                                <div className={`bg-card/30 border ${accent.border}/10 p-6`}>
                                    <h3 className={`font-bold border-b border-border pb-2 mb-6 uppercase flex items-center gap-2 text-sm ${accent.text === 'text-primary' ? 'text-yellow-500' : 'text-current'}`}>
                                         <Star className="w-4 h-4" /> Saved Items ({profileUser.saved_events?.length || 0})
                                    </h3>
                                    {profileUser.saved_events?.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {profileUser.saved_events.map(event => (
                                                <Link key={event.id} href={`/events/${event.id}`} className={`block border border-border/50 p-4 hover:${accent.border}/50 hover:${accent.bgLight} transition-all group relative overflow-hidden`}>
                                                    <div className={`absolute top-0 right-0 w-8 h-8 ${accent.bgLight} flex items-center justify-center opacity-50 group-hover:opacity-100 italic font-bold text-[8px] ${accent.text} tracking-tighter`}>SAVED</div>
                                                    <div className={`font-bold group-hover:${accent.text} transition-colors truncate mb-1`}>{event.title}</div>
                                                    <div className="text-[10px] font-mono text-muted-foreground uppercase">{event.city} // {new Date(event.event_date).toLocaleDateString()}</div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm font-mono text-muted-foreground opacity-50 py-12 text-center border-2 border-dashed border-border/30">
                                            Collection is empty.
                                        </div>
                                    )}
                                </div>

                                {/* Joined Communities */}
                                <div className={`bg-card/30 border ${accent.border}/10 p-6`}>
                                    <h3 className="font-bold border-b border-border pb-2 mb-6 uppercase flex items-center gap-2 text-sm">
                                         <Users className={`w-4 h-4 ${accent.text}`} /> Communities
                                    </h3>
                                    {profileUser.followed_communities?.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {profileUser.followed_communities.map(comm => (
                                                <Link key={comm.id} href={`/communities`} className={`block border border-border p-3 hover:${accent.border} hover:${accent.bgLight} transition-all group text-center`}>
                                                    <div className={`font-bold group-hover:${accent.text} transition-colors truncate text-xs`}>{comm.name}</div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs font-mono text-muted-foreground opacity-50 py-4 text-center">
                                            No community affiliations yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : activeTab === 'shop' ? (
                            <div className="space-y-6">
                                <div className={`bg-card/30 border ${accent.border}/10 p-6`}>
                                    <h3 className="font-bold border-b border-border pb-2 mb-6 uppercase flex items-center gap-2 text-sm">
                                         <Zap className={`w-4 h-4 ${accent.text}`} /> Rewards
                                    </h3>
                                    {profileUser.marketplace_items?.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {profileUser.marketplace_items.map(item => (
                                                <div key={item.id} className={`block border border-border p-4 hover:${accent.border} hover:${accent.bgLight} transition-all relative`}>
                                                    <div className={`font-bold ${accent.text} truncate text-lg`}>{item.name}</div>
                                                    <div className="text-xs text-muted-foreground mb-3 font-mono">{item.description}</div>
                                                    <div className="flex justify-between items-center text-xs font-mono font-bold border-t border-border/50 pt-2">
                                                        <span>COST</span>
                                                        <span className={accent.text}>{item.price_xp} XP</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs font-mono text-muted-foreground opacity-50 py-12 text-center border-2 border-dashed border-border/30">
                                            Vendor has no items listed.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : activeTab === 'inventory' ? (
                            <div className="space-y-6">
                                <div className={`bg-card/30 border ${accent.border}/10 p-6`}>
                                    <h3 className="font-bold border-b border-border pb-2 mb-6 uppercase flex items-center gap-2 text-sm text-cyan-400">
                                         <Cpu className="w-4 h-4" /> Inventory
                                    </h3>
                                    {profileUser.marketplace_purchases?.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {profileUser.marketplace_purchases.map(purchase => (
                                                <div key={purchase.id} className="block border border-border p-4 bg-black/40">
                                                    <div className="font-bold text-cyan-400 truncate text-lg mb-1">
                                                        {purchase.item?.name || 'Unknown Module'}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground font-mono">
                                                        Redeemed on {new Date(purchase.created_at).toLocaleDateString()}
                                                    </div>
                                                    <div className={`text-[10px] ${accent.text}/60 font-mono mt-2 pt-2 border-t border-border/50`}>
                                                        Cost: {purchase.xp_spent} XP
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs font-mono text-muted-foreground opacity-50 py-12 text-center border-2 border-dashed border-border/30">
                                            Vault is empty. Visit Marketplace.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
                </>
                )}
            </div>

            {/* Report Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-card border-2 border-primary w-full max-w-md p-6 md:p-8 relative">
                        <button 
                            onClick={() => setIsReportModalOpen(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-black uppercase text-primary tracking-tighter mb-6 flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6" /> Report User
                        </h2>

                        <form onSubmit={handleReport} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-muted-foreground mb-2 tracking-widest">Report Category</label>
                                <select 
                                    className="w-full bg-black border border-border p-3 text-xs font-mono text-primary focus:border-primary outline-none"
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    required
                                >
                                    <option value="">-- SELECT TIER --</option>
                                    <option value="harassment">Harassment / Toxicity</option>
                                    <option value="spam">Spam / Bot Behavior</option>
                                    <option value="impersonation">Impersonation</option>
                                    <option value="inappropriate">Inappropriate Content</option>
                                    <option value="scam">Scam / Fraud</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-muted-foreground mb-2 tracking-widest">Description</label>
                                <textarea 
                                    className="w-full bg-black border border-border p-3 text-xs font-mono text-foreground focus:border-primary outline-none h-32 resize-none"
                                    placeholder="Provide encrypted details for moderation units..."
                                    value={reportDescription}
                                    onChange={(e) => setReportDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-primary text-black py-3 font-black uppercase tracking-[0.2em] text-sm hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                            >
                                Submit Report
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </HackerLayout>
    );
}
