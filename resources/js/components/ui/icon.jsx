import * as React from 'react';

export function Icon({ icon: IconComponent, className, ...props }) {
    if (!IconComponent) {
        return null;
    }

    return <IconComponent className={className} {...props} />;
}
