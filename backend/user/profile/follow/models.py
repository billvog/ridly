from django.db import models

from user.models import User


class UserFollow(models.Model):
  follower = models.ForeignKey(
    User,
    related_name="following",
    on_delete=models.CASCADE,
  )

  following = models.ForeignKey(
    User,
    related_name="followers",
    on_delete=models.CASCADE,
  )

  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    unique_together = ("follower", "following")

  def __str__(self) -> str:
    return f"{self.follower.username} follows {self.following.username}"
