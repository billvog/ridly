import uuid
from django.contrib.gis.db import models

from event.models import Event


class TreasureHunt(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

  event = models.ForeignKey(Event, on_delete=models.CASCADE)

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self) -> str:
    return 'Hunt for "{}"'.format(self.event.name)


class TreasureHuntClue(models.Model):
  # Use default auto-incremental integer for id.

  hunt = models.ForeignKey(TreasureHunt, related_name="clues", on_delete=models.CASCADE)

  riddle = models.CharField(max_length=1000)
  solution = models.CharField(max_length=100)

  order = models.IntegerField(default=0)

  location_point = models.PointField(spatial_index=True)

  # A distance in meters, from the location_point, within which
  # the player will get notified that is near the clue.
  location_threshold = models.FloatField(default=50)

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self) -> str:
    return '#{} clue for "{}" hunt'.format(self.order, self.hunt.event.name)
