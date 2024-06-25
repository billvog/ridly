from django.contrib.gis.measure import D
from django.shortcuts import get_object_or_404
from django.utils import timezone
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from rest_framework import permissions, status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from event.models import Event
from event.serializers import EventJoinSerializer, EventSerializer
from ridly.serializers import DetailedErrorSerializer


@extend_schema_view(
  get=extend_schema(
    operation_id="upcoming_events",
    parameters=[
      OpenApiParameter(
        name="distance",
        type=int,
        description="Distance in km from user's last known location",
        required=False,
      )
    ],
  )
)
class ListUpcomingEventsAPIVIew(ListAPIView):
  serializer_class = EventSerializer

  def get_queryset(self):
    """
    Get the 10 first upcoming events.
    If user is authenticated, only get events within 10km of their last known location.
    """

    user = self.request.user
    qs = Event.objects.filter(happening_at__gte=timezone.now())

    distance = 0
    try:
      distance = int(self.request.GET.get("distance", 0))  # in km
    except ValueError:
      pass

    if user.is_authenticated and distance > 0:
      qs = qs.filter(
        location_coordinates__distance_lt=(user.last_known_location, D(km=distance))
      )

    return qs.order_by("happening_at")[:10]


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
    return self.request.user.joined_events.all()


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
