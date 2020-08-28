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


class EventDetails(mixins.RetrieveModelMixin,
                   mixins.CreateModelMixin,
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
            serializer.save(user_id=request.user.id)  # save() method used to invoke serializer's create() method
        return Response(serializer.data, status.HTTP_201_CREATED)

    def put(self, request):
        """
        At this point request data needs to provide all the fields even those which aren't updated
        """
        data = request.data
        fe = FishingEvent()
        instance = fe.get_event_as_instance(self.request.query_params['id'])
        serializer = self.serializer_class(instance, data=data, partial=True)  # if PATCH wanted in this method then partial=True needed
        serializer.is_valid()
        serializer.save()
        return Response(serializer.data)

    def delete(self, request):
        """
         Deletes whole event, fishing technique in it or fish catch in it
         depending on the url params given
        """
        event_id = self.request.query_params['id']
        tech_id = self.request.query_params['tech']
        catch_id = self.request.query_params['catch']

        if tech_id == '0' and catch_id == '0':
            fe = FishingEvent()
            successful = fe.delete_event(event_id)
            return self.delete_response(successful)
        elif tech_id != '0':
            ft = FishingTechnique()
            successful = ft.delete_technique(tech_id)
            return self.delete_response(successful)
        else:
            fc = FishCatch()
            successful = fc.delete_catch(catch_id)
            return self.delete_response(successful)

    def delete_response(self, successful):
        if successful:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)




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


