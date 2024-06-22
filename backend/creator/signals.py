from django.dispatch import receiver
from django.db.models.signals import post_save, pre_delete

from creator.models import Creator


@receiver(post_save, sender=Creator)
def enable_is_creator_status(sender, instance, created, **kwargs):
  """
  Set is_creator status of a user to true when a new creator is created.
  """

  if created:
    instance.user.is_creator = True
    instance.user.save()


@receiver(pre_delete, sender=Creator)
def disable_is_creator_status(sender, instance, **kwargs):
  """
  Set is_creator status of a user to false when a creator is deleted.
  """

  instance.user.is_creator = False
  instance.user.save()
