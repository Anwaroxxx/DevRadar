import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Terminal, Calendar, MapPin, Globe, Save, X, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import MapPicker from '@/components/MapPicker';

export default function CreateEvent() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        city: '',
        organizer: '',
        website: '',
        event_date: '',
        category: 'event',
        latitude: '',
        longitude: '',
        tags: [],
    });

    const [tagInput, setTagInput] = useState('');

    const addTag = () => {
        if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
            setData('tags', [...data.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tag) => {
        setData('tags', data.tags.filter(t => t !== tag));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/events');
    };

    return (
        <HackerLayout>
            <Head title="Create New Event" />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8 border-b border-primary/30 pb-4">
                    <div className="p-3 border-2 border-primary bg-primary/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <Terminal className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground leading-none">
                            Create Event
                        </h1>
                        <div className="text-xs font-mono text-primary/60 mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            Fill in the details below
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
                    {/* Left Column - Core Data */}
                    <div className="space-y-6">
                        <section className="bg-card border border-primary/20 p-6 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10">0x01</div>
                            <h2 className="text-primary font-bold uppercase mb-4 text-xs tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary"></span> Basic Information
                            </h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] text-muted-foreground uppercase mb-1">Event Title</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full bg-black/40 border-b border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm"
                                        placeholder="EX: React Meetup #01"
                                        required
                                    />
                                    {errors.title && <div className="text-destructive text-[10px] mt-1">{errors.title}</div>}
                                </div>

                                <div>
                                    <label className="block text-[10px] text-muted-foreground uppercase mb-1">Description</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows="4"
                                        className="w-full bg-black/40 border border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm resize-none"
                                        placeholder="Detail the event objectives..."
                                        required
                                    ></textarea>
                                    {errors.description && <div className="text-destructive text-[10px] mt-1">{errors.description}</div>}
                                </div>
                            </div>
                        </section>

                        <section className="bg-card border border-primary/20 p-6 relative">
                             <div className="absolute top-0 right-0 p-2 opacity-10">0x02</div>
                            <h2 className="text-primary font-bold uppercase mb-4 text-xs tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary"></span> Location & Date
                            </h2>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] text-muted-foreground uppercase mb-1">City</label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={e => setData('city', e.target.value)}
                                        className="w-full bg-black/40 border-b border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm"
                                        placeholder="Casablanca"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-muted-foreground uppercase mb-1">Event Date</label>
                                    <input
                                        type="date"
                                        value={data.event_date}
                                        onChange={e => setData('event_date', e.target.value)}
                                        className="w-full bg-black/40 border-b border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm color-scheme-dark"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <label className="block text-[10px] text-muted-foreground uppercase mb-2 flex justify-between">
                                    <span>Exact Location on Map</span>
                                    <span className="text-primary/60 text-[8px]">[ Click map to set ]</span>
                                </label>
                                <MapPicker 
                                    height="200px"
                                    initialValue={data.latitude && data.longitude ? { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) } : null}
                                    onChange={(pos) => {
                                        setData(d => ({ ...d, latitude: pos.lat, longitude: pos.lng }));
                                    }}
                                />
                                {errors.latitude && <div className="text-destructive text-[10px] mt-1">{errors.latitude}</div>}
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Meta & Submission */}
                    <div className="space-y-6">
                        <section className="bg-card border border-primary/20 p-6 relative">
                             <div className="absolute top-0 right-0 p-2 opacity-10">0x03</div>
                            <h2 className="text-primary font-bold uppercase mb-4 text-xs tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary"></span> Additional Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] text-muted-foreground uppercase mb-1">Organizer Name</label>
                                    <input
                                        type="text"
                                        value={data.organizer}
                                        onChange={e => setData('organizer', e.target.value)}
                                        className="w-full bg-black/40 border-b border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-muted-foreground uppercase mb-1">Website URL (Optional)</label>
                                    <input
                                        type="url"
                                        value={data.website}
                                        onChange={e => setData('website', e.target.value)}
                                        className="w-full bg-black/40 border-b border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-muted-foreground uppercase mb-1">Category</label>
                                    <select
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        className="w-full bg-black/40 border-b border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                                    >
                                        <option value="event" className="bg-black">EVENT</option>
                                        <option value="hackathon" className="bg-black">HACKATHON</option>
                                        <option value="workshop" className="bg-black">WORKSHOP</option>
                                        <option value="meetup" className="bg-black">MEETUP</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="bg-card border border-primary/20 p-6 relative">
                             <div className="absolute top-0 right-0 p-2 opacity-10">0x04</div>
                            <h2 className="text-primary font-bold uppercase mb-4 text-xs tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary"></span> Tags
                            </h2>
                            
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    className="flex-1 bg-black/40 border-b border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm"
                                    placeholder="Add tech tag..."
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="px-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                                >
                                    ADD
                                </button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                {data.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/30 px-2 py-1 text-[10px]">
                                        #{tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </section>

                        <div className="flex flex-col gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-primary/20 text-primary border-2 border-primary py-4 font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-all shadow-[0_0_20px_rgba(34,197,94,0.15)] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                <Save className="w-5 h-5" /> Post Event
                            </button>
                            <Link 
                                href="/events"
                                className="w-full text-center text-muted-foreground hover:text-primary transition-colors text-xs uppercase"
                            >
                                &gt; Cancel
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(1) hue-rotate(90deg) brightness(1.5);
                    cursor: pointer;
                }
            `}} />
        </HackerLayout>
    );
}

