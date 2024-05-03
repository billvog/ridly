import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import TreasureHunt


@database_sync_to_async
def get_hunt(pk):
  return TreasureHunt.objects.get(pk=pk)


@database_sync_to_async
def get_hunt_event(hunt):
  return hunt.event


class HuntConsumer(AsyncWebsocketConsumer):
  async def connect(self):
    # Get user, if any, from scope
    self.user = self.scope["user"] if "user" in self.scope else None

    # Close connection if not authenticated.
    if (self.user is None) or (not self.user.is_authenticated):
      print("Not Authenticated")
      return

    # Get hunt id from params
    self.hunt_pk = self.scope["url_route"]["kwargs"]["hunt_pk"]
    self.room_group_name = f"hunt_{self.hunt_pk}"  # used for layers

    # Get hunt and event from database
    self.hunt = await get_hunt(pk=self.hunt_pk)
    self.event = await get_hunt_event(self.hunt)

    # Join room for that hunt
    await self.channel_layer.group_add(self.room_group_name, self.channel_name)

    # Debug message
    print("Joined channel for hunt: %s" % (self.event.name))

    # Accept connection
    await self.accept()

  async def disconnect(self, code):
    # Leave room, if joined (in case of early reject, like when not authenticated)
    if hasattr(self, "room_group_name"):
      await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

  # Receive messages from clients.
  # Just echo back to the room whatever we receive for now.
  async def receive(self, text_data):
    text_data_json = json.loads(text_data)
    location = text_data_json.get("location")

    await self.channel_layer.group_send(
      self.room_group_name, {"type": "hunt.location_check", "location": location}
    )

  # Handles location checking events
  async def hunt_location_check(self, event):
    location = event.get("location")
    await self.send(text_data=json.dumps({"location": location}))
