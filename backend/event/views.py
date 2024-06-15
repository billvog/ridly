from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from drf_spectacular.utils import extend_schema, extend_schema_view

from ridl_api.serializers import DetailedErrorSerializer
from .models import Event
from .serializers import EventJoinSerializer, EventSerializer


@extend_schema_view(get=extend_schema(operation_id="upcoming_events"))
class ListUpcomingEventsAPIVIew(ListAPIView):
  serializer_class = EventSerializer

  def get_queryset(self):
    """
    Get the 10 first upcoming events.
    """
    return Event.objects.filter(happening_at__gte=timezone.now()).order_by(
      "happening_at"
    )[:10]


@extend_schema_view(
  get=extend_schema(
    operation_id="event", responses={200: EventSerializer, 404: DetailedErrorSerializer}
  )
)
class RetrieveEventAPIView(RetrieveAPIView):
  queryset = Event.objects.all()
  serializer_class = EventSerializer


@extend_schema_view(
  get=extend_schema(
    operation_id="joined_events",
    responses={200: EventSerializer, 403: DetailedErrorSerializer},
  )
)
class ListJoinedEventsAPIView(ListAPIView):
  serializer_class = EventSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get_queryset(self):
    return self.request.user.event_set.all()


@extend_schema_view(
  post=extend_schema(
    operation_id="join_event",
    request=None,
    responses={
      200: EventJoinSerializer,
      403: DetailedErrorSerializer,
      404: DetailedErrorSerializer,
    },
  )
)
class JoinEventAPIView(APIView):
  permission_classes = [permissions.IsAuthenticated]

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
    response = {"has_joined": has_joined, "participant_count": event.participant_count}

    return Response(
      response,
      status=status.HTTP_200_OK,
    )
