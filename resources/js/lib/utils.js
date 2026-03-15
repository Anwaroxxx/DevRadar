import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function toUrl(url) {
    if (!url) return '';
    return typeof url === 'string' ? url : (url.url || '');
}
