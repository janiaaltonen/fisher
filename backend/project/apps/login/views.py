from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import exceptions, permissions, authentication
from .utils import generate_access_token, generate_refresh_token, CustomResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
import datetime
from django.contrib.auth.forms import UserCreationForm


class AuthView(APIView):

    authentication_classes = []
    permission_classes = [permissions.AllowAny]  # make this endpoint public

    @method_decorator(ensure_csrf_cookie, name='dispatch')
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        cr = CustomResponse(username, password)
        cr.set_data({'detail': 'login successful'})

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



