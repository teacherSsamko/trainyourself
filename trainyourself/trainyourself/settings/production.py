from .base import *

DEBUG = False

ALLOWED_HOSTS = ['34.64.213.249']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'name',
        'USER': 'user',
        'PASSWORD': 'password'
    }
}
