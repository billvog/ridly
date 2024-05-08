import uuid
from django.contrib.gis.db import models
from django.contrib.auth import get_user_model

from event.models import Event

User = get_user_model()


class TreasureHunt(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

  event = models.ForeignKey(Event, on_delete=models.CASCADE)

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self) -> str:
    return 'Hunt for "{}"'.format(self.event.name)


class TreasureHuntClue(models.Model):
  hunt = models.ForeignKey(TreasureHunt, related_name="clues", on_delete=models.CASCADE)

  riddle = models.CharField(max_length=1000)
  solution = models.CharField(max_length=100)

  order = models.IntegerField(default=0)

  location_point = models.PointField(spatial_index=True)

  # A distance in meters, from the location_point, within which
  # the player will get notified that is near the clue.
  location_threshold = models.FloatField(default=50)

  is_last = models.BooleanField(default=False)

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self) -> str:
    return '#{} clue for "{}" hunt'.format(self.order, self.hunt.event.name)


class TreasureHuntClueStat(models.Model):
  clue = models.ForeignKey(TreasureHuntClue, on_delete=models.CASCADE)
  user = models.ForeignKey(User, on_delete=models.CASCADE)

  tries_made = models.PositiveSmallIntegerField(default=0)
  unlocked = models.BooleanField(default=False)

  created_at = models.DateTimeField(auto_now_add=True)
