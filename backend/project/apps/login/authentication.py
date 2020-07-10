import jwt
from rest_framework.authentication import BaseAuthentication
from django.middleware.csrf import CsrfViewMiddleware
from rest_framework import exceptions
from project.settings.base import security
from django.contrib.auth import get_user_model


class CSRFCheck(CsrfViewMiddleware):

    def _reject(self, request, reason):
        # return the failure reason instead of an HttpResponse
        return reason


class JWTAuthentication(BaseAuthentication):
    """
        custom authentication class for DRF and JWT
    """
    def authenticate(self, request):
        User = get_user_model()
        access_token = request.COOKIES.get('access_token')
        if access_token is None:
            raise exceptions.AuthenticationFailed('Credentials were not proved')
        try:
            payload = jwt.decode(
                access_token, security.SECRET_KEY, algorithms=['HS256']
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Access token expired')
        user = User.objects.filter(id=payload['user_id']).first()
        if user is None:
            raise exceptions.AuthenticationFailed('User not found')
        if not user.is_active:
            raise exceptions.AuthenticationFailed('User is inactive')
        self.enforce_csrf(request)
        return user, None

    def enforce_csrf(self, request):
        """
            enforce CSRF validation
        """
        check = CSRFCheck()
        # populates request.META['CSRF_COOKIE'], which is used in process_view()
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        print(reason)
        if reason:
            raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)
