from django.db import models

from user.models import User


class Creator(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self) -> str:
    return "Creator @{}".format(self.user.username)
