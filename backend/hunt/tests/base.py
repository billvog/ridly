import uuid

from django.test import TransactionTestCase
from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator

from ridl_api.asgi import application
from user.models import User
from user.auth_tokens import generate_tokens_for_user

class ConsumerTestCase(TransactionTestCase):
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
  def _create_user(self, **kwargs):
    return User.objects.create(**kwargs)
  
  async def _get_valid_user(self):
    """
    Creates and returns a valid user with a valid access token.
    """
    user = await self._create_user(email="test@example.com", password="password")
    self.assertIsNotNone(user, "Failed to create user.")
    access_token, _ = generate_tokens_for_user(user)
    return user, access_token
