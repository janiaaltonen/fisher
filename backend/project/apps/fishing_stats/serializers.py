from rest_framework import serializers
from .models import FishingEvent, FishCatch, FishingTechnique


class CatchSerializer(serializers.ModelSerializer):
    fish_species = serializers.ChoiceField(choices=FishCatch.FISH_CHOICES)
    lure = serializers.ChoiceField(choices=FishCatch.LURE_CHOICES)

    class Meta:
        model = FishCatch
        fields = ['id', 'fish_species', 'fish_details', 'lure', 'lure_details']

    def to_internal_value(self, data):
        return data


class StatsSerializer(serializers.ModelSerializer):
    catches = CatchSerializer(many=True)  # adds related catches to specific technique
    fishing_method = serializers.ChoiceField(choices=FishingTechnique.METHOD_CHOICES)

    class Meta:
        model = FishingTechnique
        fields = ['id', 'fishing_method', 'catches']

    def to_internal_value(self, data):
        return data


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = FishingEvent
        fields = ['id', 'date', 'location']


class FullEventSerializer(serializers.ModelSerializer):
    stats = StatsSerializer(many=True)  # adds related stats to specific event
    id = serializers.IntegerField(required=False)

    class Meta:
        model = FishingEvent
        fields = ['id', 'date', 'location', 'persons', 'stats']
        extra_kwargs = {
            'user_id': {'write_only': True}
        }

    def create(self, validated_data):
        fish_stats_data = validated_data.pop('stats')

        # validated data includes user_id=user_id, passed in views serializer.save(keyword=argument)
        fishing_event = FishingEvent.objects.create(**validated_data)

        for fishing_method in fish_stats_data:
            fish_catches_data = fishing_method.pop('catches')
            fishing_technique = FishingTechnique.objects.create(fishing_event=fishing_event, **fishing_method)

            for fish_catch_data in fish_catches_data:
                FishCatch.objects.create(fishing_technique=fishing_technique, **fish_catch_data)

        return fishing_event

    def update(self, instance, validated_data):
        event_stats_data = validated_data.pop('stats')
        fishing_techniques = instance.stats.all()
        fishing_techniques = list(fishing_techniques)
        instance.date = validated_data.get('date', instance.date)
        instance.location = validated_data.get('location', instance.location)
        instance.persons = validated_data.get('persons', instance.persons)
        instance.user_id = validated_data.get('user_id', instance.user_id)
        instance.save()

        for method_stat in event_stats_data:
            technique = fishing_techniques.pop(0)
            fish_catches = technique.catches.all()
            fish_catches = list(fish_catches)
            catches = method_stat.get('catches')
            technique.fishing_method = method_stat.get('fishing_method', technique.fishing_method)
            technique.save()
            for catch in catches:
                fish_catch = fish_catches.pop(0)
                fish_catch.fish_species = catch.get('fish_species', fish_catch.fish_species)
                fish_catch.fish_details = catch.get('fish_details', fish_catch.fish_details)
                fish_catch.lure = catch.get('lure', fish_catch.lure)
                fish_catch.lure_details = catch.get('lure_details', fish_catch.lure_details)
                fish_catch.save()

        return instance
