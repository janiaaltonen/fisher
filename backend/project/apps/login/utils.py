import datetime
import jwt
from django.conf import settings


def generate_access_token(user):

    payload = {
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=0, minutes=5),
        'iat': datetime.datetime.utcnow()
    }
    access_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256').decode('utf-8')
    return access_token


def generate_refresh_token(user):

    payload = {
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow()
    }
    refresh_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256').decode('utf-8')
    return refresh_token
