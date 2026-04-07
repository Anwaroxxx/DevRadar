#!/bin/bash
set -e
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf
sed -i "s/:80/:${PORT}/g" /etc/apache2/sites-available/000-default.conf

# Clear and cache configuration for production speed (matching deployment commands)
php artisan config:clear
php artisan config:cache
php artisan route:cache

# Run database migrations automatically on startup
php artisan migrate --force

# Seed the database with admin user and core data
php artisan db:seed --force

# Create the storage symlink for public file access (avatars, etc.)
# Remove existing symlink if it's broken/stale, then create/recreate it
if [ -L public/storage ]; then
    rm -f public/storage
fi
php artisan storage:link --force 2>/dev/null || ln -sf ../storage/app/public public/storage

# Pass control to the main Docker CMD (Apache)
exec "$@"
