from django.urls import path
from .views import AllEvents, EventDetails

urlpatterns = [
    path('events/', AllEvents.as_view()),
    path('events/details/', EventDetails.as_view())
]