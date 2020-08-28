from django.urls import path, re_path
from .views import AllEvents, EventDetails, Locations

urlpatterns = [
    path('events/', AllEvents.as_view()),
    re_path(r'^events/details/(?P<event_id>[0-9])/$', EventDetails.as_view()),
    path('locations/', Locations.as_view())
]