import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}WithChildren<{
    name?;
    title?;
    description?;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                
                    <div className="flex h-9 w-9 items-center justify-center">
                        
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    
                        
                            {title}</CardTitle>
                            {description}</CardDescription>
                        </CardHeader>
                        
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
