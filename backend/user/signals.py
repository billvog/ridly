from django.dispatch import receiver
from django.db.models.signals import post_save

from user.models import User
from user.profile.models import UserProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
  """
  Create a user profile when a new user is created.
  """

  if created:
    UserProfile.objects.create(user=instance)
