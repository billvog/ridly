from rest_framework import serializers

from event.serializers import MiniEventSerializer
from user.serializers import PublicUserSerializer
from user.profile.models import UserProfile


class GetUserProfileSerializer(serializers.Serializer):
  user = PublicUserSerializer()
  joined_events = MiniEventSerializer(many=True)


class UpdateUserProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserProfile
    fields = ["bio"]
