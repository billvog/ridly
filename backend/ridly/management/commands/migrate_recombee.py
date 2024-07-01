from django.conf import settings
from django.core.management.base import BaseCommand

from recombee_api_client.api_client import RecombeeClient, Region, Batch
from recombee_api_client.api_requests import (
  SetItemValues,
  SetUserValues,
)

from event.models import Event
from user.models import User

client = RecombeeClient(
  settings.RECOMBEE_DB, settings.RECOMBEE_SECRET, region=Region.EU_WEST
)


class Command(BaseCommand):
  help = "Migrate data to Recombee, for events and users."

  def handle(self, *args, **options):
    # Load events to Recombee db
    requests = []
    events = Event.objects.all()
    for event in events:
      requests.append(
        SetItemValues(
          event.id,
          {
            "name": event.name,
            "location_name": event.location_name,
            "location_longitude": event.location_coordinates.x,
            "location_latitude": event.location_coordinates.y,
            "happening_at": event.happening_at.timestamp(),
          },
          cascade_create=True,
        )
      )

    # Send requests in batch; it's faster
    client.send(Batch(requests))

    # Write out success message
    self.stdout.write(self.style.SUCCESS("Successfully migrated events"))

    # Load users to Recombee db
    requests = []
    users = User.objects.all()
    for user in users:
      requests.append(
        SetUserValues(
          user.id,
          {"username": user.username, "is_creator": user.is_creator},
          cascade_create=True,
        )
      )

    # Send requests in batch
    client.send(Batch(requests))

    # Write out success message
    self.stdout.write(self.style.SUCCESS("Successfully migrated users"))
