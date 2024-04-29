from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from .models import Event


# Many-to-Many signal to update Event.participant_count when
# someone is beign added or removed from Event.participants
@receiver(m2m_changed, sender=Event.participants.through)
def update_participant_count(sender, instance, action, **kwargs):
  if action == "post_add" or action == "post_remove":
    instance.participant_count = instance.participants.count()
    instance.save()
