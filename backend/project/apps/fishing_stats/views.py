from rest_framework.views import APIView
from .models import FishingEvent, FishingTechnique, FishCatch
from .serializers import EventSerializer, FullEventSerializer
from rest_framework.response import Response
from rest_framework import mixins, status
from rest_framework import generics
from requests import get
from rest_framework import permissions


class AllEvents(APIView):

    def get(self, request):
        """
        returns [] if query is empty
        returns [
                    {"some":"data"},
                    {"some":"data2"}
                ]
        if query has 1 or more results
        """
        fe = FishingEvent()
        queryset = fe.get_events(self.request.user.id)
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)


class CreateEvent(mixins.CreateModelMixin, generics.GenericAPIView):
    serializer_class = FullEventSerializer

    def post(self, request):
        """
        Correct place might be in different url..
        """
        data = request.data
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save(user_id=request.user.id)  # save() method used to invoke serializer's create() method
        return Response(serializer.data, status.HTTP_201_CREATED)


class EventDetails(mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   generics.GenericAPIView):

    serializer_class = FullEventSerializer

    def get(self, request, **kwargs):
        """
        returns specific fishing event and related catches for current user
        """
        # BASEURL/events/details/<event_id> url param is accessed from kwargs
        event_id = kwargs['event_id']
        fe = FishingEvent()
        queryset = fe.get_event_as_queryset(event_id)
        serializer = self.serializer_class(data=queryset, many=True)
        serializer.is_valid()
        return Response(serializer.data[0])  # return only the object not the array containing object

    def post(self, request):
        """
        Correct place might be in different url..
        """
        data = request.data
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save(user_id=request.user.id)  # save() method used to invoke serializer's create() method
        return Response(serializer.data, status.HTTP_201_CREATED)

    def put(self, request, **kwargs):
        """
        At this point request data needs to provide all the fields even those which aren't updated
        """
        event_id = kwargs['event_id']
        data = request.data
        fe = FishingEvent()
        instance = fe.get_event_as_instance(event_id)
        serializer = self.serializer_class(instance, data=data,
                                           partial=True)  # if PATCH wanted in this method then partial=True needed
        serializer.is_valid()
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, **kwargs):
        """
         Deletes whole event and relates fishing techniques and catches
        """
        event_id = kwargs['event_id']
        user_id = self.request.user.id
        fe = FishingEvent()
        successful = fe.delete_event(user_id, event_id)
        return self.delete_response(successful)

    def delete_response(self, successful):
        if successful:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)


class StatsDetails(mixins.DestroyModelMixin,
                  generics.GenericAPIView):

    def delete(self, request, **kwargs):
        stats_id = kwargs['stats_id']
        ft = FishingTechnique()
        successful = ft.delete_technique(stats_id)
        if successful:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)


class CatchDetails(mixins.DestroyModelMixin,
                  generics.GenericAPIView):

    def delete(self, request, **kwargs):
        catch_id = kwargs['catch_id']
        fc = FishCatch()
        successful = fc.delete_catch(catch_id)
        if successful:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)


class ChoicesOptions(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.fishing_methods = []
        self.catches = []
        self.lures = []

    def get(self, request):
        """
        return JSON like {
                            "fishing_methods": [
                                {
                                    "key": "Casting",
                                    "value": "Heittokalastus"
                                },
                            ],
                            "catches": [
                                {
                                    "key": "Bream",
                                    "value": "Lahna"
                                },
                            ],
                            "lures": [
                                {
                                    "key": "Jig",
                                    "value": "Jigi"
                                },
                            ]
                        }
        """
        method_choices = FishingTechnique.METHOD_CHOICES
        catch_choices = FishCatch.FISH_CHOICES
        lure_choices = FishCatch.LURE_CHOICES
        self.fishing_methods = self.format_JSON(method_choices)
        self.catches = self.format_JSON(catch_choices)
        self.lures = self.format_JSON(lure_choices)
        json = {
            "fishing_methods": self.fishing_methods,
            "catches": self.catches,
            "lures": self.lures,
        }

        return Response(json)

    def format_JSON(self, choices):
        json_list = []
        i = 0
        for choice in choices:
            pair = {}
            for e in choice:
                if i == 0:
                    pair["key"] = e
                    i += 1
                pair["value"] = e
            json_list.append(pair)
            i = 0
        return json_list


class Locations(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.url = 'https://rajapinnat.ymparisto.fi/api/Hakemistorajapinta/1.0/odata/Kunta'

    def get(self, request):
        locations_raw = get(self.url).json()
        locations = locations_raw['value']
        res_arr = []
        for location in locations:
            county = {"name": location['Nimi']}
            res_arr.append(county)
        return Response(res_arr)
