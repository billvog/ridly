from rest_framework import serializers

from ridl_api.serializers import PointSerializer
from event.models import Event
from .models import Hunt, HuntClue


# Django Channel related serializers


class LocationSerializer(serializers.Serializer):
  lat = serializers.FloatField()
  long = serializers.FloatField()


class LocationCheckSerializer(serializers.Serializer):
  loc = LocationSerializer(source="location")


class ClueUnlockSerializer(serializers.Serializer):
  loc = LocationSerializer(source="location")


# General serializers


class HuntEventSerializer(serializers.ModelSerializer):
  location_coordinates = PointSerializer()

  class Meta:
    model = Event
    fields = ["name", "location_name", "location_coordinates"]


class HuntSerializer(serializers.ModelSerializer):
  event = HuntEventSerializer()
  clue_count = serializers.SerializerMethodField()

  class Meta:
    model = Hunt
    fields = ["id", "event", "clue_count"]

  def get_clue_count(self, obj):
    return obj.clues.count()


class HuntClueSerializer(serializers.ModelSerializer):
  class Meta:
    model = HuntClue
    fields = ["id", "riddle", "order", "location_threshold"]
