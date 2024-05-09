from rest_framework import serializers

from .models import Hunt, HuntClue
from event.models import Event


class HuntEventSerializer(serializers.ModelSerializer):
  class Meta:
    model = Event
    fields = ["name"]


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
    fields = ["id", "riddle", "order"]
