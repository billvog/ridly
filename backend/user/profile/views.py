from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from drf_spectacular.utils import extend_schema, extend_schema_view

from ridly.serializers import DetailedErrorSerializer
from user.models import User
from user.profile.serializers import GetUserProfileSerializer


@extend_schema_view(
  get=extend_schema(
    operation_id="getUserProfile",
    description="Get user's profile along with their 5 first joined events",
    responses={200: GetUserProfileSerializer, 404: DetailedErrorSerializer},
  )
)
class UserProfileAPIView(RetrieveAPIView):
  serializer_class = GetUserProfileSerializer
  queryset = User.objects.filter(is_active=True)

  def get_joined_event_objects(self, user):
    """
    Get 5 first events the user has joined.
    """
    return user.joined_events.all()[:5]

  def retrieve(self, request, *args, **kwargs):
    user = self.get_object()
    joined_events = self.get_joined_event_objects(user)
    response_serializer = self.get_serializer(
      {
        "user": user,
        "joined_events": joined_events,
      }
    )
    return Response(response_serializer.data)
