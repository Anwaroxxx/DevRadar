import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { Terminal, Save, ArrowLeft, Settings, Shield, Trash2, Key, Loader2 } from 'lucide-react';
import TechIcon from '@/components/TechIcon';
import MapPicker from '@/components/MapPicker';
import { useState, useRef } from 'react';
import axios from 'axios';
import ConfirmModal from '@/components/ConfirmModal';

export default function ProfileEdit({ user, allSkills = [] }) {
    const page = usePage();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        username: user.username,
        bio: user.bio || '',
        github_url: user.github_url || '',
        location: user.location || '',
        city: user.city || '',
        skills: user.skills.map(s => s.id) || [],
        latitude: user.latitude || '',
        longitude: user.longitude || '',
        profile_accent_color: user.profile_accent_color || 'primary',
        profile_theme_style: user.profile_theme_style || 'classic',
        profile_glow_effect: user.profile_glow_effect ?? true,
        profile_matrix_intensity: user.profile_matrix_intensity || 'medium',
    });

    const [avatarPreview, setAvatarPreview] = useState(user.avatar);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [systemAlert, setSystemAlert] = useState({ open: false, title: '', message: '' });
    const fileInputRef = useRef(null);

    const handleAvatarSelected = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview with FileReader
        const reader = new FileReader();
        reader.onload = (e) => setAvatarPreview(e.target.result);
        reader.readAsDataURL(file);

        // Upload
        setIsUploadingAvatar(true);
        const formData = new FormData();
        formData.append('avatar_file', file);
        
        try {
            const { data } = await axios.post('/profile/photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAvatarPreview(data.avatar);
        } catch (error) {
            console.error("Avatar upload failed", error);
            // Revert preview on failure
            setAvatarPreview(user.avatar);
            setSystemAlert({ 
                open: true, 
                title: 'Upload Failed', 
                message: 'Neural interface failed to sync avatar data. Check file size/format.' 
            });
        } finally {
            setIsUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

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
        
        // Build options
        const options = {
            onSuccess: () => {
                // Redirect happens automatically via redirect() in controller
            },
            onError: (errors) => {
                console.error('Profile update failed:', errors);
            },
            // If there's an avatar file, we need to use forceFormData to send multipart/form-data
            forceFormData: !!data.avatar_file,
        };
        
        // Use Inertia's patch method to update profile
        patch('/profile', options);
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
        setConfirmDelete(true);
    };

    const performDeletion = () => {
        deleteForm.delete('/profile', {
            preserveScroll: true,
            onFinish: () => {
                deleteForm.reset();
                setConfirmDelete(false);
            },
        });
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
            <Head title="Edit Profile" />
            
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
                <Link href="/profile" className="inline-flex items-center gap-2 text-primary hover:text-foreground transition-all uppercase font-black text-xs group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Profile
                </Link>

                {/* Main Profile Info */}
                <div className="bg-card border-2 border-primary/50 relative overflow-hidden p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
                        <Settings className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-black uppercase text-foreground m-0 tracking-tighter">Profile Settings</h1>
                    </div>

                    <form onSubmit={submit} className="space-y-6 font-mono">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Identifiers */}
                            <div className="space-y-4">
                                <h3 className="text-sm border-b border-border pb-2 uppercase text-primary font-bold tracking-widest">// Identity Information</h3>
                                
                                <div className="flex items-center gap-6 py-4">
                                    <div className="w-20 h-20 border-2 border-primary/50 bg-black/40 flex items-center justify-center relative overflow-hidden">
                                        {isUploadingAvatar ? (
                                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                        ) : avatarPreview ? (
                                            <img src={avatarPreview} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl font-bold opacity-30">{user.name[0]}</span>
                                        )}
                                        {!isUploadingAvatar && (
                                            <div 
                                                className="absolute inset-0 bg-primary/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer group"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <span className="text-[8px] font-bold text-center group-hover:text-primary transition-colors">CHNG<br/>IMG</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] text-muted-foreground uppercase mb-1">Avatar_Source</label>
                                        <p className="text-[10px] text-primary/60 italic leading-tight">Click the node image to upload a new identity visualization. (MAX 2MB). Uploads save immediately.</p>
                                        {avatarPreview && !isUploadingAvatar && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    router.delete('/profile/avatar', {
                                                        preserveScroll: true,
                                                        onSuccess: () => setAvatarPreview(null)
                                                    });
                                                }}
                                                className="text-[10px] text-destructive hover:text-destructive/80 mt-2 underline block"
                                            >
                                                [DEL] Remove Avatar
                                            </button>
                                        )}
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
                                <h3 className="text-sm border-b border-border pb-2 uppercase text-primary font-bold tracking-widest">// Location & Links</h3>
                                
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

                                <div className="pt-2">
                                    <label className="block text-[10px] text-muted-foreground uppercase mb-2 flex justify-between">
                                        <span>Exact_Geo_Position</span>
                                        <span className="text-primary/60">[ CLICK_MAP_TO_SET ]</span>
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
                            </div>
                        </div>

                        {/* Customization Modules */}
                        <div className="bg-black/30 p-6 border border-border mt-8">
                            <h3 className="text-[10px] font-black uppercase text-primary mb-6 tracking-widest flex items-center gap-2">
                                <Settings className="w-3 h-3" /> // Profile Customization
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] text-muted-foreground uppercase mb-1">Accent_Color_Hex</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['primary', 'amber', 'cyan', 'rose', 'purple'].map(color => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setData('profile_accent_color', color)}
                                                    className={`w-8 h-8 border-2 transition-all ${
                                                        data.profile_accent_color === color 
                                                            ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                                                            : 'border-transparent'
                                                    } ${
                                                        color === 'primary' ? 'bg-[#22c55e]' :
                                                        color === 'amber' ? 'bg-[#f59e0b]' :
                                                        color === 'cyan' ? 'bg-[#06b6d4]' :
                                                        color === 'rose' ? 'bg-[#f43f5e]' :
                                                        'bg-[#a855f7]'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[10px] text-muted-foreground uppercase mb-1">Theme_Style_Kernel</label>
                                        <select 
                                            className="w-full bg-card border border-border p-2 focus:border-primary outline-none text-xs"
                                            value={data.profile_theme_style}
                                            onChange={(e) => setData('profile_theme_style', e.target.value)}
                                        >
                                            <option value="classic">CLASSIC_TERMINAL</option>
                                            <option value="neon">NEON_OVERDRIVE</option>
                                            <option value="minimal">MINIMAL_VOID</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 border border-border/50 bg-black/20">
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-foreground">Glow_Effects</div>
                                            <div className="text-[8px] text-muted-foreground uppercase tracking-tight">Enable neural UI glowing</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setData('profile_glow_effect', !data.profile_glow_effect)}
                                            className={`w-10 h-5 border transition-all relative ${data.profile_glow_effect ? 'bg-primary/20 border-primary' : 'bg-black border-border'}`}
                                        >
                                            <div className={`absolute top-0.5 w-3.5 h-3.5 transition-all ${data.profile_glow_effect ? 'bg-primary right-0.5' : 'bg-muted-foreground left-0.5'}`} />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] text-muted-foreground uppercase mb-1">Matrix_Background_Intensity</label>
                                        <select 
                                            className="w-full bg-card border border-border p-2 focus:border-primary outline-none text-xs"
                                            value={data.profile_matrix_intensity}
                                            onChange={(e) => setData('profile_matrix_intensity', e.target.value)}
                                        >
                                            <option value="none">OFF</option>
                                            <option value="low">LOW_BANDWIDTH</option>
                                            <option value="medium">MEDIUM_SIGNAL</option>
                                            <option value="high">MAX_STREAM</option>
                                        </select>
                                    </div>
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
                                Save Changes
                            </button>
                            {recentlySuccessful && <span className="text-primary text-xs animate-pulse opacity-80">[!] Profile Updated</span>}
                        </div>
                    </form>
                </div>

                {/* Password Change Section */}
                <div className="bg-card border border-border p-8 font-mono">
                    <h2 className="text-sm font-black uppercase text-foreground mb-6 flex items-center gap-2 tracking-widest">
                        <Key className="w-5 h-5 text-yellow-500" /> Security Settings
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
                            Update Password
                        </button>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-destructive/5 border border-destructive/20 p-4 md:p-8 font-mono">
                    <h2 className="text-sm font-black uppercase text-destructive mb-2 flex items-center gap-2 tracking-widest">
                        <Trash2 className="w-5 h-5 animate-pulse" /> DANGER_ZONE
                    </h2>
                    <p className="text-xs text-muted-foreground mb-6 italic">Warning: This action will permanently delete your account and all associated data.</p>
                    
                    <button
                        onClick={deleteAccount}
                        className="text-[10px] font-black uppercase text-destructive border border-destructive/50 px-4 py-2 hover:bg-destructive hover:text-white transition-all"
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            <ConfirmModal 
                isOpen={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onConfirm={performDeletion}
                title="Decommission Node"
                description="This action is irreversible. All your neural data, connections, and XP will be permanently purged from the network."
                confirmText="Delete Account"
                variant="destructive"
            >
                <div className="px-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] text-muted-foreground uppercase tracking-widest">
                            Confirm_Identity (Current_Password)
                        </label>
                        <input
                            type="password"
                            placeholder="TERMINATE_SEQUENCE_PASSWORD"
                            className="w-full bg-black/40 border border-destructive/30 p-3 text-sm text-destructive focus:border-red-500 outline-none transition-all font-mono"
                            value={deleteForm.password}
                            onChange={(e) => deleteForm.setData('password', e.target.value)}
                        />
                        {deleteForm.errors.password && (
                            <div className="text-[10px] text-red-500 font-black uppercase mt-1">
                                {deleteForm.errors.password}
                            </div>
                        )}
                    </div>
                </div>
            </ConfirmModal>

            <ConfirmModal 
                isOpen={systemAlert.open}
                onClose={() => setSystemAlert({ ...systemAlert, open: false })}
                onConfirm={() => setSystemAlert({ ...systemAlert, open: false })}
                title={systemAlert.title}
                description={systemAlert.message}
                confirmText="ACKNOWLEDGE"
                showCancel={false}
            />
            {/* Hidden file input — OUTSIDE the profile form to avoid HTML5 form validation */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAvatarSelected}
            />
        </HackerLayout>
    );
}
