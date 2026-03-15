import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export default function TextLink({
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={cn(
                'text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline',
                className,
            )}
        >
            {children}
        </Link>
    );
}
