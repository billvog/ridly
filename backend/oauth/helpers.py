from user.models import User
from oauth.providers.abstract_provider import OAuthUser
from oauth.providers import GoogleOAuthProvider


def create_user_from_oauth_user(oauth_user: OAuthUser):
  """
  Create a user model, from oauth user, we get from OAuth provider.
  """

  user = User.objects.create(
    email=oauth_user.email,
    first_name=oauth_user.first_name,
    last_name=oauth_user.last_name,
  )

  return user


def map_provider_name_to_class(provider_name: str):
  """
  Map provider name to provider class.
  """

  provider_class = None
  if provider_name == "google":
    provider_class = GoogleOAuthProvider

  return provider_class
