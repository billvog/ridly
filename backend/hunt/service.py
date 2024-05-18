from channels.db import database_sync_to_async

from hunt.models import Hunt, HuntClue, HuntClueStat


@database_sync_to_async
def get_hunt(pk):
  try:
    return Hunt.objects.get(pk=pk)
  except Hunt.DoesNotExist:
    return None


@database_sync_to_async
def get_hunt_current_clue(hunt, user):
  clue_stat = (
    HuntClueStat.objects.filter(clue__hunt=hunt, user=user)
    .order_by("clue__order")
    .last()
  )

  if clue_stat is None:
    first_clue = hunt.clues.order_by("order").first()
    clue_stat = HuntClueStat.objects.create(clue=first_clue, user=user)

  return clue_stat.clue, clue_stat


@database_sync_to_async
def hunt_unlock_clue(clue_stat):
  # Set ClueStat as unlocked
  clue_stat.unlocked = True
  clue_stat.save()

  # If this clue is the last one, return True
  if clue_stat.clue.is_last:
    return True

  # Else, move to next one
  clue = clue_stat.clue
  next_clue = HuntClue.objects.get(order=(clue.order + 1))
  HuntClueStat.objects.create(clue=next_clue, user=clue_stat.user)

  return False
