import uuid

from channels.db import database_sync_to_async

from hunt.tests.base import ConsumerTestCase
from hunt.models import Hunt


class TestHuntConsumer(ConsumerTestCase):
  @database_sync_to_async
  def get_hunt(self, id):
    hunt = Hunt.objects.get(id=id)
    return hunt

  async def test_connect_success(self):
    _, access_token = await self._get_valid_auth()

    HUNT_ID = "63b4a5da-ecf7-4678-aba3-a610c8223120"
    CLUE_ID = 2

    # Create a test hunt
    hunt = await self.get_hunt(HUNT_ID)
    self.assertIsNotNone(hunt, "Failed to get hunt.")

    # Create a communicator and connect
    communicator = self._get_communicator(hunt_id=hunt.id, access_token=access_token)
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
    self.assertEqual(response[2]["id"], CLUE_ID)

    # Disconnect from the consumer
    await communicator.disconnect()

  async def test_connect_failure(self):
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
