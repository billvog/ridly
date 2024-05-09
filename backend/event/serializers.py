from rest_framework import serializers

from user.models import User
from .models import Event
from creator.serializers import CreatorSerializer


class EventParticipantSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ["avatar_url"]


class EventSerializer(serializers.ModelSerializer):
  creator = CreatorSerializer()
  participants = serializers.SerializerMethodField()
  has_joined = serializers.SerializerMethodField()
  hunt_id = serializers.SerializerMethodField()

  class Meta:
    model = Event
    fields = [
      "id",
      "name",
      "description",
      "creator",
      "participants",
      "participant_count",
      "has_joined",
      "location_name",
      "happening_at",
      "hunt_id",
      "created_at",
    ]

  # Get 3 first participants, always ignoring logged in user.
  def get_participants(self, obj):
    request = self.context.get("request")
    user = request.user

    participants = obj.participants.all().exclude(id=user.id)[:3]
    serializer = EventParticipantSerializer(participants, many=True)

    return serializer.data

  def get_has_joined(self, obj):
    request = self.context.get("request")
    user = request.user
    if user is None or user.is_authenticated is False:
      return False
    else:
      return obj.participants.contains(user)

  def get_hunt_id(self, obj):
    hunt = obj.hunt.first()
    return hunt.id if hunt else None
