from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from drf_spectacular.utils import extend_schema

from .models import Event
from .serializers import EventJoinSerializer, EventSerializer


class ListEventsAPIVIew(ListAPIView):
  queryset = Event.objects.all()
  serializer_class = EventSerializer


class RetrieveEventAPIView(RetrieveAPIView):
  queryset = Event.objects.all()
  serializer_class = EventSerializer


class ListJoinedEventsAPIView(ListAPIView):
  serializer_class = EventSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get_queryset(self):
    return self.request.user.event_set.all()


class JoinEventAPIView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  @extend_schema(
    request=None,
    responses={200: EventJoinSerializer},
  )
  def post(self, request, *args, **kwargs):
    # Get logged in user.
    user = request.user

    # Get the event, the 'pk' refers to.
    event_id = kwargs.get("pk", None)
    event = get_object_or_404(Event, pk=event_id)

    # Holds new state of has_joined, so can update ui correctly on frontend.
    has_joined = None

    # If user has joined, remove from participants.
    if event.participants.contains(user):
      has_joined = False
      event.participants.remove(user)
    # If no, add them.
    else:
      has_joined = True
      event.participants.add(user)

    # Save changes.
    event.save()

    # Serialize response.
    serialized_data = EventJoinSerializer(
      data={"has_joined": has_joined, "participant_count": event.participant_count}
    ).data

    return Response(
      serialized_data,
      status=status.HTTP_200_OK,
    )
