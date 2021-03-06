# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'mnvkfvfz5ashdr9k(wnl#5ia-yv@85@s=tu_*(d-aoix!zymz('

ALLOWED_HOSTS = []

CORS_ORIGIN_WHITELIST = [
    'http://localhost:8080'
]

CORS_ALLOW_CREDENTIALS = True

# Allow only in dev. mode
# When set to None, cookie can be used with CORS


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
