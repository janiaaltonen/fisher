from django.db import models
from django.contrib.auth import get_user_model


class FishingEvent(models.Model):
    SNOWY = 'snowy'
    RAINY = 'rainy'
    CLOUDY = 'cloydy'
    PARTLY_CLOUDY = 'partly_cloudy'
    SUNNY = 'sunny'
    WEATHER_CHOICES = [
        (SNOWY, 'Lumisade'),
        (RAINY, 'Vesisade'),
        (CLOUDY, 'Pilvistä'),
        (PARTLY_CLOUDY, 'Puolipilvistä'),
        (SUNNY, 'Aurinkoista')
    ]
    User = get_user_model()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    location = models.CharField(max_length=100)
    location_details = models.TextField(default=None, null=True, blank=True)
    start_time = models.TimeField(default=None, null=True, blank=True)
    end_time = models.TimeField(default=None, null=True, blank=True)
    air_temperature = models.IntegerField(default=None, null=True, blank=True)
    persons = models.IntegerField()
    weather = models.CharField(max_length=20, choices=WEATHER_CHOICES, default=None, null=True, blank=True)

    def __str__(self):
        date_and_place = self.date.strftime('%d.%m.%Y') + ' ' + self.location
        return date_and_place

    def get_events(self, user_id):
        queryset = FishingEvent.objects.filter(user_id=user_id)
        return queryset

    def get_event_as_queryset(self, pk):
        queryset = FishingEvent.objects.filter(pk=pk)  # return specific event by user_id AND event's id
        return queryset

    def get_event_as_instance(self, pk):
        instance = FishingEvent.objects.get(pk=pk)  # return specific event by user_id AND event's id
        return instance

    def delete_event(self, user_id, pk):
        try:
            instance = FishingEvent.objects.filter(user_id=user_id).get(pk=pk)
            instance.delete()
            return True
        except self.DoesNotExist:
            return False


class FishingTechnique(models.Model):
    CASTING = 'Casting'
    FLY_FISHING = 'Fly fishing'
    TROLLING = "Trolling"
    NET_FISHING = 'Net fishing'
    POLE_FISHING = 'Pole fishing'
    METHOD_CHOICES = [
        (CASTING, 'Heittokalastus'),
        (FLY_FISHING, 'Perhokalastus'),
        (TROLLING, 'Vetouistelu'),
        (NET_FISHING, 'Verkko'),
        (POLE_FISHING, 'Onki')
    ]
    fishing_method = models.CharField(max_length=20, choices=METHOD_CHOICES, default=None, null=True, blank=True)
    method_details = models.TextField(default=None, null=True, blank=True)
    fishing_event = models.ForeignKey(FishingEvent, related_name='stats', on_delete=models.CASCADE)

    def __str__(self):
        name = '(' + str(self.fishing_event) + ') ' + self.fishing_method
        return name

    def delete_technique(self, pk):
        try:
            instance = FishingTechnique.objects.get(pk=pk)
            instance.delete()
            return True
        except self.DoesNotExist:
            return False


class FishCatch(models.Model):
    BREAM = 'Bream'
    PERCH = 'Perch'
    PIKE = 'Pike'
    ROACH = 'Roach'
    WHITE_FISH = 'White fish'
    ZANDER = 'Zander'
    DEFAULT = 'Default'
    NONE = None
    FISH_CHOICES = [
        (BREAM, 'Lahna'),
        (PERCH, 'Ahven'),
        (PIKE, 'Hauki'),
        (ROACH, 'Särki'),
        (WHITE_FISH, 'Siika'),
        (ZANDER, 'Kuha'),
        (DEFAULT, 'Muu'),
    ]
    JIG = 'Jig'
    SPINNER = 'Spinner'
    SPOONLURE = 'Spoon lure'
    WOBBLER = 'Wobbler'
    WORM = 'Worm'
    LURE_CHOICES = [
        (JIG, 'Jigi'),
        (SPINNER, 'Lippa'),
        (SPOONLURE, 'Lusikka'),
        (WOBBLER, 'Vaappu'),
        (WORM, 'Mato'),
        (NONE, 'Ei viehettä')
    ]
    fish_species = models.CharField(max_length=20, choices=FISH_CHOICES, default=None, null=True, blank=True)
    fish_details = models.TextField(default=None, null=True, blank=True)
    lure = models.CharField(max_length=20, choices=LURE_CHOICES, default=None, null=True, blank=True)
    lure_details = models.TextField(default=None, null=True, blank=True)
    fishing_technique = models.ForeignKey(FishingTechnique, related_name='catches', on_delete=models.CASCADE)

    def delete_catch(self, pk):
        try:
            instance = FishCatch.objects.get(pk=pk)
            instance.delete()
            return True
        except self.DoesNotExist:
            return False
