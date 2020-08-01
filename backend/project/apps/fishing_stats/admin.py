from django.contrib import admin
from .models import FishingEvent, FishCatch, FishingTechnique

admin.site.register(FishingEvent)
admin.site.register(FishCatch)
admin.site.register(FishingTechnique)
