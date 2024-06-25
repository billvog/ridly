from django.db import models

from user.models import User


class UserProfile(models.Model):
  user = models.OneToOneField(
    User,
    related_name="profile",
    on_delete=models.CASCADE,
    primary_key=True,
    editable=False,
  )

  bio = models.TextField(blank=True)

  follower_count = models.PositiveIntegerField(default=0)
  following_count = models.PositiveIntegerField(default=0)

  def __str__(self) -> str:
    return f"Profile of {self.user.username}"
