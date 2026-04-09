import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Terminal, Briefcase, MapPin, Globe, Save, Cpu, X, Plus } from 'lucide-react';
import MapPicker from '@/components/MapPicker';

export default function CreateJob() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        company: '',
        city: '',
        latitude: '',
        longitude: '',
        type: 'full-time',
        is_remote: false,
        description: '',
        apply_link: '',
        tech_stack: [],
    });

    const [techInput, setTechInput] = useState('');

    const addTech = () => {
        if (techInput.trim() && !data.tech_stack.includes(techInput.trim())) {
            setData('tech_stack', [...data.tech_stack, techInput.trim()]);
            setTechInput('');
        }
    };

    const removeTech = (tech) => {
        setData('tech_stack', data.tech_stack.filter(t => t !== tech));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/jobs');
    };

    return (
        <HackerLayout>
            <Head title="Post New Job" />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8 border-b border-primary/30 pb-4">
                    <div className="p-3 border-2 border-primary bg-primary/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <Briefcase className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground leading-none">
                            Post Job
                        </h1>
                        <div className="text-xs font-mono text-primary/60 mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            Fill in the job details below
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
                    {/* Left Column - Core Data */}
                    <div className="space-y-6">
                        <section className="bg-card border border-primary/20 p-6 relative">
                            <h2 className="text-primary font-bold uppercase mb-4 text-xs tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary"></span> Position Details
                            </h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] text-muted-foreground uppercase mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full bg-black/40 border-b border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm"
                                        placeholder="EX: Senior Backend Engineer"
                                        required
                                    />
                                    {errors.title && <div className="text-destructive text-[10px] mt-1">{errors.title}</div>}
                                </div>

                                <div>
                                    <label className="block text-[10px] text-muted-foreground uppercase mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        value={data.company}
                                        onChange={e => setData('company', e.target.value)}
                                        className="w-full bg-black/40 border-b border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm"
                                        placeholder="EX: CyberDyne Systems"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] text-muted-foreground uppercase mb-1">Job Type</label>
                                        <select
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value)}
                                            className="w-full bg-black/40 border-b border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm appearance-none"
                                        >
                                            <option value="full-time" className="bg-black">FULL_TIME</option>
                                            <option value="part-time" className="bg-black">PART_TIME</option>
                                            <option value="contract" className="bg-black">CONTRACT</option>
                                            <option value="internship" className="bg-black">INTERN</option>
                                            <option value="freelance" className="bg-black">FREELANCE</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2 pt-4">
                                        <input
                                            type="checkbox"
                                            checked={data.is_remote}
                                            onChange={e => setData('is_remote', e.target.checked)}
                                            id="is_remote"
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <label htmlFor="is_remote" className="text-[10px] uppercase text-primary/80 cursor-pointer">Remote OK</label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-card border border-primary/20 p-6 relative">
                            <h2 className="text-primary font-bold uppercase mb-4 text-xs tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary"></span> Job Description
                            </h2>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows="8"
                                className="w-full bg-black/40 border border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm resize-none"
                                placeholder="Detail requirements and responsibilities..."
                                required
                            ></textarea>
                        </section>
                    </div>

                    {/* Right Column - Meta & Submission */}
                    <div className="space-y-6">
                        <section className="bg-card border border-primary/20 p-6 relative">
                            <h2 className="text-primary font-bold uppercase mb-4 text-xs tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary"></span> Location & Application
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] text-muted-foreground uppercase mb-1">City</label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={e => setData('city', e.target.value)}
                                        className="w-full bg-black/40 border-b border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm"
                                        placeholder="EX: Casablanca"
                                        required
                                    />
                                </div>
                                
                                <div className="mt-4">
                                    <label className="block text-[10px] text-muted-foreground uppercase mb-2 flex justify-between">
                                        <span>Pin Location on Map</span>
                                        <span className="text-primary/60 text-[8px]">[ Click map to pin ]</span>
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

                                <div>
                                    <label className="block text-[10px] text-muted-foreground uppercase mb-1">Application Link (URL)</label>
                                    <input
                                        type="url"
                                        value={data.apply_link}
                                        onChange={e => setData('apply_link', e.target.value)}
                                        className="w-full bg-black/40 border-b border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm"
                                        placeholder="https://..."
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="bg-card border border-primary/20 p-6 relative">
                            <h2 className="text-primary font-bold uppercase mb-4 text-xs tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary"></span> Tech Stack
                            </h2>
                            
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={techInput}
                                    onChange={e => setTechInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                                    className="flex-1 bg-black/40 border-b border-primary/30 p-2 text-foreground focus:outline-none focus:border-primary transition-all text-sm"
                                    placeholder="Add tech module..."
                                />
                                <button
                                    type="button"
                                    onClick={addTech}
                                    className="px-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                                >
                                    ADD
                                </button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                {data.tech_stack.map(tech => (
                                    <span key={tech} className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/30 px-2 py-1 text-[10px]">
                                        <Cpu className="w-3 h-3" /> {tech}
                                        <button type="button" onClick={() => removeTech(tech)} className="hover:text-white">
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
                                <Save className="w-5 h-5" /> Post Job
                            </button>
                            <Link 
                                href="/jobs"
                                className="w-full text-center text-muted-foreground hover:text-primary transition-colors text-xs uppercase"
                            >
                                &gt; Cancel
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </HackerLayout>
    );
}
