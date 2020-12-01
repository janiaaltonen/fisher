from django.urls import path, re_path
from .views import AuthView, RefreshView, SignUp, SignUpCheck

urlpatterns = [
    path('auth', AuthView.as_view()),
    path('refresh', RefreshView.as_view()),
    path('signup', SignUp.as_view()),
    re_path(r'^signup/username/(?P<username>\w+)', SignUp.as_view()),
    re_path(r'^signup_check/username/', SignUpCheck.as_view()),
    re_path(r'^signup_check/email/', SignUpCheck.as_view()),

]
