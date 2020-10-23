from django.urls import path, re_path
from .views import AllEvents, CreateEvent, EventDetails, StatsDetails, CatchDetails, ChoicesOptions, Locations

urlpatterns = [
    path('events/', AllEvents.as_view()),
    path('events/create', CreateEvent.as_view()),
    re_path(r'^events/details/(?P<event_id>\d+)/$', EventDetails.as_view()),
    re_path(r'^events/details/(?P<event_id>\d+)/stats/create/$', StatsDetails.as_view()),
    re_path(r'^events/details/(?P<event_id>\d+)/stats/(?P<stats_id>\d+)/$', StatsDetails.as_view()),
    re_path(r'^events/details/(?P<event_id>\d+)/catches/(?P<catch_id>\d+)/$', CatchDetails.as_view()),
    path('locations/', Locations.as_view()),
    path('formOptions/', ChoicesOptions.as_view())
]
