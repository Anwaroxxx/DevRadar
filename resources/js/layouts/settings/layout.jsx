import { Link, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const sidebarNavItems = [
    {
        title: 'Profile',
        href: '/profile/edit',
    },
    {
        title: 'Password',
        href: '/settings/password',
    },
    {
        title: 'Appearance',
        href: '/settings/appearance',
    },
];

export default function SettingsLayout({ children }) {
    const { url } = usePage();

    return (
        <div className="px-4 py-6">
            <Heading
                title="Settings"
                description="Manage your account settings and preferences."
            />
            
            <Separator className="my-6" />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav
                        className="flex flex-col space-y-1"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item) => (
                            <Button
                                key={item.href}
                                variant="ghost"
                                className={url === item.href ? "justify-start bg-muted" : "justify-start"}
                                asChild
                            >
                                <Link href={item.href}>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <div className="flex-1 md:max-w-2xl lg:pl-8">
                    <section className="max-w-xl space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
