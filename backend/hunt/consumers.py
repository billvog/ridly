import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from geopy.distance import distance as geopy_distance

from .models import TreasureHunt, TreasureHuntClue
from event.models import Event


@database_sync_to_async
def get_hunt(pk):
  try:
    return TreasureHunt.objects.get(pk=pk)
  except TreasureHunt.DoesNotExist:
    return None


@database_sync_to_async
def get_hunt_event(hunt):
  try:
    return hunt.event
  except Event.DoesNotExist:
    return None


@database_sync_to_async
def get_current_hunt_clue(hunt, user):
  try:
    # For now, get first clue for hunt. Later on, when we
    # we figure out clue tracking use user to find current clue.
    return hunt.clues.first()
  except TreasureHuntClue.DoesNotExist:
    return None


class HuntConsumer(AsyncWebsocketConsumer):
  async def connect(self):
    # Get user, if any, from scope
    self.user = self.scope["user"] if "user" in self.scope else None

    # Reject connection if not authenticated
    if (self.user is None) or (not self.user.is_authenticated):
      return

    # Get hunt id from params
    self.hunt_pk = self.scope["url_route"]["kwargs"]["hunt_pk"]

    # Get hunt from database, if not found reject connection
    self.hunt = await get_hunt(pk=self.hunt_pk)
    if self.hunt is None:
      return

    # Get associated event from database, if not found reject
    self.event = await get_hunt_event(self.hunt)
    if self.event is None:
      return

    # Create room group name for channel layers
    self.room_group_name = f"hunt_{self.hunt_pk}"

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
  async def receive(self, text_data):
    data = json.loads(text_data)

    if data.get("type") == "location.check":
      location = data.get("location")
      await self._handle_location_check(location)

  # Check location delta with objective
  async def _handle_location_check(self, location):
    # Get current clue
    clue = await get_current_hunt_clue(self.hunt, self.user)
    if clue is None:
      return

    # Calculate distance between input and clue coordinates in meters
    input_coordinates = (location.get("lat"), location.get("long"))
    clue_coordinates = tuple(reversed(clue.location_point.coords))

    distance = geopy_distance(input_coordinates, clue_coordinates).meters

    # Check if player is near, by comparing distance to clue's location threshold.
    is_near = distance < clue.location_threshold

    # If near, return the exact location of the clue
    if is_near:
      response = {
        "near": True,
        "clue_location": {"lat": clue_coordinates[0], "long": clue_coordinates[1]},
      }
    else:
      response = {"near": False}

    await self.send(text_data=json.dumps(response))
