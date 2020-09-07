from django.urls import path, re_path
from .views import AllEvents, CreateEvent, EventDetails, ChoicesOptions, Locations

urlpatterns = [
    path('events/', AllEvents.as_view()),
    path('events/create', CreateEvent.as_view()),
    re_path(r'^events/details/(?P<event_id>\d+)/$', EventDetails.as_view()),
    path('locations/', Locations.as_view()),
    path('formOptions/', ChoicesOptions.as_view())
]