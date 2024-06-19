from abc import ABC, abstractmethod


class OAuthUser:
  def __init__(
    self, first_name=None, last_name=None, email=None, avatar=None, provider=None
  ):
    self.first_name = first_name
    self.last_name = last_name
    self.email = email
    self.avatar = avatar
    self.provider = provider


class AbstractOAuthProvider(ABC):
  @abstractmethod
  def get_user(self, access_token):
    pass

  @abstractmethod
  def map_response_to_user(self, response) -> OAuthUser:
    pass
