from django.http import HttpRequest
from django.contrib.auth import get_user_model


from user.auth_tokens import (
  decode_refresh_token,
  generate_tokens_for_user,
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

  def __call__(self, request: HttpRequest):
    access_token = None
    refresh_token = None

    # get access token from headers
    if "x-access-token" in request.headers:
      access_token = request.headers["x-access-token"]

    # get refresh token from headers
    if "x-refresh-token" in request.headers:
      refresh_token = request.headers["x-refresh-token"]

    # if none of the access tokens are present, skip
    if access_token is None and refresh_token is None:
      return self.get_response(request)

    # this will later be retrived from the JWTAuthentication custom auth class
    request.META["HTTP_ACCESS_TOKEN"] = access_token

    # if access token is not empty and isn't expired skip
    if access_token and not is_access_token_expired(access_token):
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
      return self.get_response(request)

    # if token has invalid token_version clear response
    if user.token_version != refresh_payload["token_version"]:
      return self.get_response(request)

    # generate new tokens
    (new_access_token, new_refresh_token) = generate_tokens_for_user(user)

    # update access token for JWTAuthentication
    request.META["HTTP_ACCESS_TOKEN"] = new_access_token

    # send access and refresh token as respone header
    response = self.get_response(request)
    response.headers["x-access-token"] = new_access_token
    response.headers["x-refresh-token"] = new_refresh_token

    return response
