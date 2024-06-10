import jwt
import uuid

from django.conf import settings
from datetime import datetime, timezone, timedelta

from hunt.tests.base import ConsumerTestCase


class TestConsumerAuthentication(ConsumerTestCase):
  def _generate_bad_access_token(self) -> str:
    """
    Generated an access token with a bad `user_id`.
    """
    return jwt.encode(
      {
        "user_id": str(uuid.uuid4()),
        "exp": datetime.now(tz=timezone.utc) + timedelta(minutes=7),
        "iat": datetime.now(tz=timezone.utc),
      },
      settings.JWT_ACCESS_TOKEN_SECRET,
    )

  async def test_connect_authenticated(self):
    _, access_token = await self._get_valid_auth()

    # Create a communicator and connect
    communicator = self._get_communicator(
      hunt_id=uuid.uuid4(), access_token=access_token
    )
    connected, _ = await communicator.connect()
    self.assertTrue(connected)

    # It's going to reject because we're sending a random uuid for hunt id.
    # But as long as the error is not "Not authenticated" it means
    # we passed the authentication check.
    response = await communicator.receive_json_from()
    self.assertEqual(response[0], "error")

    error = response[1]
    self.assertNotEqual(error["message"], "Not authenticated")

    # Disconnect from the consumer
    await communicator.disconnect()

  async def test_connect_unauthenticated(self):
    # Generate a bad access token, to fail authentication
    bad_access_token = self._generate_bad_access_token()

    # Create communicator without access token
    communicator = self._get_communicator(
      hunt_id=uuid.uuid4(), access_token=bad_access_token
    )
    connected, _ = await communicator.connect()
    self.assertTrue(connected)

    # Should send error message and close connection,
    response = await communicator.receive_json_from()
    self.assertEqual(response[0], "error")

    # with message "Not authenticated"
    error = response[1]
    self.assertEqual(error["message"], "Not authenticated")

    # Disconnect from the consumer
    await communicator.disconnect()
