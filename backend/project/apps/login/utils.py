import datetime
import jwt
from django.conf import settings
from rest_framework.response import Response
from rest_framework import exceptions
from django.contrib.auth import authenticate
import datetime


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


class CookieResponse:

    def __init__(self):
        self.response = Response()
        self.user = None

    def authenticate_user(self, username, password):
        if username is None or password is None:
            raise exceptions.AuthenticationFailed
        self.user = authenticate(username=username, password=password)
        if self.user is None:
            raise exceptions.AuthenticationFailed('wrong username or password')
        return True

    def generate_tokens(self):
        access_token_age = datetime.timedelta.total_seconds(datetime.timedelta(hours=0, minutes=5))
        access_token = generate_access_token(self.user)
        refresh_token_age = datetime.timedelta.total_seconds(datetime.timedelta(days=1))
        refresh_token = generate_refresh_token(self.user)
        self.response.set_cookie(key='refresh_token', value=refresh_token, httponly=True, max_age=refresh_token_age)
        self.response.set_cookie(key='access_token', value=access_token, httponly=True, max_age=access_token_age)

    def obtain_new_access_token(self):
        access_token_age = datetime.timedelta.total_seconds(datetime.timedelta(hours=0, minutes=5))
        access_token = generate_access_token(self.user)
        self.response.set_cookie(key='access_token', value=access_token, httponly=True, max_age=access_token_age)

    def set_data(self, data):
        self.response.data = data



