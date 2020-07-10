from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import exceptions, permissions, authentication
from .utils import generate_access_token, generate_refresh_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
import datetime


class AuthView(APIView):

    authentication_classes = []
    permission_classes = [permissions.AllowAny] # make this endpoint public

    @method_decorator(ensure_csrf_cookie, name='dispatch')
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        response = Response()
        if (username is None) or password is None:
            raise exceptions.AuthenticationFailed()
        user = authenticate(username=username, password=password)
        if user is None:
            raise exceptions.AuthenticationFailed('wrong username or password')
        access_token_age = datetime.timedelta.total_seconds(datetime.timedelta(hours=0, minutes=5))
        access_token = generate_access_token(user)
        refresh_token_age = datetime.timedelta.total_seconds(datetime.timedelta(days=1))
        refresh_token = generate_refresh_token(user)
        response.set_cookie(key='refresh_token', value=refresh_token, httponly=True, max_age=refresh_token_age)
        response.set_cookie(key='access_token', value=access_token, httponly=True, max_age=access_token_age)
        response.data = {
            'detail': 'login successful'
        }
        return response
