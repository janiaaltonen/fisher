from django.urls import path
from .views import AuthView, SignUp

urlpatterns = [
    path('auth', AuthView.as_view()),
    path('signup', SignUp.as_view())
]
