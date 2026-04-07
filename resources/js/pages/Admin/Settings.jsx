import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { Settings, AlertTriangle } from 'lucide-react';

export default function AdminSettings({ feature_flags }) {
    const [editingFlag, setEditingFlag] = useState(null);
    const [configForm, setConfigForm] = useState({});

    const handleToggle = (flagId) => {
        router.post(`/admin/feature-flags/${flagId}/toggle`);
    };

    const handleConfigSubmit = (flagId) => {
        router.put(`/admin/feature-flags/${flagId}/config`, { config: configForm }, {
            onSuccess: () => {
                setEditingFlag(null);
                setConfigForm({});
            }
        });
    };

    return (
        <HackerLayout>
            <Head title="Admin — Settings" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-primary/30 pb-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-mono text-xs">← ADMIN</Link>
                        <span className="text-border">/</span>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <Settings className="w-6 h-6 text-primary" /> SETTINGS_&_FEATURES
                        </h1>
                    </div>
                </div>

                {/* Feature Flags */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold uppercase">Feature Flags</h2>

                    {feature_flags.length === 0 ? (
                        <div className="border border-border/50 p-6 text-center text-muted-foreground text-sm">
                            No feature flags configured yet. Create some to control platform features.
                        </div>
                    ) : (
                        feature_flags.map(flag => (
                            <motion.div
                                key={flag.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`border p-4 transition-all ${flag.enabled ? 'border-primary/30 bg-primary/5' : 'border-muted-foreground/30 bg-muted/5'}`}
                            >
                                {editingFlag === flag.id ? (
                                    <div className="space-y-3">
                                        {/* Config Editor */}
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground">Configuration (JSON)</label>
                                            <textarea
                                                value={JSON.stringify(configForm, null, 2)}
                                                onChange={e => {
                                                    try {
                                                        setConfigForm(JSON.parse(e.target.value));
                                                    } catch {
                                                        // Keep current form on invalid JSON
                                                    }
                                                }}
                                                className="w-full bg-black border border-primary/30 p-2 text-xs font-mono mt-1 focus:outline-none focus:border-primary resize-none"
                                                rows={4}
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleConfigSubmit(flag.id)}
                                                className="flex-1 bg-primary/20 text-primary border border-primary px-3 py-2 text-xs font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all"
                                            >
                                                SAVE_CONFIG
                                            </button>
                                            <button
                                                onClick={() => setEditingFlag(null)}
                                                className="flex-1 bg-border/20 border border-border text-muted-foreground px-3 py-2 text-xs font-bold uppercase hover:bg-border/30 transition-all"
                                            >
                                                CANCEL
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm mb-1">{flag.name}</h3>
                                            <p className="text-xs text-muted-foreground">{flag.description}</p>
                                            {flag.enabled_at && (
                                                <div className="text-xs text-green-500/70 mt-2">
                                                    ✓ Enabled since {new Date(flag.enabled_at).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] px-2 py-1 border font-bold ${flag.enabled ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-red-500 text-red-500 bg-red-500/10'}`}>
                                                {flag.enabled ? 'ENABLED' : 'DISABLED'}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setEditingFlag(flag.id);
                                                    setConfigForm(flag.config || {});
                                                }}
                                                disabled={!flag.enabled}
                                                className="text-[10px] border border-primary/30 text-primary px-2 py-1 font-bold uppercase hover:bg-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                title={flag.enabled ? 'Edit configuration' : 'Enable flag to edit'}
                                            >
                                                CONFIG
                                            </button>
                                            <button
                                                onClick={() => handleToggle(flag.id)}
                                                className={`text-[10px] px-2 py-1 font-bold uppercase transition-all ${flag.enabled ? 'border border-red-500/40 text-red-500 hover:bg-red-500/10' : 'border border-green-500/40 text-green-500 hover:bg-green-500/10'}`}
                                            >
                                                {flag.enabled ? 'DISABLE' : 'ENABLE'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {/* System Info */}
                <div className="border border-border/50 p-4 space-y-2 text-xs text-muted-foreground">
                    <div className="font-bold text-primary">ℹ️ Feature Flags</div>
                    <p>Control feature rollout and A/B testing without redeploying. Each flag can have custom configuration stored as JSON. Check FeatureFlag::isEnabled($name) in your code to respect flags.</p>
                </div>
            </div>
        </HackerLayout>
    );
}
