#!/bin/bash
set -e

# Update Apache to listen on the dynamic $PORT assigned by the hosting provider
# Render, Railway, Heroku, etc. provide this at runtime.
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
php artisan storage:link --quiet

# Pass control to the main Docker CMD (Apache)
exec "$@"
