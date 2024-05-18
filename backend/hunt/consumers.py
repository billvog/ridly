import orjson
from websockets import ConnectionClosed
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from geopy.distance import distance as geopy_distance

from .models import Hunt, HuntClue, HuntClueStat
from .serializers import (
  AbstractRequestSerializer,
  LocationCheckSerializer,
  ClueUnlockSerializer,
  HuntClueSerializer,
)
from event.models import Event


@database_sync_to_async
def db_get_hunt(pk):
  try:
    return Hunt.objects.get(pk=pk)
  except Hunt.DoesNotExist:
    return None


@database_sync_to_async
def db_get_hunt_event(hunt):
  try:
    return hunt.event
  except Event.DoesNotExist:
    return None


@database_sync_to_async
def db_get_current_clue(hunt, user):
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
def db_unlock_clue(clue_stat):
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


class HuntConsumer(AsyncJsonWebsocketConsumer):
  async def connect(self):
    self.content = []

    # Accept early, so we can send detailed errors on why connection fails, if it does.
    await self.accept()

    # Get user, if any, from scope
    self.user = self.scope["user"] if "user" in self.scope else None

    # Reject connection if not authenticated
    if (self.user is None) or (not self.user.is_authenticated):
      await self.send_error(0, "Not authenticated", close=True)
      return

    # Get hunt id from params
    self.hunt_pk = self.scope["url_route"]["kwargs"]["hunt_pk"]

    # Get hunt from database, if not found reject connection
    self.hunt = await db_get_hunt(pk=self.hunt_pk)
    if self.hunt is None:
      await self.send_error(0, "Hunt not found", close=True)
      return

    # Get associated event from database, if not found reject
    self.event = await db_get_hunt_event(self.hunt)
    if self.event is None:
      await self.send_error(0, "Event not found", close=True)
      return

    # Create room group name for channel layers
    self.room_group_name = f"hunt_{self.hunt_pk}"

    # Join room for that hunt
    await self.channel_layer.group_add(self.room_group_name, self.channel_name)

    # Debug message
    print("Joined channel for hunt: %s" % (self.event.name))

  async def disconnect(self, code):
    # Leave room, if joined (in case of early reject, like when not authenticated)
    if hasattr(self, "room_group_name"):
      await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

  # Receive message from client
  async def receive_json(self, content, **kwargs):
    self.content = content

    request_serializer = AbstractRequestSerializer(data=content)
    if not request_serializer.is_valid():
      await self.send_error(0, message="Invalid request")
      return

    request_type = request_serializer.validated_data["type"]

    if request_type == "loc.check":
      await self._handle_location_check(content)
    elif request_type == "cl.unlock":
      await self._handle_clue_unlock(content)
    elif request_type == "cl.current":
      await self._handle_current_clue()

  # Check location delta with objective
  async def _handle_location_check(self, data):
    # Validate input data
    serializer = LocationCheckSerializer(data=data)
    if not serializer.is_valid():
      await self.send_error(0, message="Invalid request data")
      return

    # Get location from input
    location = serializer.validated_data["location"]

    # Get current clue.
    # Ideally store the current clue each user in cache, so we don't
    # have to make queries to postgres every time a players checks their location.
    clue, _ = await db_get_current_clue(self.hunt, self.user)
    if clue is None:
      await self.send_error(0, message="Something went wrong")
      return

    # Calculate distance between input and clue coordinates in meters
    input_coordinates = (location["lat"], location["long"])
    clue_coordinates = tuple(reversed(clue.location_point.coords))

    distance = geopy_distance(input_coordinates, clue_coordinates).meters

    # Check if player is near, by comparing distance to clue's location threshold.
    is_near = distance < clue.location_threshold

    # If near, return the exact location of the clue
    if is_near:
      response = {
        "type": "loc.check",
        "near": True,
        "clue_location": {"lat": clue_coordinates[0], "long": clue_coordinates[1]},
      }
    else:
      response = {"type": "loc.check", "near": False}

    await self.send_success(response)

  async def _handle_clue_unlock(self, data):
    # Validate input data
    serializer = ClueUnlockSerializer(data=data)
    if not serializer.is_valid():
      await self.send_error(0, message="Invalid request data")
      return

    # Get location from input
    clue_location = serializer.validated_data["location"]

    # Get current clue
    clue, clue_stat = await db_get_current_clue(self.hunt, self.user)
    if clue is None or clue_stat is None:
      await self.send_error(0, message="Something went wrong")
      return

    # Construct tuple that looks like Point.coords
    clue_location_coords = (clue_location["long"], clue_location["lat"])

    # In this case, the player is prolly cheating, OR our code is bad.
    # The client should ONLY know the exact location of the clue, if
    # they've sent a location that's near the clue to "loc.check".
    # Otherwise, they're trying to brute force it (?)
    # TODO: Update clue's tries left. Each user should have 2.
    if clue.location_point.coords != clue_location_coords:
      await self.send_error(0, message="Failed to unlock clue")
      return

    # Set clue stat as unlocked on database
    is_over = await db_unlock_clue(clue_stat)

    if is_over:
      response = {"type": "cl.unlock", "unlocked": True, "won": True}
    else:
      response = {"type": "cl.unlock", "unlocked": True}

    await self.send_success(response)

  # Send back current clue
  async def _handle_current_clue(self):
    # Get current clue from db
    clue, _ = await db_get_current_clue(self.hunt, self.user)
    if clue is None:
      await self.send_error(0, message="Something went wrong")
      return

    # Serialize it
    serialized_clue = HuntClueSerializer(clue).data

    # Send it back
    await self.send_success({"type": "cl.current", "clue": serialized_clue})

  # Helpers to send responses back

  def build_response(self, status, data):
    if data is None:
      data = {}
    # response = [status]
    # if len(self.content) == 3:
    #   response.append(self.content[1])  # Add code to response
    # response.append(data)
    # return response
    response = {"status": status, "data": data}
    return response

  async def send_error(self, code, message=None, close=False, details=None):
    data = {"code": code}
    if message:
      data["message"] = message
    if details:
      data["details"] = details
    await self.send_json(self.build_response("error", data), close)

  async def send_success(self, data, close=False):
    await self.send_json(self.build_response("success", data), close=close)

  # Override send and receive methods to use orjson and less function calls

  async def send_json(self, content, close=False):
    try:
      await super().send(text_data=orjson.dumps(content).decode(), close=close)
    except (RuntimeError, ConnectionClosed):
      # socket has been closed in the meantime
      pass

  @classmethod
  async def decode_json(cls, text_data):
    return orjson.loads(text_data)
