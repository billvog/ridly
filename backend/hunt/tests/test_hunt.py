import uuid

from channels.db import database_sync_to_async

from hunt.tests.base import ConsumerTestCase
from hunt.service import get_hunt, get_hunt_stat, get_hunt_current_clue


class TestConsumerHunt(ConsumerTestCase):
  """
  Test "hunt" module of the consumer, which handles the core game logic.
  """

  def __init__(self, methodName="runTest") -> None:
    super().__init__(methodName)

    self.HUNT_ID = "63b4a5da-ecf7-4678-aba3-a610c8223120"
    self.EMPTY_HUNT_ID = "6466b5c1-17a2-4ccd-af6a-b9a4f16cb127"  # hunt with no clues
    self.CLUE_ID = 2
    self.CLUE_LOCATION = (19.355314152331932, 39.15152428323966)
    self.CLUE_GOOD_LOCATION = (19.355314152331932, 39.15152428323966)
    self.CLUE_BAD_LOCATION = (19.356315152331938, 37.15152428323966)

  async def test_hunt_404(self):
    _, access_token = await self._get_valid_auth()

    BAD_HUNT_ID = uuid.uuid4()

    # Create a communicator and connect
    communicator = self._get_communicator(
      hunt_id=BAD_HUNT_ID, access_token=access_token
    )
    connected, _ = await communicator.connect()
    self.assertTrue(connected, "Failed to connect to the consumer.")

    # Wait for the response
    response = await communicator.receive_json_from()

    # Ensure the response is correct
    self.assertEqual(response[0], "error")
    self.assertEqual(response[1]["message"], "Hunt not found")

    # Disconnect from the consumer
    await communicator.disconnect()

  async def test_clue_current(self):
    _, access_token = await self._get_valid_auth()

    # Create a communicator and connect
    communicator = self._get_communicator(
      hunt_id=self.HUNT_ID, access_token=access_token
    )
    connected, _ = await communicator.connect()
    self.assertTrue(connected, "Failed to connect to the consumer.")

    # Send a message to the consumer
    command_id = 1
    await communicator.send_json_to(["hunt.cl.current", command_id, {}])

    # Wait for the response
    response = await communicator.receive_json_from()

    # Ensure the response is correct
    self.assertEqual(response[0], "success")
    self.assertEqual(response[1], command_id)
    self.assertEqual(response[2]["id"], self.CLUE_ID)

    # Disconnect from the consumer
    await communicator.disconnect()

  async def test_clue_404(self):
    _, access_token = await self._get_valid_auth()

    # Create a communicator and connect
    communicator = self._get_communicator(
      hunt_id=self.EMPTY_HUNT_ID, access_token=access_token
    )
    connected, _ = await communicator.connect()
    self.assertTrue(connected, "Failed to connect to the consumer.")

    # Send a message to the consumer
    command_id = 10
    await communicator.send_json_to(["hunt.cl.current", command_id, {}])

    # Wait for the response
    response = await communicator.receive_json_from()

    # Ensure the response is correct
    self.assertEqual(response[0], "error")
    self.assertEqual(response[2]["code"], "clue_404")

    # Disconnect from the consumer
    await communicator.disconnect()

  async def test_location_check_success(self):
    _, access_token = await self._get_valid_auth()

    # Create a communicator and connect
    communicator = self._get_communicator(
      hunt_id=self.HUNT_ID, access_token=access_token
    )
    connected, _ = await communicator.connect()
    self.assertTrue(connected, "Failed to connect to the consumer.")

    # Send `hunt.loc.check`, with GOOD location
    command_id = 10
    await communicator.send_json_to(
      [
        "hunt.loc.check",
        command_id,
        {
          "loc": {"long": self.CLUE_GOOD_LOCATION[0], "lat": self.CLUE_GOOD_LOCATION[1]}
        },
      ]
    )

    # Wait for the response, and ensure it is correct
    response = await communicator.receive_json_from()
    self.assertEqual(response[0], "success")
    self.assertEqual(response[1], command_id)
    self.assertEqual(response[2]["near"], True)
    self.assertEqual(
      response[2]["clue_location"],
      {"long": self.CLUE_LOCATION[0], "lat": self.CLUE_LOCATION[1]},
    )

    # Disconnect from the consumer
    await communicator.disconnect()

  async def test_location_check_failure(self):
    _, access_token = await self._get_valid_auth()

    # Create a communicator and connect
    communicator = self._get_communicator(
      hunt_id=self.HUNT_ID, access_token=access_token
    )
    connected, _ = await communicator.connect()
    self.assertTrue(connected, "Failed to connect to the consumer.")

    # Send `hunt.loc.check`, with BAD location
    command_id = 80
    await communicator.send_json_to(
      [
        "hunt.loc.check",
        command_id,
        {"loc": {"long": self.CLUE_BAD_LOCATION[0], "lat": self.CLUE_BAD_LOCATION[1]}},
      ]
    )

    # Wait for the response, and ensure it is correct
    response = await communicator.receive_json_from()
    self.assertEqual(response[0], "success")
    self.assertEqual(response[1], command_id)
    self.assertEqual(response[2]["near"], False)

    # Disconnect from the consumer
    await communicator.disconnect()

  async def test_clue_unlock_success(self):
    _, access_token = await self._get_valid_auth()

    # Create a communicator and connect
    communicator = self._get_communicator(
      hunt_id=self.HUNT_ID, access_token=access_token
    )
    connected, _ = await communicator.connect()
    self.assertTrue(connected, "Failed to connect to the consumer.")

    # Send `hunt.cl.unlock`, with GOOD location
    command_id = 10
    await communicator.send_json_to(
      [
        "hunt.cl.unlock",
        command_id,
        {
          "loc": {"long": self.CLUE_GOOD_LOCATION[0], "lat": self.CLUE_GOOD_LOCATION[1]}
        },
      ]
    )

    # Wait for the response, and ensure it is correct
    response = await communicator.receive_json_from()
    self.assertEqual(response[0], "success")
    self.assertEqual(response[1], command_id)
    self.assertEqual(response[2]["unlocked"], True)
    self.assertEqual(response[2]["won"], True)

    # Disconnect from the consumer
    await communicator.disconnect()

  async def test_clue_unlock_failure(self):
    user, access_token = await self._get_valid_auth()

    hunt = await get_hunt(self.HUNT_ID)
    self.assertIsNotNone(hunt, "Failed to get hunt.")

    hunt_stat = await get_hunt_stat(hunt, user)
    self.assertIsNotNone(hunt_stat, "Failed to get hunt stat.")

    clue, clue_stat = await get_hunt_current_clue(hunt_stat)
    self.assertIsNotNone(clue_stat, "Failed to get clue stat.")
    self.assertEqual(clue.location_point.coords, self.CLUE_LOCATION)

    # Create a communicator and connect
    communicator = self._get_communicator(hunt_id=hunt.id, access_token=access_token)
    connected, _ = await communicator.connect()
    self.assertTrue(connected, "Failed to connect to the consumer.")

    # Send `hunt.cl.unlock`, with BAD location
    command_id = 80
    await communicator.send_json_to(
      [
        "hunt.cl.unlock",
        command_id,
        {"loc": {"long": self.CLUE_BAD_LOCATION[0], "lat": self.CLUE_BAD_LOCATION[1]}},
      ]
    )

    # Wait for the response, and ensure it is correct
    response = await communicator.receive_json_from()
    self.assertEqual(response[0], "error")
    self.assertEqual(response[1], command_id)
    self.assertEqual(response[2]["code"], "unlock_failed")

    # Ensure tries_made is incremented, as we failed to unlock the clue
    await database_sync_to_async(clue_stat.refresh_from_db)()
    self.assertEqual(clue_stat.tries_made, 1)

    # Disconnect from the consumer
    await communicator.disconnect()
