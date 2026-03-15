import { Head, Link, usePage } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Bookmark, CheckCircle, Plus, User } from 'lucide-react';

export default function EventsIndex({ events, filters, tags }) {
    const { auth } = usePage().props;

    return (
        <HackerLayout>
            <Head title="Event Radar" />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                    <h1 className="text-3xl font-black uppercase tracking-widest text-primary">&gt; EVENT_GRID</h1>
                    {auth.user && (
                        <Link href="/events/create" className="bg-primary/20 text-primary border border-primary px-6 py-2 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                             <Plus className="w-4 h-4" /> Initialize_Event
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-card border border-primary/20 p-4 mb-8 font-mono text-sm flex gap-4 overflow-x-auto">
                    <div className="text-muted-foreground mr-2 border-r border-border pr-4 py-1">QUERY_PARAMS:</div>
                    <Link href="/events" className={`px-3 py-1 border ${!filters.category ? 'border-primary text-primary bg-primary/10' : 'border-transparent hover:border-primary/50'}`}>ALL</Link>
                    <Link href="/events?category=event" className={`px-3 py-1 border ${filters.category === 'event' ? 'border-primary text-primary bg-primary/10' : 'border-transparent hover:border-primary/50'}`}>EVENTS</Link>
                    <Link href="/events?category=hackathon" className={`px-3 py-1 border ${filters.category === 'hackathon' ? 'border-primary text-primary bg-primary/10' : 'border-transparent hover:border-primary/50'}`}>HACKATHONS</Link>
                    <Link href="/events?category=workshop" className={`px-3 py-1 border ${filters.category === 'workshop' ? 'border-primary text-primary bg-primary/10' : 'border-transparent hover:border-primary/50'}`}>WORKSHOPS</Link>
                </div>

                {/* Event Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.data.map((event, idx) => (
                        <motion.div 
                            key={event.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-card border border-primary/30 p-5 group hover:border-primary transition-all relative overflow-hidden flex flex-col h-full"
                        >
                            {/* Decorative scanline on hover */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>

                            <div className="flex justify-between items-start mb-4">
                                <div className="text-xs font-mono text-primary border border-primary/50 px-2 py-0.5 uppercase">
                                    {event.category}
                                </div>
                                <div className="flex gap-2">
                                    <form action={`/events/${event.id}/save`} method="POST" className="inline">
                                        <input type="hidden" name="_token" value={usePage().props.csrf_token} />
                                        <button className="text-muted-foreground hover:text-primary hint-tooltip" title="Save Event">
                                            <Bookmark className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h2>
                            <p className="text-muted-foreground text-sm flex-1 mb-4 line-clamp-3 font-mono">
                                {event.description}
                            </p>

                            <div className="space-y-2 text-sm font-mono mt-auto border-t border-border pt-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                     <MapPin className="w-4 h-4" /> {event.city}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                     <Calendar className="w-4 h-4" />
                                    {new Date(event.event_date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                                </div>
                                 <div className="flex items-center gap-2 text-muted-foreground">
                                      <Users className="w-4 h-4" /> {event.attendees_count} nodes connected
                                 </div>
                                 <div className="flex items-center gap-2 text-primary/60 border-t border-primary/10 pt-2 mt-2">
                                      <User className="w-3 h-3" />
                                      <Link href={`/profile/${event.user.username}`} className="hover:underline">
                                          [BY: @{event.user.username}]
                                      </Link>
                                 </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {event.tags.map(tag => (
                                    <span key={tag.id} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 font-mono">
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>

                            <Link href={`/events/${event.id}`} className="mt-6 w-full text-center border border-border py-2 text-xs font-bold uppercase transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                                ACCESS_NODE //
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                {events.links && events.links.length > 3 && (
                    <div className="mt-12 flex justify-center gap-2 font-mono">
                        {events.links.map((link, k) => (
                             <Link
                                key={k}
                                href={link.url}
                                className={`px-4 py-2 border ${link.active ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                             />
                        ))}
                    </div>
                )}
            </div>
        </HackerLayout>
    );
}
