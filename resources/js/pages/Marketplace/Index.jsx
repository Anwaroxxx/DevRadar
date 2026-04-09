import { Head, useForm, usePage } from '@inertiajs/react';
import HackerLayout from '@/layouts/HackerLayout';
import { ShoppingBag, Zap, Cpu, CreditCard, Ticket, AlertTriangle, CheckCircle } from 'lucide-react';

export default function MarketplaceIndex({ products }) {
    const { auth } = usePage().props;
    const { post, processing } = useForm();

    const handlePurchase = (productId) => {
        post('/marketplace/purchase', {
            data: { product_id: productId }
        });
    };

    return (
        <HackerLayout>
            <Head title="Tech Marketplace" />
            
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-primary/30 pb-6">
                    <div className="flex items-center gap-4">
                        <ShoppingBag className="w-12 h-12 text-primary" />
                        <div>
                            <h1 className="text-4xl font-black uppercase text-foreground leading-none">Marketplace</h1>
                            <p className="font-mono text-sm text-muted-foreground mt-2 tracking-widest uppercase opacity-80">Redeem XP for rewards and vouchers</p>
                        </div>
                    </div>
                    
                    <div className="mt-6 md:mt-0 bg-black/60 border-2 border-primary p-6 shadow-[0_0_20px_rgba(34,197,94,0.15)] flex flex-col items-center min-w-[200px]">
                        <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Your Balance</div>
                        <div className="text-4xl font-black text-primary flex items-center gap-2">
                             {auth.user.xp} <Zap className="w-6 h-6 fill-primary" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="bg-card border-2 border-border/50 hover:border-primary transition-all p-6 relative group flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-3">
                                {product.type === 'ai_access' && <Cpu className="w-6 h-6 text-primary animate-pulse" />}
                                {product.type === 'voucher' && <Ticket className="w-6 h-6 text-yellow-500" />}
                                {product.type === 'gift_card' && <CreditCard className="w-6 h-6 text-blue-500" />}
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors pr-8 uppercase tracking-tighter">{product.name}</h3>
                            <p className="text-muted-foreground text-sm font-mono mb-6 flex-1 italic leading-relaxed">
                                {product.description}
                            </p>

                            <div className="mt-auto pt-6 border-t border-border/50">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-xs font-mono text-muted-foreground uppercase">Price</div>
                                    <div className="text-2xl font-black text-foreground flex items-center gap-1">
                                        {product.cost} <span className="text-xs text-primary font-bold">XP</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handlePurchase(product.id)}
                                    disabled={processing || auth.user.xp < product.cost}
                                    className={`w-full py-3 font-black uppercase text-sm tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${
                                        auth.user.xp >= product.cost 
                                        ? 'border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                                        : 'border-muted-foreground/30 text-muted-foreground bg-muted-foreground/5 cursor-not-allowed opacity-50'
                                    }`}
                                >
                                    {auth.user.xp >= product.cost ? 'Redeem Now' : 'Insufficient XP'}
                                </button>
                                
                                {auth.user.xp < product.cost && (
                                    <p className="text-[10px] font-mono text-destructive mt-3 text-center uppercase tracking-tighter">
                                        <AlertTriangle className="inline w-3 h-3 mb-0.5 mr-1" /> Requires {product.cost - auth.user.xp} more XP
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Box */}
                <div className="mt-16 bg-primary/5 border border-primary/20 p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 border-2 border-primary flex items-center justify-center shrink-0">
                         <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg uppercase text-primary">Secure Trading</h4>
                        <p className="text-sm text-muted-foreground font-mono mt-1 opacity-80">
                            The DevRadar Marketplace follows end-to-end secure redemption. Once XP is spent, rewards are added to your profile immediately. Gift cards will be sent to your registered email address.
                        </p>
                    </div>
                </div>
            </div>
        </HackerLayout>
    );
}
