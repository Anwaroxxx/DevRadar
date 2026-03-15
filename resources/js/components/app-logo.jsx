import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo({ className }) {
    return (
        <div className="flex items-center gap-2">
            <AppLogoIcon className={className || "size-5 fill-current"} />
        </div>
    );
}
