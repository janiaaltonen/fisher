from rest_framework.views import APIView
from .models import FishingEvent
from .serializers import EventSerializer, FullEventSerializer
from rest_framework.response import Response
from rest_framework import mixins
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
        user = request.user
        user_id = user.id
        fe = FishingEvent()
        queryset = fe.get_events(user_id)
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)


class EventDetails(mixins.RetrieveModelMixin,
                   mixins.CreateModelMixin,
                   mixins.UpdateModelMixin,
                   generics.GenericAPIView):

    serializer_class = FullEventSerializer

    def get(self, request):
        """
        returns specific fishing event and related catches for current user
        """
        event_id = request.query_params['id']
        fe = FishingEvent()
        queryset = fe.get_event_as_queryset(event_id)
        print(type(queryset))
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
            print(serializer.validated_data)
            serializer.save(user_id=request.user.id)  # save() method used to invoke serializer's create() method
        return Response(serializer.data)

    def put(self, request):
        """
        At this point request data needs to provide all the fields even those which aren't updated
        """
        data = request.data
        fe = FishingEvent()
        instance = fe.get_event_as_instance(self.request.query_params['id'])
        serializer = self.serializer_class(instance, data=data)  # if PATCH wanted in this method then partial=True needed
        serializer.is_valid()
        serializer.save()
        return Response(serializer.data)


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


