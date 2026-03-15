import { usePage } from '@inertiajs/react';
import { SidebarProvider } from '@/components/ui/sidebar';

export function AppShell({ children, variant = 'sidebar' }) {
    const { sidebarOpen } = usePage().props;

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">{children}</div>
        );
    }

    return (
        <SidebarProvider defaultOpen={sidebarOpen}>
            {children}
        </SidebarProvider>
    );
}
