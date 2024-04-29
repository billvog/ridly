from rest_framework import serializers

from .models import Event
from creator.serializers import CreatorSerializer
from user.serializers import PublicUserSerializer


class EventSerializer(serializers.ModelSerializer):
  creator = CreatorSerializer()
  participants = PublicUserSerializer(many=True)
  has_joined = serializers.SerializerMethodField()

  class Meta:
    model = Event
    fields = [
      "id",
      "name",
      "description",
      "creator",
      "participants",
      "participant_count",
      "location",
      "happening_at",
      "created_at",
      "has_joined",
    ]

  def get_has_joined(self, obj):
    request = self.context.get("request")
    user = request.user
    if user is None:
      return False
    else:
      return obj.participants.contains(user)


class PublicEventSerializer(serializers.ModelSerializer):
  creator = CreatorSerializer()
  participants = PublicUserSerializer(many=True)
  has_joined = serializers.SerializerMethodField()

  class Meta:
    model = Event
    fields = [
      "id",
      "name",
      "description",
      "creator",
      "participant_count",
      "location",
      "happening_at",
      "has_joined",
    ]

  def get_has_joined(self, obj):
    request = self.context.get("request")
    user = request.user
    if user is None:
      return False
    else:
      return obj.participants.contains(user)
