import jwt
from urllib.parse import parse_qs
from django.http import HttpRequest
from rest_framework import authentication
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

from .auth_tokens import decode_access_token

User = get_user_model()


class JWTAuthentication(authentication.BaseAuthentication):
  """
  Authenticate user with the access token
  provided from RefreshJWTMiddleware middleware.
  """

  def authenticate(self, request: HttpRequest):
    if "HTTP_ACCESS_TOKEN" not in request.META:
      return None

    access_token = request.META["HTTP_ACCESS_TOKEN"]

    try:
      access_payload = decode_access_token(access_token)
      return (User.objects.get(pk=access_payload["user_id"]), None)
    except jwt.ExpiredSignatureError:
      print("Access JWT error: Expired signature.")
    except Exception as error:
      print("Error occured while verifying access token:", error)
      return None


class JWTWebSocketAuthentication:
  """
  Simple authentication middleware for WebSockets
  with access token provided from headers.
  For now, we don't refresh tokens.
  """

  @database_sync_to_async
  def _get_user(self, user_id):
    try:
      return User.objects.get(pk=user_id)
    except User.DoesNotExist:
      return None

  def __init__(self, app):
    self.app = app

  async def __call__(self, scope, receive, send):
    # Parse query string
    raw_query = scope["query_string"]
    params = parse_qs(raw_query)

    # Get access token from query params
    if b"accessToken" in params:
      access_token = params[b"accessToken"][0]

    # If there is an access token, try decode it
    if access_token is not None:
      try:
        access_payload = decode_access_token(access_token)
        scope["user"] = await self._get_user(access_payload["user_id"])
      except jwt.ExpiredSignatureError:
        print("Access JWT error: Expired signature.")
      except Exception as error:
        print("Error occured while verifying access token:", error)

    return await self.app(scope, receive, send)
