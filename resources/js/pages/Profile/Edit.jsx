import { Head, Link, useForm, usePage } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Terminal, Save, ArrowLeft, Settings, Shield, Trash2, Key } from 'lucide-react';
import TechIcon from '@/components/TechIcon';

export default function ProfileEdit({ user, allSkills }) {
    const { data, setData, post, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio || '',
        github_url: user.github_url || '',
        location: user.location || '',
        city: user.city || '',
        skills: user.skills.map(s => s.id) || [],
        avatar_file: null,
    });

    // Password Form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Deletion Form
    const deleteForm = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Since we are uploading a file, we use post with _method: PATCH
        post('/profile', {
            forceFormData: true,
            data: {
                ...data,
                _method: 'PATCH'
            }
        });
    };

    const updatePassword = (e) => {
        e.preventDefault();
        passwordForm.put('/profile/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const deleteAccount = (e) => {
        e.preventDefault();
        if (confirm('CRITICAL: This will permanently decommission your node. Proceed?')) {
            deleteForm.delete('/profile', {
                preserveScroll: true,
                onFinish: () => deleteForm.reset(),
            });
        }
    };

    const toggleSkill = (skillId) => {
        if (data.skills.includes(skillId)) {
            setData('skills', data.skills.filter(id => id !== skillId));
        } else {
            setData('skills', [...data.skills, skillId]);
        }
    };

    return (
        <HackerLayout>
            <Head title="Reconfig Profile" />
            
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
                
                <Link href={`/profile/${user.username}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono mb-6 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> ABORT_RECONFIG
                </Link>

                {/* Main Profile Info */}
                <div className="bg-card border-2 border-primary/50 relative overflow-hidden p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
                        <Settings className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-black uppercase text-foreground m-0 tracking-tighter">Profile_Settings</h1>
                    </div>

                    <form onSubmit={submit} className="space-y-6 font-mono">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Identifiers */}
                            <div className="space-y-4">
                                <h3 className="text-sm border-b border-border pb-2 uppercase text-primary font-bold tracking-widest">// Identity_Data</h3>
                                
                                <div className="flex items-center gap-6 py-4">
                                    <div className="w-20 h-20 border-2 border-primary/50 bg-black/40 flex items-center justify-center relative overflow-hidden">
                                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span className="text-2xl font-bold opacity-30">{user.name[0]}</span>}
                                        <div className="absolute inset-0 bg-primary/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <input 
                                                type="file" 
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => setData('avatar_file', e.target.files[0])}
                                            />
                                            <span className="text-[8px] font-bold text-center">CHNG<br/>IMG</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] text-muted-foreground uppercase mb-1">Avatar_Source</label>
                                        <p className="text-[10px] text-primary/60 italic leading-tight">Click the node image to upload a new identity visualization. (MAX 2MB)</p>
                                        {data.avatar_file && <div className="text-[10px] text-primary mt-1 font-bold">[FILE_LOADED: {data.avatar_file.name}]</div>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="name" className="block text-[10px] text-muted-foreground uppercase mb-1">Display_Alias</label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="w-full bg-card border border-border p-2 focus:border-primary outline-none transition-colors border-l-4 border-l-primary/30"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <div className="text-destructive text-xs mt-1">{errors.name}</div>}
                                </div>

                                <div>
                                    <label htmlFor="username" className="block text-[10px] text-muted-foreground uppercase mb-1">Handle (@)</label>
                                    <input
                                        id="username"
                                        type="text"
                                        className="w-full bg-card border border-border p-2 focus:border-primary outline-none transition-colors border-l-4 border-l-primary/30"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="space-y-4">
                                <h3 className="text-sm border-b border-border pb-2 uppercase text-primary font-bold tracking-widest">// NODE_METADATA</h3>
                                
                                <div>
                                    <label htmlFor="city" className="block text-[10px] text-muted-foreground uppercase mb-1">Geo_Loc (City)</label>
                                    <input
                                        id="city"
                                        type="text"
                                        className="w-full bg-card border border-border p-2 focus:border-primary outline-none transition-colors border-l-4 border-l-primary/30"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="github_url" className="block text-[10px] text-muted-foreground uppercase mb-1">Git_Repository_Link</label>
                                    <input
                                        id="github_url"
                                        type="url"
                                        className="w-full bg-card border border-border p-2 focus:border-primary outline-none transition-colors border-l-4 border-l-primary/30"
                                        value={data.github_url}
                                        onChange={(e) => setData('github_url', e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="bio" className="block text-[10px] text-muted-foreground uppercase mb-1">Node_Description</label>
                                    <textarea
                                        id="bio"
                                        rows="3"
                                        className="w-full bg-card border border-border p-2 focus:border-primary outline-none transition-colors border-l-4 border-l-primary/30 resize-none"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Skill Modules */}
                        <div className="bg-black/30 p-4 border border-border mt-6">
                            <h3 className="text-[10px] font-black uppercase text-primary mb-4 tracking-widest"># TECHNICAL_SKILLS_ARRAY</h3>
                            <div className="flex flex-wrap gap-2">
                                {allSkills.map(skill => (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        onClick={() => toggleSkill(skill.id)}
                                        className={`px-3 py-1 text-[10px] border transition-all flex items-center gap-2 ${
                                            data.skills.includes(skill.id) 
                                                ? 'bg-primary border-primary text-primary-foreground font-black' 
                                                : 'bg-card border-border text-muted-foreground hover:border-primary/50'
                                        }`}
                                    >
                                        <TechIcon name={skill.name} className="w-3 h-3" />
                                        {skill.name.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-6 border-t border-border mt-8">
                            <button
                                type="submit"
                                disabled={processing}
                                className="border-2 border-primary bg-primary/10 text-primary px-8 py-3 font-black uppercase tracking-widest transition-all hover:bg-primary hover:text-primary-foreground shadow-[0_0_15px_rgba(34,197,94,0.1)] disabled:opacity-50"
                            >
                                SAVE_CHANGES //
                            </button>
                            {recentlySuccessful && <span className="text-primary text-xs animate-pulse opacity-80">[!] PROFILE_UPDATED</span>}
                        </div>
                    </form>
                </div>

                {/* Password Change Section */}
                <div className="bg-card border border-border p-8 font-mono">
                    <h2 className="text-sm font-black uppercase text-foreground mb-6 flex items-center gap-2 tracking-widest">
                        <Key className="w-5 h-5 text-yellow-500" /> SECURITY_RECOVERY_KEY
                    </h2>
                    
                    <form onSubmit={updatePassword} className="space-y-4 max-w-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] text-muted-foreground uppercase mb-1">Current_Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-black/40 border border-border p-2 focus:border-yellow-500/50 outline-none transition-colors"
                                    value={passwordForm.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                />
                                {passwordForm.errors.current_password && <div className="text-destructive text-[10px] mt-1">{passwordForm.errors.current_password}</div>}
                            </div>
                            <div>
                                <label className="block text-[10px] text-muted-foreground uppercase mb-1">New_Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-black/40 border border-border p-2 focus:border-yellow-500/50 outline-none transition-colors"
                                    value={passwordForm.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="text-[10px] font-black uppercase text-yellow-500 border border-yellow-500/50 px-4 py-2 hover:bg-yellow-500/10 transition-colors"
                        >
                            UPDATE_CREDENTIALS //
                        </button>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-destructive/5 border border-destructive/20 p-8 font-mono">
                    <h2 className="text-sm font-black uppercase text-destructive mb-2 flex items-center gap-2 tracking-widest">
                        <Trash2 className="w-5 h-5 animate-pulse" /> DANGER_ZONE
                    </h2>
                    <p className="text-xs text-muted-foreground mb-6 italic">Warning: This action will permanently delete your account and all associated data.</p>
                    
                    <button
                        onClick={deleteAccount}
                        className="text-[10px] font-black uppercase text-destructive border border-destructive/50 px-4 py-2 hover:bg-destructive hover:text-white transition-all"
                    >
                        DELETE_ACCOUNT_FOREVER //
                    </button>
                </div>
            </div>
        </HackerLayout>
    );
}
