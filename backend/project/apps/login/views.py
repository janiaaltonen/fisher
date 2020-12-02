from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import exceptions, permissions, authentication, status
from .utils import CookieResponse, Availability
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
import datetime
from django.contrib.auth.forms import UserCreationForm
from .authentication import JWTAuthentication
from .forms import SignUpForm
from django.urls import resolve


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

    # @method_decorator(csrf_protect)
    def post(self, request):
        auth = JWTAuthentication()
        user = auth.check_refresh_token(request)
        cr = CookieResponse()
        cr.user = user
        cr.obtain_new_access_token()
        cr.set_data({
            'detail': 'access token obtained'
        })
        return cr.response


class SignUp(APIView):

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        form = SignUpForm(request.POST)
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
            raw_errors = form.errors.get_json_data(escape_html=True)
            # pop "code" key-values from JSON
            for key in raw_errors:
                for obj in raw_errors[key]:
                    obj.pop('code')
            # Use custom resp status instead of default 200
            return Response(raw_errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


    def get(self, request, **kwargs):
        username = kwargs['username']
        # email = kwargs['email']
        a = Availability()
        if username is not None and a.username_exists(username):
            msg = {"available": False}
            return Response(msg)
        return Response({"available": True})


class SignUpCheck(APIView):

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        url = request.path
        # split url and convert list to string using map
        resource = ''.join(map(str, str(url).split("/")[-2:-1]))
        if resource == 'username' and Availability.username_exists(request.POST[resource]):
            msg = {"available": False}
            return Response(msg, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        elif resource == 'email' and Availability.email_exists(request.POST[resource]):
            msg = {"available": False}
            return Response(msg, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            msg = {"available": True}
            return Response(msg)

