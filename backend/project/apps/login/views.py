from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import exceptions, permissions, authentication
from .utils import CookieResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
import datetime
from django.contrib.auth.forms import UserCreationForm
from .authentication import JWTAuthentication


class AuthView(APIView):

    authentication_classes = []
    permission_classes = [permissions.AllowAny]  # make this endpoint public

    @method_decorator(ensure_csrf_cookie, name='dispatch')
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        cr = CookieResponse()
        if cr.is_authenticated(username, password):
            cr.generate_tokens()
        cr.set_data({'detail': 'login successful'})
        return cr.response


class RefreshView(APIView):

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    #@method_decorator(csrf_protect)
    def post(self, request):
        auth = JWTAuthentication()
        user = auth.check_refresh_token(request)
        cr = CookieResponse()
        cr.user = user
        cr.obtain_new_access_token()
        cr.set_data({
            'detail': 'new access token obtained'
        })
        return cr.response



class SignUp(APIView):

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            cr = CookieResponse()
            if cr.is_authenticated(username, password):
                cr.generate_tokens()
            cr.set_data({'detail': 'User created and login successful'})
            return cr.response
        else:
            # form = UserCreationForm()
            # print(form.errors.get_json_data(escape_html=True)) escaped ver.
            return Response(form.errors.as_json())



