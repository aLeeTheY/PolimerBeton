#!/bin/sh
set -e

# --- Ожидание запуска PostgreSQL ---
echo "Waiting for postgres..."
while ! nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  sleep 0.1
done
echo "PostgreSQL started!"

# --- Django management commands ---
# echo "Delete old staticfiles..."
# rm -rf /home/warden/www/polimerbeton/staticfiles/* || true

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "Compressing assets..."
python manage.py compress

# --- Запуск основной команды контейнера ---
exec "$@"