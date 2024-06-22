from rest_framework import serializers

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
