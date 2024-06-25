from django.dispatch import receiver
from django.db.models.signals import post_save, pre_delete

from user.profile.models import UserProfile
from user.profile.follow.models import UserFollow


@receiver(post_save, sender=UserFollow)
def increment_follow_counters(sender, instance, created, **kwargs):
  if not created:
    return

  # Update follower's following count
  follower = UserProfile.objects.get(user=instance.follower)
  follower.following_count += 1
  follower.save()

  # Update following's follower count
  following = UserProfile.objects.get(user=instance.following)
  following.follower_count += 1
  following.save()


@receiver(pre_delete, sender=UserFollow)
def decrement_follow_counters(sender, instance, **kwargs):
  # Update follower's following count
  follower = UserProfile.objects.get(user=instance.follower)
  follower.following_count -= 1
  follower.save()

  # Update following's follower count
  following = UserProfile.objects.get(user=instance.following)
  following.follower_count -= 1
  following.save()
