import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

const hackerIcon = new L.DivIcon({
    className: 'hacker-map-marker',
    html: `<div class="w-6 h-6 bg-primary/20 border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.5)]">
            <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

function LocationMarker({ position, setPosition }) {
    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition({ lat, lng });
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={hackerIcon} />
    );
}

// Helper to center map if position changes from outside
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

export default function MapPicker({ initialValue, onChange, height = "300px" }) {
    const [position, setPosition] = useState(initialValue?.lat ? initialValue : null);

    const handleSetPosition = (pos) => {
        setPosition(pos);
        if (onChange) {
            onChange(pos);
        }
    };

    // Default center: Morocco (Casablanca approx)
    const defaultCenter = [33.5731, -7.5898];

    return (
        <div className="relative border-2 border-primary/30 w-full overflow-hidden" style={{ height }}>
            <MapContainer 
                center={position || defaultCenter} 
                zoom={6} 
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{ background: '#0a0a0a' }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                />
                <LocationMarker position={position} setPosition={handleSetPosition} />
                {position && <ChangeView center={position} />}
            </MapContainer>
            
            <div className="absolute bottom-2 left-2 z-[1000] bg-black/80 border border-primary/50 p-2 font-mono text-[10px] text-primary uppercase">
                {position ? (
                    <span>COORD: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}</span>
                ) : (
                    <span>AWAITING_INPUT // CLICK_MAP_TO_PIN</span>
                )}
            </div>

            <style>{`
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
                .leaflet-control-attribution {
                    background: rgba(0,0,0,0.7) !important;
                    color: #22c55e !important;
                    font-family: monospace !important;
                    font-size: 8px !important;
                    text-transform: uppercase !important;
                }
                .hacker-map-marker {
                    background: transparent !important;
                    border: none !important;
                }
            `}</style>
        </div>
    );
}
