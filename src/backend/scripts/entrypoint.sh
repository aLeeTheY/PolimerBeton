#!/bin/sh
set -e

# --- Ожидание запуска PostgreSQL ---
echo "Waiting for postgres..."
while ! nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  sleep 0.1
done
echo "PostgreSQL started!"

# Сбрасываем базу (для dev)
python manage.py flush --noinput

# Применяем миграции
python manage.py migrate --noinput

# --- Создание суперпользователя ---
# Используем переменные окружения:
# DJANGO_SUPERUSER_EMAIL
# DJANGO_SUPERUSER_USERNAME
# DJANGO_SUPERUSER_PASSWORD

python manage.py shell << END
from django.contrib.auth import get_user_model
import os

User = get_user_model()
email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

if username and email and password:
    if not User.objects.filter(username=username).exists():
        print("Creating Django superuser...")
        user = User.objects.create_superuser(username=username, email=email, password=password)
    else:
        print("Superuser already exists.")
END

# --- Запуск основной команды контейнера ---
exec "$@"