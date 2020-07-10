from rest_framework import serializers
from .models import FishingEvent, FishCatch


class CatchSerializer(serializers.ModelSerializer):
    fish_species = serializers.ChoiceField(choices=FishCatch.FISH_CHOICES)

    class Meta:
        model = FishCatch
        fields = ['fish_species', 'amount']

    def to_internal_value(self, data):
        return data


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = FishingEvent
        fields = ['id', 'date', 'location']


class FullEventSerializer(serializers.ModelSerializer):
    catches = CatchSerializer(many=True)  # adds related catches to specific event
    id = serializers.IntegerField(required=False)

    class Meta:
        model = FishingEvent
        fields = ['id', 'date', 'location', 'persons', 'catches']
        extra_kwargs = {
            'user_id': {'write_only': True}
        }

    def create(self, validated_data):
        fish_catches_data = validated_data.pop('catches')
        # validated data includes user_id=user_id, passed in views serializer.save(keyword=argument)
        fishing_event = FishingEvent.objects.create(**validated_data)

        for fish_catch_data in fish_catches_data:
            print(fish_catch_data)
            FishCatch.objects.create(fishing_event=fishing_event, **fish_catch_data)
        return fishing_event

    def update(self, instance, validated_data):
        instance.date = validated_data.get('date', instance.date)
        fish_catches_data = validated_data.pop('catches')
        print(fish_catches_data)
        fish_catches = instance.catches.all()
        fish_catches = list(fish_catches)
        instance.date = validated_data.get('date', instance.date)
        instance.location = validated_data.get('location', instance.location)
        instance.persons = validated_data.get('persons', instance.persons)
        instance.user_id = validated_data.get('user_id', instance.user_id)
        instance.save()

        for fish_catch_data in fish_catches_data:
            fish_catch = fish_catches.pop(0)
            fish_catch.fish_species = fish_catch_data.get('fish_species', fish_catch.fish_species)
            fish_catch.amount = fish_catch_data.get('amount', fish_catch.amount)
            fish_catch.save()
        return instance
