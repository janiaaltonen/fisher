# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases
import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'fisher',
        'USER': 'jani',
        'PASSWORD': 'EttaN1822',
        'HOST': 'db',
        'PORT': '3306',
    }
}
