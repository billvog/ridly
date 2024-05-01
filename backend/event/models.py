import uuid
from django.db import models

from creator.models import Creator
from user.models import User


class Event(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  name = models.CharField(max_length=50)
  description = models.TextField()

  creator = models.ForeignKey(Creator, on_delete=models.CASCADE)

  # We keep the number of participants in a field
  # so we don't have to calculate it every time we
  # make a request to get an event.
  participants = models.ManyToManyField(User, blank=True)
  participant_count = models.PositiveIntegerField(default=0)

  location = models.CharField(max_length=100)
  happening_at = models.DateTimeField()

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self) -> str:
    return self.name
