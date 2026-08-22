import { usePage } from '@inertiajs/react';

/**
 * Client-side role gate for UI sections. The backend `role:` middleware
 * remains the source of truth — this only hides what a user cannot use.
 *
 * Usage: <RoleGuard allow={['moderator']}>...</RoleGuard>
 * Admins always pass unless listed in `except`.
 */
export default function RoleGuard({ children, allow = [], except = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    if (!user) return null;

    const userRoles = Array.isArray(user.role)
        ? user.role
        : [user.role].filter(Boolean);

    if (except.some((role) => userRoles.includes(role))) return null;

    if (allow.length === 0) return <>{children}</>;

    const isStaff = userRoles.includes('admin');
    const allowed = allow.some((role) => userRoles.includes(role));

    return <>{isStaff || allowed ? children : null}</>;
}
