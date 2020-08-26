from django.urls import path
from .views import AuthView, RefreshView, SignUp

urlpatterns = [
    path('auth', AuthView.as_view()),
    path('refresh', RefreshView.as_view()),
    path('signup', SignUp.as_view())
]
