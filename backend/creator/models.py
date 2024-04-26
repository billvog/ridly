import uuid
from django.db import models

from user.models import User


class Creator(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

  user = models.OneToOneField(User, on_delete=models.CASCADE)

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
