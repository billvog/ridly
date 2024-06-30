from rest_framework import serializers

from user.profile.models import UserProfile
from user.profile.follow.models import UserFollow


class UserProfileSerializer(serializers.ModelSerializer):
  follow_status = serializers.SerializerMethodField()

  class Meta:
    model = UserProfile
    fields = [
      "bio",
      "follower_count",
      "following_count",
      "follow_status",
    ]

  def get_follow_status(self, obj) -> bool:
    """
    Indicated whether the logged in user, if any, is following the requested user.
    """

    request = self.context["request"]
    user = request.user

    # If there is not user, or the user is the same as the requested user, return False
    if user is None or not user.is_authenticated or user == obj.user:
      return False

    return UserFollow.objects.filter(follower=user, following=obj.user).exists()
