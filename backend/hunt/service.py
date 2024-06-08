from django.utils import timezone
from channels.db import database_sync_to_async

from hunt.models import Hunt, HuntStat, HuntClue, HuntClueStat


@database_sync_to_async
def get_hunt(pk):
  try:
    return Hunt.objects.get(pk=pk)
  except Hunt.DoesNotExist:
    return None


@database_sync_to_async
def get_hunt_stat(hunt, user):
  try:
    hunt_stat, _ = HuntStat.objects.get_or_create(hunt=hunt, user=user)
    return hunt_stat
  except HuntStat.DoesNotExist:
    return None


@database_sync_to_async
def get_hunt_current_clue(hunt_stat):
  clue_stat = hunt_stat.clue_stats.order_by("clue__order").last()

  if clue_stat is None:
    hunt = hunt_stat.hunt
    first_clue = hunt.clues.order_by("order").first()
    clue_stat = HuntClueStat.objects.create(clue=first_clue, hunt_stat=hunt_stat)

  return clue_stat.clue, clue_stat


@database_sync_to_async
def hunt_unlock_clue(hunt_stat, clue_stat):
  """
  Handle successful unlock of a clue.
  If this clue is the last one, mark the hunt as completed and return True.
  Otherwise, create a new ClueStat for the next clue and return False.
  """

  # Set ClueStat as unlocked
  clue_stat.unlocked = True
  clue_stat.save()

  # If this clue is the last one, return True
  if clue_stat.clue.is_last:
    internal_hunt_complete(hunt_stat)
    return True

  # Else, move to next one
  internal_hunt_next_clue(hunt_stat, clue_stat.clue)

  return False


@database_sync_to_async
def hunt_failed_unlock_clue(hunt_stat, clue_stat):
  """
  Handle failed unlock of a clue, when user tries to unlock a clue with wrong location.
  Increment the tries_made of the clue_stat, and if it reaches 2,
  which means the user is out of tries and will be (shadow) banned.
  """

  # Set ClueStat as unlocked
  clue_stat.tries_made += 1
  clue_stat.save()

  # If user has made 2 tries, shadow ban them
  if clue_stat.tries_made >= 2:
    internal_hunt_shadow_ban(hunt_stat)


"""
Internal functions, only called from within @database_sync_to_async functions.
"""


def internal_hunt_next_clue(hunt_stat, current_clue):
  next_clue = HuntClue.objects.get(order=(current_clue.order + 1))
  HuntClueStat.objects.create(clue=next_clue, hunt_stat=hunt_stat)


def internal_hunt_complete(hunt_stat):
  hunt_stat.completed = True
  hunt_stat.completed_at = timezone.now()
  hunt_stat.save()


def internal_hunt_shadow_ban(hunt_stat):
  hunt_stat.shadow_banned = True
  hunt_stat.shadow_banned_at = timezone.now()
  hunt_stat.save()
