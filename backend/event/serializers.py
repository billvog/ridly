from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field

from ridly.serializers import ImageSerializer
from event.models import Event
from creator.serializers import CreatorSerializer


class EventParticipantMixinSerializer:
  """
  Mixin to add participant avatars to the EventSerializer.
  """

  @extend_schema_field(list[str])
  def get_participant_avatars(self, obj):
    """
    Get the first 3 participants' avatars, excluding the logged in user and users without avatars.
    """

    request = self.context.get("request")
    user = request.user

    participants = (
      obj.participants.exclude(id=user.id).exclude(has_avatar=False).all()[:3]
    )
    participants_avatars = [participant.avatar_url for participant in participants]

    serializer = ImageSerializer(
      data=participants_avatars,
      many=True,
      params={"w": 100, "h": 100},
      context=self.context,
    )
    serializer.is_valid()
    return serializer.data


class EventHasJoinedMixinSerializer:
  """
  Mixin to add "has joined" status to the EventSerializer.
  """

  def get_has_joined(self, obj) -> bool:
    request = self.context.get("request")
    user = request.user
    if user is None or user.is_authenticated is False:
      return False
    else:
      return obj.participants.contains(user)


class EventSerializer(
  EventParticipantMixinSerializer,
  EventHasJoinedMixinSerializer,
  serializers.ModelSerializer,
):
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


class EventJoinSerializer(serializers.Serializer):
  has_joined = serializers.BooleanField()
  participant_count = serializers.IntegerField()
