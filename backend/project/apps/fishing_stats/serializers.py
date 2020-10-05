from rest_framework import serializers
from .models import FishingEvent, FishCatch, FishingTechnique
from django.db.models import Prefetch, Count, Q
from django.db import connection


class CatchSerializer(serializers.ModelSerializer):
    # fish_species = serializers.ChoiceField(choices=FishCatch.FISH_CHOICES)
    # lure = serializers.ChoiceField(choices=FishCatch.LURE_CHOICES)
    fish_species = serializers.CharField(source='get_fish_species_display')
    lure = serializers.CharField(source='get_lure_display')

    class Meta:
        model = FishCatch
        fields = ['id', 'fish_species', 'fish_details', 'lure', 'lure_details']

    def to_internal_value(self, data):
        return data


class StatsSerializer(serializers.ModelSerializer):
    catches = CatchSerializer(many=True)  # adds related catches to specific technique
    # fishing_method = serializers.ChoiceField(choices=FishingTechnique.METHOD_CHOICES)
    fishing_method = serializers.CharField(source='get_fishing_method_display')

    class Meta:
        model = FishingTechnique
        fields = ['id', 'fishing_method', 'catches']

    def to_internal_value(self, data):
        return data

    def create(self, validated_data):
        event_id = validated_data['event_id']
        validated_data.pop('event_id')
        catches = validated_data.pop('catches')
        fishing_technique = FishingTechnique.objects.create(fishing_event_id=event_id, **validated_data)

        for catch in catches:
            FishCatch.objects.create(fishing_technique=fishing_technique, **catch)

        return fishing_technique


class EventSerializer(serializers.ModelSerializer):
    weather = serializers.CharField(source='get_weather_display')
    total_catches = serializers.SerializerMethodField()

    class Meta:
        model = FishingEvent
        fields = ['id', 'date', 'location', 'location_details', 'start_time', 'end_time', 'weather',
                  'air_temperature', 'persons', 'total_catches']

    def to_internal_value(self, data):
        return data

    def get_total_catches(self, obj):
        # SELECT Count(fishing_technique_id) FROM [table] WHERE fishing_technique_id IN()
        # is current method efficient enough?!
        # can queryset API's prefetch_related
        # or .annotate() be used to reduce the number of db queries

        techs = FishingTechnique.objects.filter(fishing_event=obj)
        amount = 0
        for tech in techs:
            amount += FishCatch.objects.filter(fishing_technique_id=tech.id).count()
        return amount


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
        print(validated_data)
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
            # Create new fish_catch objects if there isn't any catches in db (nothing to update)
            if len(fish_catches) == 0:
                for catch in catches:
                    FishCatch.objects.create(fishing_technique=technique, **catch)
            else:
                # Delete any catches that are not included in request
                catch_ids = [catch.get('id') for catch in catches]
                for catch in fish_catches:
                    if catch.id not in catch_ids:
                        catch.delete()
                for catch in catches:
                    # Create new fish_catch object if it doesn't have id
                    if catch.get('id') is None:
                        catch.pop('id')
                        FishCatch.objects.create(fishing_technique=technique, **catch)
                    # Update rest of the catches
                    else:
                        fish_catch = fish_catches.pop(0)
                        fish_catch.id = catch.get('id', fish_catch.id)
                        fish_catch.fish_species = catch.get('fish_species', fish_catch.fish_species)
                        fish_catch.fish_details = catch.get('fish_details', fish_catch.fish_details)
                        fish_catch.lure = catch.get('lure', fish_catch.lure)
                        fish_catch.lure_details = catch.get('lure_details', fish_catch.lure_details)
                        fish_catch.save()

        return instance
