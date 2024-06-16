import uuid

from django.test import TransactionTestCase
from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator

from ridly.asgi import application
from user.models import User
from user.auth_tokens import generate_tokens_for_user


class ConsumerTestCase(TransactionTestCase):
  # Load test data from fixtures for each test case.
  fixtures = ["user", "creator", "event", "hunt"]

  def _get_url(self, hunt_id: uuid.UUID, access_token: str | None) -> str:
    """
    Generate consumer url with ranomd hunt id and access token.
    """
    url = f"/ws/hunt/{hunt_id}/"
    if access_token is not None:
      url += f"?accessToken={access_token}"
    return url

  def _get_communicator(self, hunt_id: uuid.UUID, access_token: str | None):
    return WebsocketCommunicator(application, self._get_url(hunt_id, access_token))

  @database_sync_to_async
  def _get_user(self, id):
    return User.objects.get(id=id)

  async def _get_valid_auth(self):
    """
    Returns a valid user with a valid access token.
    """
    user = await self._get_user("33398e61-31c4-41ab-9862-a52f34c4a77f")
    self.assertIsNotNone(user, "Failed to get user.")
    access_token, _ = generate_tokens_for_user(user)
    return user, access_token
