from django.urls import path
from .views import AllEvents, EventDetails, Locations

urlpatterns = [
    path('events/', AllEvents.as_view()),
    path('events/details/', EventDetails.as_view()),
    path('locations/', Locations.as_view())
]