import { Head, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Terminal, Plus, Activity, Cpu, Zap, Eye, Database, MapPin } from 'lucide-react';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom Hacker marker
const hackerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function Home({ stats, upcomingEvents, mapEvents, auth }) {
    return (
        <HackerLayout>
            <Head title="Home" />

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
                
                {/* Hero Section */}
                <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-2 border-primary/40 bg-card p-6 md:p-10 relative overflow-hidden group shadow-[0_0_50px_rgba(34,197,94,0.05)]"
                >
                    {/* Hero Background Noise */}
                    <div className="absolute inset-0 pointer-events-none digital-noise opacity-[0.07] z-0"></div>
                    
                    <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="h-0.5 w-12 bg-primary"></span>
                                <span className="text-primary font-mono text-xs font-black tracking-[0.3em]">INITIALIZING_PROTOCOL...</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter neon-text leading-tight">
                                SYS.<span className="text-white">INIT</span>()_
                            </h1>
                            <p className="text-lg text-muted-foreground mb-10 max-w-2xl font-mono leading-relaxed border-l-2 border-primary/20 pl-6 py-2">
                                Welcome to <span className="text-primary font-bold">DevRadar Morocco</span>. The centralized intelligence hub for the network. 
                                Track nodes, execute career updates, and synchronize with the cluster.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono mb-8">
                                <div className="border border-primary/20 p-4 bg-primary/5 relative">
                                    <div className="text-3xl font-black text-primary">{stats.events}</div>
                                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Active_Events</div>
                                </div>
                                <div className="border border-primary/20 p-4 bg-primary/5 relative">
                                    <div className="text-3xl font-black text-primary">{stats.jobs}</div>
                                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Open_Job_Pings</div>
                                </div>
                                <div className="border border-primary/20 p-4 bg-primary/5 relative">
                                    <div className="text-3xl font-black text-primary">{stats.communities}</div>
                                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Sync_Active_Nodes</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Access Terminal */}
                        <div className="w-full lg:w-80 space-y-4">
                            <div className="bg-black/60 border border-primary/30 p-4 font-mono text-xs">
                                <div className="flex items-center gap-2 mb-4 text-primary font-bold border-b border-primary/20 pb-2">
                                    <Terminal className="w-4 h-4" /> QUICK_ACTIONS.EXE
                                </div>
                                <div className="space-y-2">
                                    <Link href="/events/create" className="flex items-center justify-between p-2 border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all group">
                                        <span>&gt; INIT_EVENT</span>
                                        <Plus className="w-3 h-3 text-primary" />
                                    </Link>
                                    <Link href="/communities/create" className="flex items-center justify-between p-2 border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all group">
                                        <span>&gt; SYNC_CLUSTER</span>
                                        <Plus className="w-3 h-3 text-primary" />
                                    </Link>
                                    <Link href="/jobs/create" className="flex items-center justify-between p-2 border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all group">
                                        <span>&gt; PUSH_CAREER</span>
                                        <Plus className="w-3 h-3 text-primary" />
                                    </Link>
                                    <Link href="/ai/chat" className="flex items-center justify-between p-2 border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all group">
                                        <span>&gt; AI_ASSIST</span>
                                        <Activity className="w-3 h-3 text-primary" />
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border border-primary/30 text-[10px] font-mono">
                                <span className="text-primary animate-pulse">STATUS: ONLINE</span>
                                <span className="text-primary/60">LVL: {auth?.user?.xp || 0} XP</span>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Map Section */}
                <section className="relative group">
                    <div className="flex justify-between items-end mb-4 border-b border-primary/30 pb-2 relative z-10">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-primary neon-text">
                                [ RADAR_OS // GRID_VIEW ]
                            </h2>
                            <div className="hidden md:flex gap-2 text-[10px] font-mono text-primary/40">
                                <span>SEC_LAYER: 0x4F</span>
                                <span>PING: 14ms</span>
                                <span>UPTIME: 99.9%</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono">
                             <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-primary/60">SCANNING_SATELLITE_FEED...</span>
                             </div>
                        </div>
                    </div>
                    
                    <div className="relative z-0">
                        {/* Map HUD Borders */}
                        <div className="absolute -inset-1 border border-primary/20 pointer-events-none z-50"></div>
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary z-50"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary z-50"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary z-50"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary z-50"></div>
                        
                        <div className="border border-primary/50 h-[500px] w-full relative shadow-[0_0_30px_rgba(34,197,94,0.1)] overflow-hidden">
                            {/* Inner Scanning Effect */}
                            <div className="absolute inset-0 pointer-events-none z-[400] bg-[linear-gradient(transparent_0%,rgba(34,197,94,0.05)_50%,transparent_100%)] bg-[length:100%_200%] animate-[scan_4s_linear_infinite]"></div>
                            
                            <MapContainer center={[31.7917, -7.0926]} zoom={6} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                />
                                {mapEvents.filter(event => event.latitude && event.longitude).map(event => (
                                    <Marker key={event.id} position={[event.latitude, event.longitude]} icon={hackerIcon}>
                                        <Popup>
                                            <div className="font-mono bg-black text-primary p-3 border-2 border-primary shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                                <div className="text-[10px] text-primary/60 mb-1 border-b border-primary/20 pb-1 flex justify-between">
                                                    <span>TARGET_IDENTIFIED</span>
                                                    <span>ID:{event.id}</span>
                                                </div>
                                                <div className="font-black text-lg uppercase mb-2 tracking-tight">{event.title}</div>
                                                <div className="space-y-1 text-xs mb-4">
                                                    <div className="flex gap-2"><span>CITY:</span> <span className="text-white">{event.city}</span></div>
                                                    <div className="flex gap-2"><span>TYPE:</span> <span className="text-white">{event.category}</span></div>
                                                </div>
                                                <Link href={`/events/${event.id}`} className="block w-full text-center bg-primary text-black font-black uppercase text-xs py-2 hover:bg-white transition-colors">
                                                    &gt; EXECUTE_OVERRIDE
                                                </Link>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                </section>

                {/* Upcoming Events */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Database className="w-5 h-5 text-primary" />
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">&gt; Upcoming_Tasks</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.map((event, idx) => (
                            <motion.div 
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="border border-primary/20 p-5 hover:border-primary transition-all bg-card group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-10 font-mono text-[8px]">0x{event.id}</div>
                                <div className="text-[10px] text-primary mb-2 font-mono uppercase tracking-widest border-l-2 border-primary pl-2">{event.category}</div>
                                <h3 className="font-bold text-xl mb-2 truncate group-hover:text-primary transition-colors">{event.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4 font-mono line-clamp-2 h-10">
                                    {event.description}
                                </p>
                                <div className="flex justify-between items-center text-[10px] font-mono border-t border-border/50 pt-4">
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.city}</span>
                                    <Link href={`/events/${event.id}`} className="px-3 py-1 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                                        [ACCESS]
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
            
            {/* Global style overrides for Leaflet to fit hacker theme */}
            <style dangerouslySetInnerHTML={{__html: `
                .leaflet-popup-content-wrapper { background: var(--card); color: var(--foreground); border-radius: 0; border: 1px solid var(--primary); padding: 0; }
                .leaflet-popup-tip { background: var(--primary); border: 1px solid var(--primary); }
                .leaflet-popup-content { margin: 0; }
                .leaflet-container a.leaflet-popup-close-button { color: var(--primary); padding: 4px; }
            `}} />
        </HackerLayout>
    );
}
