from channels.db import database_sync_to_async

from event.models import Event


@database_sync_to_async
def get_event_from_hunt(hunt):
  try:
    return hunt.event
  except Event.DoesNotExist:
    return None
