from rest_framework import serializers

from .models import Event
from creator.serializers import CreatorSerializer
from user.serializers import PublicUserSerializer


class EventSerializer(serializers.ModelSerializer):
  creator = CreatorSerializer()
  participants = PublicUserSerializer(many=True)

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
    ]


class PublicEventSerializer(serializers.ModelSerializer):
  creator = CreatorSerializer()
  participants = PublicUserSerializer(many=True)

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
    ]
