import uuid

from django.contrib.gis.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.translation import gettext_lazy as _

from user.managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  username = models.CharField(max_length=50, unique=True)
  email = models.EmailField(unique=True)

  first_name = models.CharField(max_length=50)
  last_name = models.CharField(max_length=50)

  avatar_url = models.URLField(blank=True)

  did_complete_signup = models.BooleanField(default=False)

  last_known_location = models.PointField(null=True, blank=True)

  is_active = models.BooleanField(default=True)
  is_staff = models.BooleanField(default=False)

  token_version = models.IntegerField(default=0)

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  objects = UserManager()

  USERNAME_FIELD = "email"
  REQUIRED_FIELDS = []

  class Meta:
    verbose_name = _("user")
    verbose_name_plural = _("users")

  def get_full_name(self):
    full_name = "%s %s" % (self.first_name, self.last_name)
    return full_name.strip()

  def get_short_name(self):
    return self.first_name
