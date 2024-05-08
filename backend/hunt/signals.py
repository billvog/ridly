from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import TreasureHuntClue


@receiver(post_save, sender=TreasureHuntClue)
def update_is_last_clue(sender, instance, update_fields, **kwargs):
  # Check if "is_last" is in update_fields
  # to prevent infinite recursion.
  if update_fields and "is_last" in update_fields:
    return

  # Get all clues for hunt
  clues = TreasureHuntClue.objects.filter(hunt=instance.hunt)

  # Get last clue, based on order
  last_clue = clues.order_by("order").last()

  # Update all clues
  for clue in clues:
    clue.is_last = clue == last_clue
    clue.save(update_fields=["is_last"])
