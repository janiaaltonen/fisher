# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

import os

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')