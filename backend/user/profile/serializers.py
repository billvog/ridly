from rest_framework import serializers

from event.serializers import (
  MiniEventSerializer,
)
from user.serializers import PublicUserSerializer
from user.profile.models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserProfile
    fields = ["bio"]


class UserWithProfileSerializer(PublicUserSerializer):
  profile = UserProfileSerializer()
  events = serializers.SerializerMethodField()

  class Meta(PublicUserSerializer.Meta):
    fields = PublicUserSerializer.Meta.fields + [
      "profile",
      "events",
    ]

  def get_events(self, obj) -> list[MiniEventSerializer]:
    """
    Get the first 3 events created by the user.
    """

    events = obj.creator.event_set.all()[:3]
    return MiniEventSerializer(events, context=self.context, many=True).data
