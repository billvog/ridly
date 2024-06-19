from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from drf_spectacular.openapi import OpenApiParameter
from drf_spectacular.utils import extend_schema, extend_schema_view

from ridly.serializers import DetailedErrorSerializer
from user.models import User
from user.serializers import UserSerializer
from user.auth_tokens import generate_tokens_for_user, set_refresh_token_cookie
from user.avatar.tasks import update_avatar_from_oauth
from oauth.serializers import LoginSerializer
from oauth.exceptions import UnsupportedOAuthProvider, BadOAuthToken
from oauth.helpers import create_user_from_oauth_user, map_provider_name_to_class


@extend_schema_view(
  post=extend_schema(
    operation_id="oauth_login",
    request=LoginSerializer,
    responses={200: UserSerializer, 400: DetailedErrorSerializer},
    parameters=[
      OpenApiParameter(
        name="provider",
        description="OAuth provider name",
        location="path",
        type=str,
        enum=["google"],
        required=True,
      )
    ],
  )
)
class OAuthLoginAPIView(GenericAPIView):
  serializer_class = LoginSerializer

  def post(self, request, provider):
    # Get token from request body and validate it
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    token = serializer.validated_data["token"]

    # Get provider from url and map it to provider class
    provider_class = map_provider_name_to_class(provider)

    # If provider is not found raise exception
    if provider_class is None:
      raise UnsupportedOAuthProvider()

    # Get user infor from OAuth provider
    oauth_user = provider_class.get_user(access_token=token)

    # If user is not found raise exception
    if oauth_user is None:
      raise BadOAuthToken()

    # Find or create user
    user = None
    try:
      user = User.objects.get(email=oauth_user.email)
    except User.DoesNotExist:
      # Create user from OAuth information
      user = create_user_from_oauth_user(oauth_user)

      # Update user's avatar from OAuth, asynchronously
      update_avatar_from_oauth.delay(user.id, oauth_user.avatar)

    # Generate authentication tokens for user
    (access_token, refresh_token) = generate_tokens_for_user(user)

    # Serializer user for response
    body = UserSerializer(user, context=self.get_serializer_context()).data

    # Set access token in response headers
    headers = {
      "x-access-token": access_token,
    }

    # Create response with 200
    response = Response(body, headers=headers, status=status.HTTP_200_OK)

    # Set refresh token in response cookies
    set_refresh_token_cookie(response, refresh_token)

    # Send response
    return response
