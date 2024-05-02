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

    # Get hunt and event from database
    self.hunt = await get_hunt(pk=self.hunt_pk)
    self.event = await get_hunt_event(self.hunt)

    # Debug message
    print("Joined channel for hunt: %s" % (self.event.name))

    # Accept connection
    await self.accept()

  async def disconnect(self, code):
    pass

  # Just echo back whatever we receive for now.
  async def receive(self, text_data):
    text_data_json = json.loads(text_data)
    location = text_data_json.get("location")
    await self.send(text_data=json.dumps({"location": location}))
