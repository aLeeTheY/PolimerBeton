from pathlib import Path
from decouple import (
    config as default_config,
    Config,
    RepositoryEnv,
)
from django.utils.translation import gettext_lazy as _

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
if ENV_FILE:
    # ? Локалка: читаем напрямую из найденного .env
    config = Config(RepositoryEnv(ENV_FILE))
else:
    # ? Docker: читаем из системного окружения os.environ
    config = default_config

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
    "django.middleware.locale.LocaleMiddleware",
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
USE_I18N = True
LANGUAGE_CODE = "ru"
LANGUAGES = [
    ("ru", _("Russian")),
    ("en", _("English")),
]
LOCALE_PATHS = [BASE_DIR / "locale"]

TIME_ZONE = "Europe/Moscow"
USE_TZ = True
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
SENDER_EMAIL = config("SENDER_EMAIL")
SENDER_EMAIL_PASSWORD = config("SENDER_EMAIL_PASSWORD")
RECIPIENT_EMAIL = config("RECIPIENT_EMAIL")

# * Mailjet
USE_MAILJET_HTTP_SERVER = config("USE_MAILJET_HTTP_SERVER", cast=bool)

MAILJET_APIKEY_PUBLIC = config("MAILJET_APIKEY_PUBLIC")
MAILJET_APIKEY_PRIVATE = config("MAILJET_APIKEY_PRIVATE")

# * Django SMTP
USE_DJANGO_SMTP_SERVER = config("USE_DJANGO_SMTP_SERVER", cast=bool)

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = config("EMAIL_HOST")
EMAIL_PORT = config("EMAIL_PORT", cast=int)
EMAIL_USE_SSL = config("EMAIL_USE_SSL", cast=bool)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", cast=bool)

EMAIL_HOST_USER = SENDER_EMAIL
EMAIL_HOST_PASSWORD = SENDER_EMAIL_PASSWORD
DEFAULT_FROM_EMAIL = SENDER_EMAIL

EMAIL_TIMEOUT = 30  # даём 10 секунд на отправку
