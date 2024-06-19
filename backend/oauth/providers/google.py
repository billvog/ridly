import requests
from requests.exceptions import RequestException

from oauth.providers.abstract_provider import OAuthUser, AbstractOAuthProvider


class GoogleOAuthProvider(AbstractOAuthProvider):
  def get_user(access_token):
    url = "https://www.googleapis.com/oauth2/v3/userinfo"
    headers = {"Authorization": f"Bearer {access_token}"}

    try:
      response = requests.get(url, headers=headers)
      response.raise_for_status()
    except RequestException:
      return None

    user = GoogleOAuthProvider.map_response_to_user(response.json())
    return user

  def map_response_to_user(response):
    user = OAuthUser(
      first_name=response.get("given_name"),
      last_name=response.get("family_name"),
      email=response.get("email"),
      avatar=response.get("picture"),
      provider="google",
    )
    return user
