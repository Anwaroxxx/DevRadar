import { usePage } from '@inertiajs/react';

export function useCurrentUrl() {
    const { url } = usePage();
    
    // Simple helper to check if a URL is active
    const isCurrentUrl = (path, startsWith = false) => {
        if (startsWith) {
            return url.startsWith(path);
        }
        return url === path;
    };

    return {
        url,
        isCurrentUrl,
    };
}
