import requests
from requests.exceptions import RequestException
from .abstract_provider import AbstractOAuthProvider


class GoogleOAuthProvider(AbstractOAuthProvider):
  @staticmethod
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

  @staticmethod
  def map_response_to_user(response):
    user = dict()
    user["id"] = response.get("sub")
    user["first_name"] = response.get("given_name")
    user["last_name"] = response.get("family_name")
    user["email"] = response.get("email")
    user["avatar"] = response.get("picture")
    user["provider"] = "google"
    return user
