import { Head, Link, usePage } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Trophy, ChevronLeft, Globe, TerminalSquare, Bookmark, CheckCircle, Zap } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const hackerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function EventShow({ event }) {
    const { auth } = usePage().props;
    const isAttending = event.attendees?.some(a => a.id === auth.user?.id && a.pivot.attending);
    const isSaved = event.attendees?.some(a => a.id === auth.user?.id && a.pivot.saved);

    return (
        <HackerLayout>
            <Head title={event.title} />
            
            <div className="max-w-5xl mx-auto px-4 py-8">
                
                <Link href="/events" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono mb-6 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Events
                </Link>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card border-2 border-primary/50 relative overflow-hidden flex flex-col md:flex-row"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

                    <div className="p-8 md:w-2/3 flex flex-col relative z-10">
                        <div className="text-xs font-mono text-primary mb-4 border border-primary px-2 py-1 inline-block uppercase w-fit tracking-widest bg-primary/10">
                            Category: {event.category}
                        </div>
                        
                        <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase leading-tight">{event.title}</h1>
                        
                        <div className="flex flex-wrap gap-4 font-mono text-sm text-muted-foreground mb-8">
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {event.city}</span>
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(event.event_date).toLocaleString('en-GB')}</span>
                            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Organizer: {event.organizer}</span>
                        </div>

                        <div className="font-mono text-base leading-relaxed text-foreground/80 mb-8 whitespace-pre-line border-l-2 border-primary/30 pl-4 py-2">
                            {event.description}
                        </div>

                        <div className="mb-8">
                            <h3 className="text-sm font-bold uppercase text-primary mb-3 font-mono">/// TAGS</h3>
                            <div className="flex flex-wrap gap-2">
                                {event.tags.map(tag => (
                                    <span key={tag.id} className="text-xs bg-primary/20 text-primary px-2 py-1 font-mono uppercase">
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto flex flex-wrap gap-4 items-center">
                            {auth.user ? (
                                <>
                                    <form action={`/events/${event.id}/attend`} method="POST">
                                        <input type="hidden" name="_token" value={usePage().props.csrf_token} />
                                        <button className={`px-6 py-3 font-bold uppercase flex items-center gap-2 transition-all ${isAttending ? 'bg-primary/20 text-primary border border-primary' : 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]'}`}>
                                            {isAttending ? <CheckCircle className="w-5 h-5" /> : <TerminalSquare className="w-5 h-5" />}
                                            {isAttending ? 'Attending' : 'Attend Event'}
                                        </button>
                                    </form>
                                    <form action={`/events/${event.id}/save`} method="POST">
                                        <input type="hidden" name="_token" value={usePage().props.csrf_token} />
                                        <button className={`px-4 py-3 border border-primary/50 text-sm font-bold uppercase transition-colors flex items-center gap-2 ${isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:border-primary'}`}>
                                            {isSaved ? <Bookmark className="w-4 h-4 fill-primary" /> : <Bookmark className="w-4 h-4" />}
                                            {isSaved ? 'Saved' : 'Save Event'}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <Link href="/login" className="bg-primary text-primary-foreground px-6 py-3 font-bold uppercase transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]">
                                    Login to interact
                                </Link>
                            )}
                            {event.website && (
                                <a href={event.website} target="_blank" rel="noopener noreferrer" className="ml-auto text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-mono text-sm underline">
                                     <Globe className="w-4 h-4" /> Website
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Sidebar with Map & Stats */}
                    <div className="md:w-1/3 bg-black/40 border-l border-primary/30 p-6 font-mono flex flex-col">
                        <div className="border border-primary/20 bg-card/60 p-4 mb-6 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-2 h-2 bg-primary animate-ping m-2"></div>
                            <h3 className="text-xs text-muted-foreground uppercase mb-1">Grid Status</h3>
                            <div className="text-3xl font-bold text-primary flex items-end gap-2">
                                {event.attendees_count} <span className="text-sm font-normal text-muted-foreground mb-1">attending</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2 border-t border-border pt-2 flex items-center gap-1 justify-between">
                                <span>Contribution XP</span>
                                <span className="text-primary font-bold flex items-center"><Zap className="w-3 h-3 fill-primary mr-1" /> +10 XP</span>
                            </div>
                        </div>

                        {event.latitude && event.longitude && (
                            <div className="flex-1 min-h-[250px] border border-primary/30 relative">
                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-[400] opacity-40"></div>
                                
                                <MapContainer center={[event.latitude, event.longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                    />
                                    <Marker position={[event.latitude, event.longitude]} icon={hackerIcon} />
                                </MapContainer>
                            </div>
                        )}
                        
                        {event.latitude && (
                            <div className="text-[10px] text-muted-foreground mt-2 text-right opacity-50">
                                COORDS: {Number(event.latitude).toFixed(4)}, {Number(event.longitude).toFixed(4)}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </HackerLayout>
    );
}
