from rest_framework import serializers

from user.serializers import PublicUserSerializer
from creator.models import Creator
from event.serializers import (
  MiniEventSerializer,
)
from user.profile.models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserProfile
    fields = ["bio"]


class UserWithProfileSerializer(PublicUserSerializer):
  profile = UserProfileSerializer()

  is_creator = serializers.SerializerMethodField()
  events = serializers.SerializerMethodField()

  class Meta(PublicUserSerializer.Meta):
    fields = PublicUserSerializer.Meta.fields + [
      "is_creator",
      "profile",
      "events",
    ]

  def get_is_creator(self, obj) -> bool:
    return Creator.objects.filter(user=obj).exists()

  def get_events(self, obj) -> list[MiniEventSerializer]:
    """
    Get the first 3 events created by the user.
    """

    events = obj.creator.event_set.all()[:3]
    return MiniEventSerializer(events, context=self.context, many=True).data
