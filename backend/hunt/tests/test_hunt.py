import uuid

from django.utils import timezone
from django.contrib.gis.geos import Point
from channels.db import database_sync_to_async

from user.models import User
from event.models import Event
from creator.models import Creator
from hunt.tests.base import ConsumerTestCase
from hunt.models import Hunt


class TestHuntConsumer(ConsumerTestCase):
  @database_sync_to_async
  def create_valid_hunt(self, user: User):
    creator = Creator.objects.create(user=user)
    event = Event.objects.create(
      creator=creator, location_coordinates=Point(0, 0), happening_at=timezone.now()
    )
    hunt = Hunt.objects.create(event=event)
    clue = hunt.clues.create(location_point=Point(0, 0))
    return hunt, clue

  async def test_connect_success(self):
    user, access_token = await self._get_valid_user()

    # Create a test hunt
    hunt, clue = await self.create_valid_hunt(user=user)
    self.assertIsNotNone(hunt, "Failed to create hunt.")
    self.assertIsNotNone(clue, "Failed to create clue.")

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
    self.assertEqual(response[2]["id"], clue.id)

    # Disconnect from the consumer
    await communicator.disconnect()

  async def test_connect_failure(self):
    _, access_token = await self._get_valid_user()

    invalid_hunt_id = uuid.uuid4()
    
    # Create a communicator and connect
    communicator = self._get_communicator(hunt_id=invalid_hunt_id, access_token=access_token)
    connected, _ = await communicator.connect()
    self.assertTrue(connected, "Failed to connect to the consumer.")
  
    # Wait for the response
    response = await communicator.receive_json_from()
    
    # Ensure the response is correct
    self.assertEqual(response[0], "error")
    self.assertEqual(response[1]["message"], "Hunt not found")

    # Disconnect from the consumer
    await communicator.disconnect()