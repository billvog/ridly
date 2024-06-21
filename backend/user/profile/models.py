from django.db import models

from user.models import User


class UserProfile(models.Model):
  user = models.OneToOneField(
    User, related_name="profile", on_delete=models.CASCADE, primary_key=True
  )
  bio = models.TextField(blank=True)

  def __str__(self) -> str:
    return f"Profile of {self.user.username}"
