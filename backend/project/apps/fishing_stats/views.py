from rest_framework.views import APIView
from .models import FishingEvent
from .serializers import EventSerializer, FullEventSerializer
from rest_framework.response import Response
from rest_framework import mixins
from rest_framework import generics


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
        return Response(serializer.data[0])

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




