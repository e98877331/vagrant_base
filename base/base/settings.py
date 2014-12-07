"""
Django settings for base project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

#cyy shouldn this  declare here?
#DBPATH = os.path.join('/', 'opt', 'base', 'db', 'db.sqlite3')
DBPATH = os.path.join(BASE_DIR, 'db.sqlite3')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '-$0bqib#3qx6zr+(v-ra%9z=!#3vd$4gkz5vh##*f=#n=!8hnz'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = False

ALLOWED_HOSTS = ['*']


# Application definition

AUTH_USER_MODEL='IOUOI.MyUser'

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'pinax_theme_bootstrap',
    'bootstrapform',
    'pipeline',
    'account',
    'IOUOI',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.core.context_processors.i18n',
    'django.core.context_processors.request',
    'pinax_theme_bootstrap.context_processors.theme',
)

ROOT_URLCONF = 'base.urls'

WSGI_APPLICATION = 'base.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

'''DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'OPTIONS': {
            'read_default_file': '/path/to/my.cnf',
        },
    }
}'''

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': DBPATH,
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, 'base', "templates"),
)

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'base', "static"),
)
# Pipeline settings
STATICFILES_STORAGE = 'pipeline.storage.PipelineCachedStorage'

PIPELINE_CSS = {
    'base': {
        'source_filenames': (
            'components/bootstrap-3.3.0/css/bootstrap.css',
        ),
        'output_filename': 'css/base.css',
        # 'extra_context': {
        #    'media': 'screen,projection',
        # },
    },
    'iouoi': {
        'source_filenames': (
            'css/IOUOI/iouoi.css',
        ),
        'output_filename': 'css/iouoi.css',
    },
}


PIPELINE_JS = {
    'base_libs': {
        'source_filenames': (
            'components/jquery-2.1.1/jquery-2.1.1.js',
            'components/bootstrap-3.3.0/js/bootstrap.js',
        ),
        'output_filename': 'js/base_libs.js',
    },
    'iouoi': {
        'source_filenames': (
            'js/iouoi/iouoi.js',
        ),
        'output_filename': 'js/iouoi.js',
    },
}

# Account settings
ACCOUNT_EMAIL_CONFIRMATION_REQUIRED = False
ACCOUNT_EMAIL_CONFIRMATION_EMAIL = False

# jade template loader
TEMPLATE_LOADERS = (
    ('pyjade.ext.django.Loader', (
        'django.template.loaders.filesystem.Loader',
        'django.template.loaders.app_directories.Loader',
    )),
)
