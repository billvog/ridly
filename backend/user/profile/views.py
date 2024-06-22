from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView

from event.serializers import MiniEventSerializer
from user.models import User
from user.profile.serializers import UserWithProfileSerializer


class UserProfileAPIView(RetrieveAPIView):
  serializer_class = UserWithProfileSerializer
  queryset = User.objects.filter(is_active=True)

  # Serializer class for joined events.
  joined_events_serializer_class = MiniEventSerializer

  def get_joined_event_objects(self, user):
    """
    Get 5 first events the user has joined.
    """
    return user.joined_events.all()[:5]

  def get_joined_events_serializer(self, user):
    """
    Get user's joined events and return them serialized.
    """
    joined_events = self.get_joined_event_objects(user)
    return self.joined_events_serializer_class(
      joined_events, context=self.get_serializer_context(), many=True
    )

  def retrieve(self, request, *args, **kwargs):
    # Get user and serialiaze
    user = self.get_object()
    user_serializer = self.get_serializer(user)

    # Get user's joined events serializer
    joined_events_serializer = self.get_joined_events_serializer(user)

    # Return response
    return Response(
      {
        "user": user_serializer.data,
        "joined_events": joined_events_serializer.data,
      }
    )
