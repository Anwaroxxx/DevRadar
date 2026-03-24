#!/bin/bash
set -e

# Update Apache to listen on the dynamic $PORT assigned by the hosting provider
# Render, Railway, Heroku, etc. provide this at runtime.
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf
sed -i "s/:80/:${PORT}/g" /etc/apache2/sites-available/000-default.conf

# Cache configuration for production speed
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations automatically on startup
# (Warning: For SQLite, data resets on each deploy)
php artisan migrate --force

# Pass control to the main Docker CMD (Apache)
exec "$@"
