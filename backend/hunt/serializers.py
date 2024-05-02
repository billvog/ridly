from rest_framework import serializers

from .models import TreasureHunt, TreasureHuntClue
from event.models import Event


class THuntEventSerializer(serializers.ModelSerializer):
  class Meta:
    model = Event
    fields = ["name"]


class THuntSerializer(serializers.ModelSerializer):
  event = THuntEventSerializer()
  clue_count = serializers.SerializerMethodField()

  class Meta:
    model = TreasureHunt
    fields = ["id", "event", "clue_count"]

  def get_clue_count(self, obj):
    return obj.clues.count()


class THuntClueSerializer(serializers.ModelSerializer):
  class Meta:
    model = TreasureHuntClue
    fields = ["id", "riddle", "order"]
