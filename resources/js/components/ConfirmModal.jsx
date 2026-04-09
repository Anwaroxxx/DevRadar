import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Terminal } from 'lucide-react';

export default function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Confirm Action', 
    description = 'Are you sure you want to proceed?', 
    confirmText = 'Execute', 
    cancelText = 'Abort',
    variant = 'default',
    showCancel = true,
    children
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md border-2 border-primary/50 bg-black/95 font-mono">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 border ${variant === 'destructive' ? 'border-red-500 bg-red-500/10' : 'border-primary bg-primary/10'}`}>
                            {variant === 'destructive' ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <Terminal className="w-5 h-5 text-primary" />}
                        </div>
                        <DialogTitle className="text-xl font-black uppercase tracking-tighter text-foreground">
                            {title}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-muted-foreground uppercase tracking-widest leading-relaxed">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                
                {children}

                <div className="py-4 opacity-30 pointer-events-none">
                    <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-1" />
                    <div className="text-[8px] flex justify-between uppercase">
                        <span>Status: Waiting_Response</span>
                        <span>Security_Level: High</span>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between gap-4">
                    {showCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 border-primary/20 hover:bg-primary/10 hover:border-primary text-primary transition-all rounded-none uppercase text-xs font-bold"
                        >
                            {cancelText}
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant={variant === 'destructive' ? 'destructive' : 'default'}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 rounded-none uppercase text-xs font-bold ${
                            variant === 'destructive' 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-primary hover:bg-primary/90 text-black'
                        }`}
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
                
                {/* Decorative scanning line */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/20 animate-pulse" />
            </DialogContent>
        </Dialog>
    );
}
