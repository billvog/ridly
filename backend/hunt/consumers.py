import time
import orjson

from websockets import ConnectionClosed
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from hunt.service import get_hunt, get_hunt_stat
from hunt.modules.hunt import HuntModule
from hunt.exceptions import ConsumerException

from event.service import get_event_from_hunt


class HuntConsumer(AsyncJsonWebsocketConsumer):
  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)

    self.room_group_name = None

    self.user = None
    self.hunt_pk = None
    self.hunt_stat = None
    self.hunt = None
    self.event = None

    self.channel_cache = {}
    self.invalidate_cache_at = 0

    self.components = {}

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
    self.hunt = await get_hunt(pk=self.hunt_pk)
    if self.hunt is None:
      await self.send_error(0, "Hunt not found", close=True)
      return

    # Get, or create, associated hunt stat from database, if not found, reject
    self.hunt_stat = await get_hunt_stat(hunt=self.hunt, user=self.user)
    if self.hunt_stat is None:
      await self.send_error(0, "Couldn't create hunt stat", close=True)
      return

    # Get associated event from database, if not found reject
    self.event = await get_event_from_hunt(self.hunt)
    if self.event is None:
      await self.send_error(0, "Event not found", close=True)
      return

    # Create room group name for channel layers
    self.room_group_name = f"hunt_{self.hunt_pk}"

    # Join room for that hunt
    await self.channel_layer.group_add(self.room_group_name, self.channel_name)

    # Initialize our components
    self.components = {"hunt": HuntModule(self)}

  async def disconnect(self, _):
    # Leave room, if joined (in case of early reject, like when not authenticated)
    if self.room_group_name is not None:
      await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

  # Receive message from client
  async def receive_json(self, content, **kwargs):
    self.content = content

    namespace = content[0].split(".")[0]
    component = self.components.get(namespace)
    if component:
      try:
        await component.dispatch_command(content)
      except ConsumerException as e:
        await self.send_error(e.code, message=e.message)
    else:
      await self.send_error("protocol.unknown_command")

  # Helpers to send responses back

  def build_response(self, status, data):
    if data is None:
      data = {}
    response = [status]
    if len(self.content) == 3:
      response.append(self.content[1])  # Add code to response
    response.append(data)
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

  # Caching

  def get_cached(self, key):
    """
    Get a value from the cache. If cache is invalid, return None.
    If None is returned, the caller should fetch the value from the database.
    """
    if self._is_cache_stale():
      self._invalidate_cache()
      return None
    return self.channel_cache.get(key)

  def set_cached(self, key, value):
    """
    Set a value in the cache.
    """
    self.channel_cache[key] = value

  def remove_cached(self, key):
    """
    Remove a value from cache.
    """
    del self.channel_cache[key]

  def _is_cache_stale(self):
    """
    Returns whether the cache is stale or not.
    """
    now = time.time()
    return self.invalidate_cache_at <= now

  def _invalidate_cache(self):
    """
    Resets the cache invalidation clock.
    """
    self.channel_cache = {}
    self.invalidate_cache_at = time.time() + 10
