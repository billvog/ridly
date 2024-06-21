from rest_framework import serializers

from event.models import Event
from user.serializers import PublicUserSerializer
from creator.models import Creator
from event.serializers import (
  EventParticipantMixinSerializer,
  EventHasJoinedMixinSerializer,
)


class UserProfileEventSerializer(
  EventParticipantMixinSerializer,
  EventHasJoinedMixinSerializer,
  serializers.ModelSerializer,
):
  participant_avatars = serializers.SerializerMethodField()
  has_joined = serializers.SerializerMethodField()

  class Meta:
    model = Event
    fields = [
      "id",
      "name",
      "participant_avatars",
      "has_joined",
      "location_name",
      "happening_at",
    ]


class UserProfileSerializer(PublicUserSerializer):
  is_creator = serializers.SerializerMethodField()
  events = serializers.SerializerMethodField()

  class Meta(PublicUserSerializer.Meta):
    fields = PublicUserSerializer.Meta.fields + ["is_creator", "events"]

  def get_is_creator(self, obj) -> bool:
    return Creator.objects.filter(user=obj).exists()

  def get_events(self, obj) -> list[UserProfileEventSerializer]:
    """
    Get the first 3 events created by the user.
    """

    events = obj.creator.event_set.all()[:3]
    return UserProfileEventSerializer(events, context=self.context, many=True).data
