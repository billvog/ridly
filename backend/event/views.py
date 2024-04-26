from rest_framework.generics import ListAPIView, RetrieveAPIView

from .models import Event
from .serializers import EventSerializer


class ListEventsAPIVIew(ListAPIView):
  queryset = Event.objects.all()
  serializer_class = EventSerializer


class RetrieveEventAPIView(RetrieveAPIView):
  queryset = Event.objects.all()
  serializer_class = EventSerializer
