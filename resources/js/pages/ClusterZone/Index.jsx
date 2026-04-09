import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Radar, Users, Briefcase, Calendar, Info, Filter, Crosshair, Map as MapIcon, Globe, Terminal, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix for default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

// Custom Node Icons Functions
const createNodeIcon = (type, color) => {
    return new L.DivIcon({
        className: 'custom-node-icon',
        html: `<div class="w-8 h-8 flex items-center justify-center relative">
                <div class="absolute inset-0 bg-${color}/20 rounded-full animate-ping opacity-30"></div>
                <div class="w-4 h-4 bg-${color} rounded-full border border-white/20 shadow-[0_0_10px_rgba(var(--${color}-rgb),0.5)] z-10"></div>
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

const iconMap = {
    user: createNodeIcon('user', 'primary'), // #22c55e
    community: createNodeIcon('community', 'cyan-400'),
    event: createNodeIcon('event', 'amber-500'),
};

export default function ClusterZone() {
    const [data, setData] = useState({ users: [], communities: [], events: [] });
    const [loading, setLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState(['user', 'community', 'event']);
    const [selectedNode, setSelectedNode] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/cluster-data');
            setData(response.data);
        } catch (error) {
            console.error("Failed to fetch cluster data", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFilter = (type) => {
        setActiveFilters(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const allNodes = [
        ...(activeFilters.includes('user') ? data.users : []),
        ...(activeFilters.includes('community') ? data.communities : []),
        ...(activeFilters.includes('event') ? data.events : []),
    ];

    const stats = {
        total: data.users.length + data.communities.length + data.events.length,
        users: data.users.length,
        communities: data.communities.length,
        events: data.events.length,
    };

    const focusOnNode = (node) => {
        if (mapInstance) {
            mapInstance.flyTo([node.latitude, node.longitude], 13);
            setSelectedNode(node);
        }
    };

    return (
        <HackerLayout>
            <Head title="Cluster Zone // Moroccan Dev Network" />
            
            <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-120px)] overflow-hidden relative border border-primary/20 bg-black/40">
                
                {/* Header & Stats Banner */}
                <div className="z-[1001] bg-black/90 border-b border-primary/30 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 border border-primary bg-primary/10">
                            <Radar className="w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tighter text-foreground leading-none flex items-center gap-2">
                                COMMUNITY_MAP <span className="text-[10px] text-primary font-mono opacity-60">LIVE_FEED</span>
                            </h1>
                            <div className="text-[10px] font-mono text-muted-foreground mt-1 uppercase">
                                Visualizing the Moroccan Developer Ecosystem
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 px-4 border-l border-border/30 hidden lg:grid">
                        <div className="text-center">
                            <div className="text-[10px] text-muted-foreground uppercase font-mono">Total</div>
                            <div className="text-xl font-black text-primary font-mono leading-none">{stats.total}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-muted-foreground uppercase font-mono">Devs</div>
                            <div className="text-xl font-black text-primary font-mono leading-none">{stats.users}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-muted-foreground uppercase font-mono">Groups</div>
                            <div className="text-xl font-black text-cyan-400 font-mono leading-none">{stats.communities}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-muted-foreground uppercase font-mono">Events</div>
                            <div className="text-xl font-black text-amber-500 font-mono leading-none">{stats.events}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex p-1 bg-black/50 border border-border/50">
                            <button 
                                onClick={() => toggleFilter('user')}
                                className={`px-3 py-1 text-[10px] font-bold uppercase transition-all ${activeFilters.includes('user') ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground opacity-50'}`}
                            >
                                USERS
                            </button>
                            <button 
                                onClick={() => toggleFilter('community')}
                                className={`px-3 py-1 text-[10px] font-bold uppercase transition-all ${activeFilters.includes('community') ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30' : 'text-muted-foreground opacity-50'}`}
                            >
                                HUBS
                            </button>
                            <button 
                                onClick={() => toggleFilter('event')}
                                className={`px-3 py-1 text-[10px] font-bold uppercase transition-all ${activeFilters.includes('event') ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'text-muted-foreground opacity-50'}`}
                            >
                                EVENTS
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Map Sidebar: Active Nodes List */}
                    <div className="w-80 border-r border-border/20 bg-black/40 overflow-hidden flex flex-col hidden lg:flex z-50">
                        <div className="p-4 border-b border-border/20 bg-card/10">
                            <h3 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2 mb-2">
                                <Terminal className="w-3 h-3" /> RECENT_ACTIVITY
                            </h3>
                            <div className="text-[10px] font-mono text-muted-foreground opacity-60">Scanning Map Entries...</div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1,2,3,4,5].map(i => (
                                        <div key={i} className="h-16 bg-card/20 animate-pulse border border-border/10"></div>
                                    ))}
                                </div>
                            ) : allNodes.length > 0 ? (
                                allNodes.map((node) => (
                                    <button 
                                        key={`${node.type}-${node.id}`}
                                        onClick={() => focusOnNode(node)}
                                        className={`w-full p-3 border text-left transition-all group ${
                                            selectedNode?.id === node.id && selectedNode?.type === node.type 
                                                ? 'bg-primary/10 border-primary shadow-[inset_0_0_15px_rgba(34,197,94,0.1)]' 
                                                : 'bg-black/30 border-border/20 hover:border-primary/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 border border-border/50 flex items-center justify-center bg-black/40 shrink-0 group-hover:border-primary transition-colors`}>
                                                {node.type === 'user' ? (
                                                    node.avatar ? <img src={node.avatar} className="w-full h-full object-cover" /> : <Users className="w-6 h-6 text-primary" />
                                                ) : node.type === 'community' ? (
                                                    node.logo ? <img src={node.logo} className="w-full h-full object-cover" /> : <Globe className="w-6 h-6 text-cyan-400" />
                                                ) : (
                                                    <Calendar className="w-6 h-6 text-amber-500" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-[10px] font-black uppercase text-foreground group-hover:text-primary truncate transition-colors">
                                                    {node.name || node.title}
                                                </div>
                                                <div className="text-[9px] font-mono text-muted-foreground uppercase flex items-center justify-between mt-1">
                                                    <span>{node.city}</span>
                                                    <span className={`flex items-center gap-1 ${
                                                        node.type === 'user' ? 'text-primary' : node.type === 'community' ? 'text-cyan-400' : 'text-amber-500'
                                                    }`}>
                                                        {node.type === 'user' ? `${node.xp} XP` : node.type.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <div className="text-[10px] font-mono text-muted-foreground uppercase">No entries found in this sector.</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Map Container */}
                    <div className="flex-1 relative">
                        <MapContainer 
                            center={[31.7917, -7.0926]} 
                            zoom={6} 
                            style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
                            ref={setMapInstance}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                            />

                            {/* Node Markers */}
                            {allNodes.map((node) => (
                                <Marker 
                                    key={`${node.type}-${node.id}`}
                                    position={[node.latitude, node.longitude]}
                                    icon={
                                        new L.DivIcon({
                                            className: 'custom-node-icon',
                                            html: `<div class="marker-pin marker-${node.type}">
                                                    <div class="pin-inner"></div>
                                                  </div>`,
                                            iconSize: [24, 24],
                                            iconAnchor: [12, 12],
                                        })
                                    }
                                    eventHandlers={{
                                        click: () => setSelectedNode(node),
                                    }}
                                >
                                    <Popup className="hacker-popup">
                                        <div className="bg-black/90 text-foreground border border-primary/50 p-4 w-64 font-mono text-[10px] backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                                            <div className="flex items-center gap-4 mb-4 pb-3 border-b border-primary/20">
                                                <div className={`w-10 h-10 border border-primary/40 flex items-center justify-center bg-primary/5`}>
                                                    {node.type === 'user' ? <Users className="w-5 h-5 text-primary" /> : node.type === 'community' ? <Globe className="w-5 h-5 text-cyan-400" /> : <Calendar className="w-5 h-5 text-amber-500" />}
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="font-black uppercase truncate text-xs text-primary">{node.name || node.title}</div>
                                                    <div className="text-[8px] opacity-40 tracking-widest mt-0.5">TYPE_{node.type.toUpperCase()}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2 mb-4 bg-primary/5 p-2 border border-primary/10">
                                                <div className="flex justify-between items-center">
                                                    <span className="opacity-40 text-[8px]">LOC_GEO:</span>
                                                    <span className="font-black">{node.city?.toUpperCase()}</span>
                                                </div>
                                                {node.type === 'user' && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="opacity-40 text-[8px]">XP_VAL:</span>
                                                        <span className="text-primary font-black uppercase">{node.xp}</span>
                                                    </div>
                                                )}
                                                {node.type === 'community' && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="opacity-40 text-[8px]">HUB_SIZE:</span>
                                                        <span className="text-cyan-400 font-black uppercase text-[9px]">{node.member_count} DEVS</span>
                                                    </div>
                                                )}
                                            </div>

                                            <Link 
                                                href={node.type === 'user' ? `/profile/${node.username}` : (node.type === 'event' ? `/events/${node.id}` : `/communities/${node.id}`)}
                                                className={`block w-full text-center py-3 border-2 ${node.type === 'user' ? 'border-primary text-primary hover:bg-primary hover:text-black' : node.type === 'community' ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black' : 'border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black'} transition-all font-black uppercase text-[9px] tracking-tighter`}
                                            >
                                                INITIALIZE_CONNECTION
                                            </Link>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>

                        {/* Map Overlay HUD */}
                        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                             <div className="bg-black/80 border border-primary/40 p-2 backdrop-blur-md font-mono text-[10px] uppercase space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,1)]"></div>
                                    <span>NETWORK_ONLINE</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                    <span>COMMUNITY_ACTIVE</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                    <span>MISSION_PLANNED</span>
                                </div>
                             </div>
                        </div>

                        {/* Floating Node Scanner HUD */}
                        <AnimatePresence>
                            {selectedNode && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 100 }}
                                    className="absolute bottom-4 right-4 z-[1000] w-72 bg-black/90 border-2 border-primary/50 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] lg:hidden"
                                >
                                     <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 border border-primary bg-primary/10`}>
                                            {selectedNode.type === 'user' ? <Users className="w-4 h-4 text-primary" /> : selectedNode.type === 'community' ? <Globe className="w-4 h-4 text-cyan-400" /> : <Calendar className="w-4 h-4 text-amber-500" />}
                                        </div>
                                        <button onClick={() => setSelectedNode(null)} className="text-muted-foreground hover:text-white transition-colors">
                                            <Terminal className="w-4 h-4" />
                                        </button>
                                     </div>

                                     <h2 className="text-lg font-black uppercase text-foreground leading-tight mb-1">{selectedNode.name || selectedNode.title}</h2>
                                     <div className="text-[10px] font-mono text-primary mb-4">[ NODE_IDENT: {selectedNode.type.toUpperCase()}_{selectedNode.id} ]</div>
                                     
                                     <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-[10px] font-mono border-b border-border/20 pb-1">
                                            <span className="text-muted-foreground">Geo_Loc</span>
                                            <span className="text-foreground">{selectedNode.city}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-mono border-b border-border/20 pb-1">
                                            <span className="text-muted-foreground">Status</span>
                                            <span className="text-primary animate-pulse font-bold">LIVE_SIGNAL</span>
                                        </div>
                                     </div>

                                     <Link 
                                        href={selectedNode.type === 'user' ? `/profile/${selectedNode.username}` : (selectedNode.type === 'event' ? `/events/${selectedNode.id}` : `/communities`)}
                                        className="block w-full text-center py-3 bg-primary/10 border-2 border-primary text-primary font-black uppercase text-[10px] hover:bg-primary hover:text-primary-foreground transition-all"
                                     >
                                        INITIALIZE_CONNECTION
                                     </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* CSS Overrides for Leaflet Hacker Theme */}
                <style dangerouslySetInnerHTML={{ __html: `
                    .leaflet-container {
                        background: #0a0a0a !important;
                    }
                    .leaflet-bar a {
                        background-color: #000 !important;
                        color: #22c55e !important;
                        border-bottom: 1px solid #22c55e44 !important;
                    }
                    .leaflet-bar a:hover {
                        background-color: #111 !important;
                    }
                    .hacker-popup .leaflet-popup-content-wrapper {
                        background: transparent !important;
                        color: #fff !important;
                        padding: 0 !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                    }
                    .hacker-popup .leaflet-popup-content {
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .hacker-popup .leaflet-popup-tip-container {
                        display: none !important;
                    }
                    
                    /* Custom Node Markers Styles */
                    .marker-pin {
                        width: 20px;
                        height: 20px;
                        border-radius: 50% 50% 50% 0;
                        background: #22c55e;
                        position: absolute;
                        transform: rotate(-45deg);
                        left: 50%;
                        top: 50%;
                        margin: -20px 0 0 -10px;
                        border: 2px solid white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 0 10px rgba(34,197,94,0.5);
                    }
                    .pin-inner {
                        width: 10px;
                        height: 10px;
                        background: black;
                        border-radius: 50%;
                    }
                    .marker-user { background: #22c55e; }
                    .marker-community { background: #06b6d4; }
                    .marker-event { background: #f59e0b; }
                    
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(34, 197, 94, 0.2);
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(34, 197, 94, 0.5);
                    }
                `}} />
            </div>
        </HackerLayout>
    );
}
