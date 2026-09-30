from pathlib import Path
from decouple import Config, RepositoryEnv

DEFAULT_CHARSET = "utf-8"
FILE_CHARSET = "utf-8"

BASE_DIR = Path(__file__).resolve().parent.parent.parent
PROJECT_ROOT = BASE_DIR.parent.parent
ENV_DIR = PROJECT_ROOT / "env"

# * Порядок приоритета загрузки конфигурационных файлов
ENV_CANDIDATES = [
    ENV_DIR / ".env",
    ENV_DIR / ".env.prod",
    ENV_DIR / ".env.staging",
    ENV_DIR / ".env.dev",
]

# * Ищем первый существующий файл | выбрасываем ошибку, если ни одного файла не найдено
ENV_FILE = next((file for file in ENV_CANDIDATES if file.exists()), None)
if ENV_FILE is None:
    raise FileNotFoundError(
        f"Ни один файл окружения не найден в папке {ENV_DIR}.\n"
        f"Ожидался один из файлов: {[f.name for f in ENV_CANDIDATES]}"
    )

# * Подгружаем конфигурацию (.env) в проект
config = Config(RepositoryEnv(ENV_FILE))

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    # ? --- STATIC FILES
    "django.contrib.staticfiles",
    # ? --- WIDGET TWEAKS
    "widget_tweaks",
    # ? --- SITEMAP GENERATOR
    "django.contrib.sites",
    "django.contrib.sitemaps",
    # ? --- MY APPS
    "apps.MainApp",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "apps.MainApp.context_processors.site_config",
                "apps.MainApp.context_processors.current_year",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ? --- PASSWORD VALIDATION
# ? -----------------------
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# ? --- i18n / l10n
# ? ---------------
LANGUAGE_CODE = "ru"  # Устанавливаем язык по умолчанию на русский
TIME_ZONE = "Europe/Moscow"
USE_I18N = True
USE_TZ = True
LOCALE_PATHS = [BASE_DIR / "locales"]
#! USE_L10N = True

# ? --- STATIC FILES
# ? ----------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_DIRS = []
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ? --- SITEMAP
# ? -----------
SITE_ID = config("SITE_ID", default=1, cast=int)

# ? --- EMAIL SERVICE CONFIGURATION
# ? -------------------------------
SENDER_EMAIL = config("SENDER_EMAIL", default="")
SENDER_EMAIL_PASSWORD = config("SENDER_EMAIL_PASSWORD", default="")
RECIPIENT_EMAIL = config("RECIPIENT_EMAIL", default="")

# * Mailjet
USE_MAILJET_HTTP_SERVER = config("USE_MAILJET_HTTP_SERVER", default=False, cast=bool)

MAILJET_APIKEY_PUBLIC = config("MAILJET_APIKEY_PUBLIC", default="")
MAILJET_APIKEY_PRIVATE = config("MAILJET_APIKEY_PRIVATE", default="")

# * Django SMTP
USE_DJANGO_SMTP_SERVER = config("USE_DJANGO_SMTP_SERVER", default=True, cast=bool)

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = config("EMAIL_HOST", default="smtp.gmail.com")
EMAIL_PORT = config("EMAIL_PORT", default=587, cast=int)
EMAIL_USE_SSL = config("EMAIL_USE_SSL", default=False, cast=bool)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=True, cast=bool)

EMAIL_HOST_USER = SENDER_EMAIL
EMAIL_HOST_PASSWORD = SENDER_EMAIL_PASSWORD
DEFAULT_FROM_EMAIL = SENDER_EMAIL

EMAIL_TIMEOUT = 30  # даём 10 секунд на отправку
