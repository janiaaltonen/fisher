from django.contrib import admin
from .models import FishingEvent, FishCatch

admin.site.register(FishingEvent)
admin.site.register(FishCatch)
