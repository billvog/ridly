from rest_framework import serializers

from event.serializers import MiniEventSerializer
from user.serializers import PublicUserSerializer
from user.profile.models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserProfile
    fields = ["bio"]


class UserWithProfileSerializer(PublicUserSerializer):
  profile = UserProfileSerializer()

  class Meta(PublicUserSerializer.Meta):
    fields = PublicUserSerializer.Meta.fields + [
      "profile",
    ]


class GetUserProfileSerializer(serializers.Serializer):
  user = UserWithProfileSerializer()
  joined_events = MiniEventSerializer(many=True)
