from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field

from event.models import Event
from creator.serializers import CreatorSerializer


class EventSerializer(serializers.ModelSerializer):
  creator = CreatorSerializer()
  participant_avatars = serializers.SerializerMethodField()
  has_joined = serializers.SerializerMethodField()
  hunt_id = serializers.UUIDField(source="hunt.id")

  class Meta:
    model = Event
    fields = [
      "id",
      "name",
      "description",
      "creator",
      "participant_avatars",
      "participant_count",
      "has_joined",
      "location_name",
      "happening_at",
      "hunt_id",
      "created_at",
    ]

  @extend_schema_field(list[str])
  def get_participant_avatars(self, obj):
    """
    Get the first 3 participants who have an avatar_url set and are not the current user.
    """
    request = self.context.get("request")
    user = request.user

    participants = obj.participants.exclude(id=user.id).exclude(avatar_url="").all()[:3]
    return [participant.avatar_url for participant in participants]

  def get_has_joined(self, obj) -> bool:
    request = self.context.get("request")
    user = request.user
    if user is None or user.is_authenticated is False:
      return False
    else:
      return obj.participants.contains(user)


class EventJoinSerializer(serializers.Serializer):
  has_joined = serializers.BooleanField()
  participant_count = serializers.IntegerField()
