from .base import *

# ? --- SECRET KEY SETTINGS
# ? -----------------------
SECRET_KEY = config("DJANGO_SECRET_KEY")

# ? --- DEBUG SETTINGS
# ? ------------------
DEBUG = config("DJANGO_DEBUG", cast=bool)

# ? --- ALLOWED HOSTS
# ? -----------------
ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS").split(",")

# ? --- Database settings for production mode
# ? -----------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("POSTGRES_DB"),
        "USER": config("POSTGRES_USER"),
        "PASSWORD": config("POSTGRES_PASSWORD"),
        "HOST": config("POSTGRES_HOST"),
        "PORT": config("POSTGRES_PORT", cast=int),
    }
}

# ? --- DATABASE FIELDS ENCRYPTION
# ? ------------------------------
FIELD_ENCRYPTION_KEY = config("DATABASE_FIELD_ENCRYPTION_KEY").encode()

# ? --- CSRF
# ? --------
CSRF_TRUSTED_ORIGINS = config("DJANGO_CSRF_TRUSTED_ORIGINS").split(",")

# ? --- SECURITY SETTINGS (SSL/HTTPS)
# ? ---------------------------------
# SECURE_SSL_REDIRECT = True | Nginx controlled
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# SECURE_HSTS_SECONDS = 31536000  # ? --- 1 YEAR
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# SECURE_HSTS_PRELOAD = True

# X_FRAME_OPTIONS = "DENY"

# SECURE_CONTENT_TYPE_NOSNIFF = True
# SECURE_BROWSER_XSS_FILTER = True

# ? --- STORAGES
# ? ------------
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.ManifestStaticFilesStorage",
    },
}
