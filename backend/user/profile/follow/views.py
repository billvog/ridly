import uuid

from django.shortcuts import get_object_or_404

from rest_framework import permissions, status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from drf_spectacular.openapi import OpenApiParameter
from drf_spectacular.utils import extend_schema_view, extend_schema

from ridly.serializers import DetailedErrorSerializer
from user.models import User
from user.profile.follow.models import UserFollow
from user.profile.follow.serializers import FollowUserSerializer
from user.profile.follow.exceptions import CannotFollowYourselfException


@extend_schema_view(
  post=extend_schema(
    operation_id="followUser",
    description="Follow or unfollow a user",
    parameters=[
      OpenApiParameter(
        name="id",
        type=uuid.UUID,
        location=OpenApiParameter.PATH,
        description="User Id to follow or unfollow",
        required=True,
      )
    ],
    request=None,
    responses={
      200: FollowUserSerializer,
      403: DetailedErrorSerializer,
      404: DetailedErrorSerializer,
    },
  )
)
class FollowUserAPIView(GenericAPIView):
  permission_classes = [permissions.IsAuthenticated]
  http_method_names = ["post"]

  queryset = User.objects.filter(is_active=True)
  serializer_class = FollowUserSerializer

  def get_user_to_follow(self):
    """
    Gets the user to follow from the URL parameter.
    """
    qs = self.get_queryset()
    user_id = self.kwargs.get("pk")
    user = get_object_or_404(qs, id=user_id)
    return user

  def post(self, request, *args, **kwargs):
    # Get current user, and the user they want to follow
    user = request.user
    user_to_follow = self.get_user_to_follow()

    # Check if user is trying to follow himself
    if user == user_to_follow:
      raise CannotFollowYourselfException()

    # Get or create UserFollow
    user_follow, created = UserFollow.objects.get_or_create(
      follower=user, following=user_to_follow
    )

    # If it wasn't created, it means that the user
    # is already following the other user and wants to unfollow.
    if not created:
      user_follow.delete()

    # Serialize response and return it
    serializer = self.get_serializer(user_to_follow.profile)
    return Response(serializer.data, status=status.HTTP_200_OK)
