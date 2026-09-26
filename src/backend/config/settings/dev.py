import base64
from decouple import config

from .base import *

# ? --- SECRET KEY SETTINGS
# ? -----------------------
SECRET_KEY = config("DJANGO_SECRET_KEY", default="secret_key_for_dummy_guys")

# ? --- DEBUG & LIVE RELOAD
# ? -----------------------
# DEBUG = config("DJANGO_DEBUG", default=True, cast=bool)

# ! --- FOR MANUAL START | DEBUG
DEBUG = False

if DEBUG:
    MIDDLEWARE += [
        # ? --- LIVE RELOAD
        # ? ---------------
        "livereload.middleware.LiveReloadScript",
    ]

# ? --- ALLOWED HOSTS
# ? -----------------
ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS", default="*").split(",")

# ? --- Database settings for development mode
# ? ------------------------------------------
DATABASES = {
    # "default": {
    #     "ENGINE": "django.db.backends.postgresql",
    #     "NAME": config("POSTGRES_DB", default="polimerbeton_db__dev"),
    #     "USER": config("POSTGRES_USER", default="admin"),
    #     "PASSWORD": config("POSTGRES_PASSWORD", default="qwerty123456"),
    #     "HOST": config("POSTGRES_HOST", default="localhost"),
    #     "PORT": config("POSTGRES_PORT", default=5432, cast=int),
    # },
    # ! --- DEBUG | ONLY FOR MANUAL START | SQLITE DISABLED BY DEFAULT
    # ! --------------------------------------------------------------
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    },
}

# ? --- DATABASE FIELDS ENCRYPTION --- DISABLED IN DEV MODE
# ? -------------------------------------------------------
FIELD_ENCRYPTION_KEY = config(
    "FIELD_ENCRYPTION_KEY", default=base64.urlsafe_b64encode(b"0" * 32).decode()
).encode()

# ? --- CSRF
# ? --------
CSRF_TRUSTED_ORIGINS = config(
    "CSRF_TRUSTED_ORIGINS", default="http://127.0.0.1:8000,http://localhost:8000"
).split(",")
