from django.http import HttpRequest
from django.contrib.auth import get_user_model

from .auth_tokens import (
  decode_refresh_token,
  generate_tokens_for_user,
  set_refresh_token_cookie,
  clear_refresh_token_cookie,
  is_access_token_expired,
)

User = get_user_model()


class RefreshJWTMiddleware:
  """
  This middleware refreshes authentication tokens
  if access token is expired and there is a valid
  refresh token.
  """

  def __init__(self, get_response):
    self.get_response = get_response

  def get_cleared_response(self, request: HttpRequest):
    """
    Returns a response with cleared refresh token cookie.
    If the refresh token is invalid, we clear it, so we don't
    have to check again for the next request.
    """
    response = self.get_response(request)
    clear_refresh_token_cookie(response)
    return response

  def __call__(self, request: HttpRequest):
    # if access or refresh token is not provided skip
    if (
      "x-access-token" not in request.headers or "refresh_token" not in request.COOKIES
    ):
      return self.get_response(request)

    # get tokens from headers and cookies
    access_token = request.headers["x-access-token"]
    refresh_token = request.COOKIES["refresh_token"]

    # this will later be retrived from the JWTAuthentication custom auth class
    request.META["HTTP_ACCESS_TOKEN"] = access_token

    # if access token is not empty and is expired continue, otherwise skip
    if access_token:
      if not is_access_token_expired(access_token):
        return self.get_response(request)

    # check if refresh token is valid
    try:
      refresh_payload = decode_refresh_token(refresh_token)
    except Exception:
      return self.get_response(request)

    # fetch the user mentioned in refresh token
    # if user not found clear response
    try:
      user = User.objects.get(pk=refresh_payload["user_id"])
    except User.DoesNotExist:
      return self.get_cleared_response(request)

    # if token has invalid token_version clear response
    if user.token_version != refresh_payload["token_version"]:
      return self.get_cleared_response(request)

    # generate new tokens
    (new_access_token, new_refresh_token) = generate_tokens_for_user(user)

    # update access token for JWTAuthentication
    request.META["HTTP_ACCESS_TOKEN"] = new_access_token

    # send access token as respone header and refresh token as cookie
    response = self.get_response(request)
    response.headers["x-access-token"] = new_access_token
    set_refresh_token_cookie(response, new_refresh_token)

    return response
