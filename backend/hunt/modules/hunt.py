from geopy.distance import distance as geopy_distance

from hunt.decorators import command
from hunt.modules.base import BaseModule
from hunt.service import (
  get_hunt_current_clue,
  hunt_unlock_clue,
  hunt_failed_unlock_clue,
)
from hunt.serializers import (
  HuntClueSerializer,
  LocationCheckSerializer,
  ClueUnlockSerializer,
)


class HuntModule(BaseModule):
  prefix = "hunt"

  async def _get_current_clue(self):
    """
    Internal function to get current clue, either from cache, if is fresh, or from database.
    """

    if self.consumer.hunt_stat is None:
      return None, None

    # Get current clue from cache
    clue = self.consumer.get_cached("clue")
    clue_stat = self.consumer.get_cached("clue_stat")

    # If not there, refetch from database, and update cache
    if clue is None or clue_stat is None:
      clue, clue_stat = await get_hunt_current_clue(self.consumer.hunt_stat)
      self.consumer.set_cached("clue", clue)
      self.consumer.set_cached("clue_stat", clue_stat)

    return clue, clue_stat

  def _clear_cached_clue(self):
    """
    Internal function to clean current clue from consumer's cache.
    """
    self.consumer.remove_cached("clue")
    self.consumer.remove_cached("clue_stat")

  @command("cl.current")
  async def get_current_clue(self, _):
    clue, _ = await self._get_current_clue()
    if clue is None:
      await self.consumer.send_error("clue_404")
      return

    serialized_clue = HuntClueSerializer(clue).data
    await self.consumer.send_success(serialized_clue)

  @command("loc.check")
  async def check_location(self, body):
    # Validate input data
    serializer = LocationCheckSerializer(data=body)
    if not serializer.is_valid():
      await self.consumer.send_error("validation_error")
      return

    # Get location from input
    location = serializer.validated_data["location"]

    # Get current clue.
    clue, _ = await self._get_current_clue()
    if clue is None:
      await self.consumer.send_error("clue_404")
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
        "near": True,
        "clue_location": {"lat": clue_coordinates[0], "long": clue_coordinates[1]},
      }
    else:
      response = {"near": False}

    await self.consumer.send_success(response)

  @command("cl.unlock")
  async def unlock_clue(self, body):
    # Validate input data
    serializer = ClueUnlockSerializer(data=body)
    if not serializer.is_valid():
      await self.consumer.send_error("validation_error")
      return

    # Get location from input
    clue_location = serializer.validated_data["location"]

    # Get current clue
    clue, clue_stat = await self._get_current_clue()
    if clue is None or clue_stat is None:
      await self.consumer.send_error("clue_404")
      return

    # Construct tuple that looks like Point.coords
    clue_location_coords = (clue_location["long"], clue_location["lat"])

    # If the player's provided location does not match the exact location of the clue,
    # it indicates that they are likely cheating or attempting to brute force the clue.
    if clue.location_point.coords != clue_location_coords:
      await hunt_failed_unlock_clue(self.consumer.hunt_stat, clue_stat)
      await self.consumer.send_error("unlock_failed")
      return

    # Set clue stat as unlocked on database, and get next one
    is_over = await hunt_unlock_clue(self.consumer.hunt_stat, clue_stat)

    # Clear cached clue, so we can fetch it fresh from database
    self._clear_cached_clue()

    response = {"unlocked": True}
    if is_over:
      response["won"] = True

    await self.consumer.send_success(response)
