import uuid

from django.test import TransactionTestCase
from channels.testing import WebsocketCommunicator

from ridl_api.asgi import application


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
