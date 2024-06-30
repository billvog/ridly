"""
Django settings for ridly project.

Generated by 'django-admin startproject' using Django 5.0.4.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
from corsheaders.defaults import default_headers
from decouple import config


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

SECRET_KEY = config("DJANGO_SECRET_KEY", cast=str)

DEBUG = config("DEBUG", default=False, cast=bool)

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
  "daphne",
  "corsheaders",
  "django.contrib.admin",
  "django.contrib.auth",
  "django.contrib.contenttypes",
  "django.contrib.sessions",
  "django.contrib.messages",
  "django.contrib.staticfiles",
  "django.contrib.gis",
  "drf_spectacular",
  "rest_framework",
  "ridly",
  "user",
  "user.avatar",
  "user.profile",
  "user.profile.follow",
  "oauth",
  "creator",
  "event",
  "hunt",
]

MIDDLEWARE = [
  "corsheaders.middleware.CorsMiddleware",
  "user.middleware.RefreshJWTMiddleware",
  "django.middleware.security.SecurityMiddleware",
  "django.contrib.sessions.middleware.SessionMiddleware",
  "django.middleware.common.CommonMiddleware",
  "django.middleware.csrf.CsrfViewMiddleware",
  "django.contrib.auth.middleware.AuthenticationMiddleware",
  "django.contrib.messages.middleware.MessageMiddleware",
  "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "ridly.urls"

AUTH_USER_MODEL = "user.User"

TEMPLATES = [
  {
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {
      "context_processors": [
        "django.template.context_processors.debug",
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
      ],
    },
  },
]

WSGI_APPLICATION = "ridly.wsgi.application"
ASGI_APPLICATION = "ridly.asgi.application"


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
  "default": {
    "ENGINE": "django.contrib.gis.db.backends.postgis",
    "NAME": config(
      "POSTGRES_DB",
    ),
    "USER": config("POSTGRES_USER"),
    "PASSWORD": config("POSTGRES_PASSWORD"),
    "HOST": config("POSTGRES_HOST", default="db"),
    "PORT": config("POSTGRES_PORT", default="5432"),
  }
}

# Redis

REDIS = {
  "default": {
    "HOST": config("REDIS_HOST", default="redis"),
    "PORT": config("REDIS_PORT", default=6379),
  }
}

# Channels Redis setup

CHANNEL_LAYERS = {
  "default": {
    "BACKEND": "channels_redis.core.RedisChannelLayer",
    "CONFIG": {
      "hosts": [(REDIS["default"]["HOST"], REDIS["default"]["PORT"])],
    },
  },
}

# Celery

CELERY_BROKER_URL = f"redis://{REDIS['default']['HOST']}:{REDIS['default']['PORT']}/0"


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

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


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Authentication token secrets
JWT_ACCESS_TOKEN_SECRET = config("JWT_ACCESS_TOKEN_SECRET", cast=str)
JWT_REFRESH_TOKEN_SECRET = config("JWT_REFRESH_TOKEN_SECRET", cast=str)

# Configure Cors
CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = list(default_headers) + [
  "x-access-token",
  "x-refresh-token",
]

CORS_EXPOSE_HEADERS = [
  "x-access-token",
  "x-refresh-token",
]

# Django Rest Framework
REST_FRAMEWORK = {
  "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
  "EXCEPTION_HANDLER": "ridly.exceptions.custom_exception_handler",
  "DEFAULT_AUTHENTICATION_CLASSES": (
    "rest_framework.authentication.SessionAuthentication",
    "user.authentication.JWTAuthentication",
  ),
}

SPECTACULAR_SETTINGS = {
  "TITLE": "Ridly API",
  "DESCRIPTION": "Outdoor Treasure Hunt",
  "VERSION": "1.0.0",
  "SERVE_INCLUDE_SCHEMA": False,
}


# Google Cloud Storage
GS_BUCKET_NAME = config("GS_BUCKET_NAME", cast=str)

# Imgix
IMGIX_SOURCE = config("IMGIX_SOURCE", cast=str)
