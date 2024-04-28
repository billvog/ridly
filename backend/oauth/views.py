from rest_framework import serializers, status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from .providers.google import GoogleOAuthProvider
from user.models import User
from user.serializers import UserSerializer
from user.auth_tokens import generate_tokens_for_user, set_refresh_token_cookie


class OAuthLoginAPIView(GenericAPIView):
  class LoginSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)

  serializer_class = LoginSerializer

  @staticmethod
  def create_user_from_raw_user(raw_user):
    # Fix! sketchy way to set username because google doesn't provide one.
    username = raw_user.get("email").split("@")[0]

    user = User.objects.create(
      username=username,
      email=raw_user.get("email"),
      first_name=raw_user.get("first_name"),
      last_name=raw_user.get("last_name"),
    )
    user.save()
    return user

  def post(self, request):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    token = serializer.validated_data["token"]

    raw_user = GoogleOAuthProvider.get_user(access_token=token)
    if raw_user is None:
      return Response({"ok": False}, status=status.HTTP_400_BAD_REQUEST)

    # Find or create user
    user = None
    try:
      user = User.objects.get(email=raw_user.get("email"))
    except User.DoesNotExist:
      user = self.create_user_from_raw_user(raw_user)

    (access_token, refresh_token) = generate_tokens_for_user(user)

    body = {"user": UserSerializer(user, context=self.get_serializer_context()).data}

    headers = {
      "x-access-token": access_token,
    }

    response = Response(body, headers=headers, status=status.HTTP_200_OK)
    set_refresh_token_cookie(response, refresh_token)

    return response
