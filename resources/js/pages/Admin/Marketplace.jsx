import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Package, Plus, AlertTriangle, Edit, Trash2 } from 'lucide-react';

export default function AdminMarketplace({ items, filters, categories }) {
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({ price_xp: 0, max_quantity: null });
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (search) params.search = search;
        if (selectedCategory) params.category = selectedCategory;
        router.get('/admin/marketplace', params, { preserveState: true });
    };

    const handleToggleAvailability = (itemId) => {
        router.post(`/admin/marketplace/${itemId}/toggle`);
    };

    const handleUpdatePrice = (itemId) => {
        router.put(`/admin/marketplace/${itemId}/price`, editForm, {
            onSuccess: () => {
                setEditingItem(null);
                setEditForm({ price_xp: 0, max_quantity: null });
            }
        });
    };

    const handleDelete = (itemId) => {
        if (!confirm('Delete this marketplace item?')) return;
        router.delete(`/admin/marketplace/${itemId}`);
    };

    return (
        <HackerLayout>
            <Head title="Admin — Marketplace" />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-primary/30 pb-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-mono text-xs">← ADMIN</Link>
                        <span className="text-border">/</span>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <ShoppingCart className="w-6 h-6 text-primary" /> MARKETPLACE
                        </h1>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                        {items.total} items
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search items..."
                                className="w-full bg-card border border-primary/30 pl-9 pr-4 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="bg-card border border-primary/30 px-4 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-all"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                        </select>
                        <button type="submit" className="bg-primary/20 text-primary border border-primary px-4 py-2 text-xs font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all">
                            SEARCH
                        </button>
                    </form>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.data.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`border p-4 transition-all ${item.is_available ? 'border-primary/30 bg-primary/5 hover:border-primary' : 'border-red-500/30 bg-red-500/5'}`}
                        >
                            {/* Item Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm">{item.name}</h3>
                                    <span className="text-[10px] text-muted-foreground px-1 py-0.5 border border-border rounded inline-block mt-1">
                                        {item.category.toUpperCase()}
                                    </span>
                                </div>
                                {!item.is_available && <div className="text-[10px] font-bold text-red-500 px-2 py-1 border border-red-500 bg-red-500/10">DISABLED</div>}
                            </div>

                            {/* Description */}
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

                            {/* Price & Stock */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Price:</span>
                                    <span className="font-bold text-primary">{item.price_xp} XP</span>
                                </div>
                                {item.max_quantity && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Max Stock:</span>
                                        <span className="font-bold">{item.max_quantity}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Sold:</span>
                                    <span className="font-bold">{item.quantity_sold}</span>
                                </div>
                            </div>

                            {/* Edit Form (if editing) */}
                            {editingItem === item.id ? (
                                <div className="space-y-2 mb-4 bg-black/50 p-2 border border-primary/20">
                                    <input
                                        type="number"
                                        value={editForm.price_xp}
                                        onChange={e => setEditForm({ ...editForm, price_xp: parseInt(e.target.value) })}
                                        placeholder="Price XP"
                                        className="w-full bg-black border border-primary/30 p-1 text-xs font-mono focus:outline-none focus:border-primary"
                                    />
                                    <input
                                        type="number"
                                        value={editForm.max_quantity || ''}
                                        onChange={e => setEditForm({ ...editForm, max_quantity: e.target.value ? parseInt(e.target.value) : null })}
                                        placeholder="Max Quantity (optional)"
                                        className="w-full bg-black border border-primary/30 p-1 text-xs font-mono focus:outline-none focus:border-primary"
                                    />
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleUpdatePrice(item.id)}
                                            className="flex-1 text-[10px] bg-primary/20 text-primary border border-primary px-2 py-1 font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all"
                                        >
                                            SAVE
                                        </button>
                                        <button
                                            onClick={() => setEditingItem(null)}
                                            className="flex-1 text-[10px] bg-border/20 border border-border text-muted-foreground px-2 py-1 font-bold uppercase hover:bg-border/30 transition-all"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            ) : null}

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-border/50">
                                <button
                                    onClick={() => {
                                        setEditingItem(item.id);
                                        setEditForm({ price_xp: item.price_xp, max_quantity: item.max_quantity });
                                    }}
                                    className="flex-1 text-[10px] border border-primary/30 text-primary px-2 py-1 font-bold uppercase hover:bg-primary/10 transition-all flex items-center justify-center gap-1"
                                >
                                    <Edit className="w-3 h-3" /> EDIT PRICE
                                </button>
                                <button
                                    onClick={() => handleToggleAvailability(item.id)}
                                    className={`flex-1 text-[10px] px-2 py-1 font-bold uppercase transition-all ${item.is_available ? 'border border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10' : 'border border-green-500/40 text-green-500 hover:bg-green-500/10'}`}
                                >
                                    {item.is_available ? 'DISABLE' : 'ENABLE'}
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-[10px] border border-red-500/40 text-red-500 px-2 py-1 font-bold uppercase hover:bg-red-500/10 transition-all"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-muted-foreground">
                        Page {items.current_page} of {items.last_page}
                    </div>
                    <div className="flex gap-2">
                        {items.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                disabled={!link.url}
                                className={`px-3 py-1 border text-xs font-bold transition-all ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'border-border text-muted-foreground hover:border-primary/50'
                                }`}
                            >
                                {link.label.replace('&laquo;', '←').replace('&raquo;', '→')}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </HackerLayout>
    );
}
