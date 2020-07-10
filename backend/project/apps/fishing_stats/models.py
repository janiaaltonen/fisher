from django.db import models
from django.contrib.auth import get_user_model


class FishingEvent(models.Model):
    User = get_user_model()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    location = models.CharField(max_length=100)
    persons = models.IntegerField()

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
        (NONE, 'Ei saalista'),
    ]
    fish_species = models.CharField(max_length=20, choices=FISH_CHOICES, default=None, null=True, blank=True)
    amount = models.IntegerField()
    fishing_event = models.ForeignKey(FishingEvent, related_name='catches', on_delete=models.CASCADE)
