import { Head, Link, usePage } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Terminal, MapPin, Calendar, Users, Star, Award, Edit, Zap, Briefcase, Hash, MessageSquare, UserPlus } from 'lucide-react';
import TechIcon from '@/components/TechIcon';
import React from 'react';

export default function ProfileShow({ profileUser, isOwnProfile }) {
    const { auth } = usePage().props;

    const [activeTab, setActiveTab] = React.useState('activity');

    return (
        <HackerLayout>
            <Head title={`${profileUser.name} (@${profileUser.username})`} />
            
            <div className="max-w-5xl mx-auto px-4 py-8">
                
                {/* Profile Header */}
                <div className="bg-card border-2 border-primary/50 relative overflow-hidden mb-8 p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                    {/* Matrix overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:20px_20px]"></div>
                    
                    {/* Avatar Block */}
                    <div className="relative shrink-0 group focus:outline-none">
                        <div className="w-32 h-32 border-2 border-primary bg-card flex items-center justify-center text-5xl font-bold text-primary uppercase shadow-[0_0_20px_rgba(34,197,94,0.3)] z-10 relative overflow-hidden text-center">
                            {profileUser.avatar ? (
                                <img src={profileUser.avatar} alt={profileUser.username} className="w-full h-full object-cover" />
                            ) : (
                                profileUser.name.charAt(0)
                            )}
                            {/* Scanning line animation */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary/80 transform translate-y-[-100%] group-hover:translate-y-[128px] transition-transform duration-[2s] ease-linear"></div>
                        </div>
                        {/* Status dot */}
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-card border-2 border-primary flex items-center justify-center z-20">
                            <div className="w-2 h-2 bg-primary animate-pulse"></div>
                        </div>
                    </div>

                    {/* User Info Block */}
                    <div className="flex-1 z-10">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                            <div>
                                <h1 className="text-4xl font-black uppercase text-foreground m-0 leading-none tracking-tight">{profileUser.name}</h1>
                                <div className="text-lg font-mono text-primary mt-1 flex items-center gap-2">
                                    @{profileUser.username}
                                    {profileUser.has_ai_access && (
                                        <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 font-bold animate-pulse tracking-widest">AI_ACCESS_ACTIVE</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                {!isOwnProfile && (
                                    <>
                                        <Link 
                                            href={`/chat/${profileUser.username}`} 
                                            className="bg-primary/20 text-primary border border-primary px-6 py-2 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                                        >
                                            <MessageSquare className="w-4 h-4" /> INITIALIZE_MESSAGE
                                        </Link>
                                        <Link 
                                            href={`/profile/${profileUser.id}/follow`} 
                                            method="post" 
                                            as="button"
                                            className={`px-6 py-2 font-bold uppercase transition-all flex items-center gap-2 text-sm border ${
                                                usePage().props.isFollowing 
                                                ? 'bg-card text-muted-foreground border-border hover:border-destructive hover:text-destructive' 
                                                : 'bg-primary/10 text-primary border-primary hover:bg-primary hover:text-primary-foreground shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                                            }`}
                                        >
                                            <UserPlus className="w-4 h-4" /> {usePage().props.isFollowing ? 'SEVER_CONNECTION' : 'FOLLOW_NODE'}
                                        </Link>
                                    </>
                                )}
                                {isOwnProfile && (
                                    <>
                                        <Link href="/marketplace" className="bg-primary/20 text-primary border border-primary px-4 py-2 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 text-sm shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                             <Zap className="w-4 h-4" /> REWARDS
                                        </Link>
                                        <Link href="/profile/edit" className="bg-card text-muted-foreground border border-border px-4 py-2 font-bold uppercase hover:border-primary hover:text-primary transition-all flex items-center gap-2 text-sm">
                                             <Edit className="w-4 h-4" /> EDIT_PROFILE
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm font-mono text-muted-foreground mb-4">
                            {profileUser.city && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profileUser.city}</span>}
                            {profileUser.github_url && (
                                <a href={profileUser.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                                     <Hash className="w-4 h-4" /> Developer Hub
                                </a>
                            )}
                            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {profileUser.role}</span>
                        </div>

                        <div className="bg-primary/10 border-l-2 border-primary p-3 font-mono text-sm max-w-2xl text-foreground/80 italic">
                            "{profileUser.bio || "This user is still configuring their neural profile description."}"
                        </div>
                    </div>

                    {/* XP Module */}
                    <div className="bg-black/50 border border-primary p-4 shrink-0 text-center z-10 w-full md:w-48 shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]">
                        <div className="text-xs font-mono text-muted-foreground uppercase mb-2">Dev_Score</div>
                        <div className="text-4xl font-bold text-primary flex justify-center items-center gap-2">
                            {profileUser.xp} <Zap className="w-6 h-6 fill-primary" />
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-2 font-mono uppercase tracking-widest">
                            Rank: {profileUser.xp > 1000 ? 'Architect' : profileUser.xp > 500 ? 'Developer' : 'Beginner'}
                        </div>
                        <div className="mt-4 pt-4 border-t border-primary/20 grid grid-cols-2 gap-2 text-[10px] font-mono uppercase">
                            <div className="text-muted-foreground">Followers: <span className="text-primary">{profileUser.followers_count || 0}</span></div>
                            <div className="text-muted-foreground">Following: <span className="text-primary">{profileUser.following_count || 0}</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar: Skills & Badges */}
                    <div className="space-y-8 md:col-span-1">
                        {/* Skills */}
                        <div className="bg-card border border-primary/30 p-6 relative">
                            <h3 className="text-xs font-black border-b border-border pb-2 mb-4 uppercase flex items-center gap-2 tracking-widest text-primary">
                                 <Terminal className="w-3 h-3" /> TECH_STACK
                            </h3>
                            {profileUser.skills?.length > 0 ? (
                                <div className="space-y-3">
                                    {profileUser.skills.map(skill => (
                                        <div key={skill.id} className="flex items-center gap-3 group">
                                            <TechIcon name={skill.name} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-mono text-foreground/80 group-hover:text-primary transition-colors">{skill.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs font-mono text-muted-foreground">0 skills listed.</div>
                            )}
                        </div>

                        {/* Badges */}
                        <div className="bg-card border border-primary/30 p-6 relative">
                            <h3 className="text-xs font-black border-b border-border pb-2 mb-4 uppercase flex items-center gap-2 tracking-widest text-primary">
                                 <Award className="w-3 h-3" /> ACHIEVEMENTS
                            </h3>
                            {profileUser.badges?.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {profileUser.badges.map(badge => (
                                        <div key={badge.id} className="text-center p-2 border border-border hover:border-primary/50 bg-black/40 group relative overflow-hidden" title={badge.description}>
                                            <div className="text-2xl mb-1 grayscale group-hover:grayscale-0 transition-all scale-90 group-hover:scale-100 z-10 relative">{badge.icon}</div>
                                            <div className="text-[8px] font-black font-mono text-muted-foreground group-hover:text-primary truncate uppercase leading-none">
                                                {badge.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs font-mono text-muted-foreground">No badges earned.</div>
                            )}
                        </div>
                    </div>

                    {/* Main Content: Tabs */}
                    <div className="md:col-span-3">
                        <div className="flex gap-4 border-b border-border/50 mb-8 font-mono">
                            <button 
                                onClick={() => setActiveTab('activity')}
                                className={`pb-4 px-2 uppercase font-bold text-sm tracking-widest transition-all ${activeTab === 'activity' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                [ FEED ]
                            </button>
                            <button 
                                onClick={() => setActiveTab('vault')}
                                className={`pb-4 px-2 uppercase font-bold text-sm tracking-widest transition-all ${activeTab === 'vault' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                [ COLLECTION ]
                            </button>
                        </div>

                        {activeTab === 'activity' ? (
                            <div className="space-y-8">
                                {/* Event History */}
                                <div className="bg-card/30 border border-primary/10 p-6">
                                    <h3 className="font-bold border-b border-border pb-2 mb-6 uppercase flex items-center gap-2 text-sm">
                                         <Calendar className="w-4 h-4 text-primary" /> CREATED_EVENTS ({profileUser.events?.length || 0})
                                    </h3>
                                    {profileUser.events?.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {profileUser.events.map(event => (
                                                <div key={event.id} className="group border border-border/50 p-4 hover:border-primary hover:bg-primary/5 transition-all">
                                                    <div className="flex justify-between items-start">
                                                        <Link href={`/events/${event.id}`} className="font-bold text-lg group-hover:text-primary transition-colors">
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
                        ) : (
                            <div className="space-y-6">
                                {/* Saved Events (Vault) */}
                                <div className="bg-card/30 border border-primary/10 p-6">
                                    <h3 className="font-bold border-b border-border pb-2 mb-6 uppercase flex items-center gap-2 text-sm text-yellow-500">
                                         <Star className="w-4 h-4" /> SAVED_ITEMS ({profileUser.saved_events?.length || 0})
                                    </h3>
                                    {profileUser.saved_events?.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {profileUser.saved_events.map(event => (
                                                <Link key={event.id} href={`/events/${event.id}`} className="block border border-border/50 p-4 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all group relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-500/10 flex items-center justify-center opacity-50 group-hover:opacity-100 italic font-bold text-[8px] text-yellow-500 tracking-tighter">SAVED</div>
                                                    <div className="font-bold group-hover:text-yellow-500 transition-colors truncate mb-1">{event.title}</div>
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
                                <div className="bg-card/30 border border-primary/10 p-6">
                                    <h3 className="font-bold border-b border-border pb-2 mb-6 uppercase flex items-center gap-2 text-sm">
                                         <Users className="w-4 h-4 text-primary" /> COMMUNITIES_JOINED
                                    </h3>
                                    {profileUser.followed_communities?.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {profileUser.followed_communities.map(comm => (
                                                <Link key={comm.id} href={`/communities`} className="block border border-border p-3 hover:border-primary hover:bg-primary/5 transition-all group text-center">
                                                    <div className="font-bold group-hover:text-primary transition-colors truncate text-xs">{comm.name}</div>
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
                        )}
                    </div>
                </div>
            </div>
        </HackerLayout>
    );
}
