from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view

from .serializers import LoginSerializer
from .exceptions import BadOAuthToken
from .providers.google import GoogleOAuthProvider
from ridl_api.serializers import DetailedErrorResponse
from user.models import User
from user.serializers import UserSerializer
from user.auth_tokens import generate_tokens_for_user, set_refresh_token_cookie


@extend_schema_view(
  post=extend_schema(
    operation_id="oauth_google_login",
    request=LoginSerializer,
    responses={200: UserSerializer, 400: DetailedErrorResponse},
  )
)
class OAuthLoginAPIView(GenericAPIView):
  serializer_class = LoginSerializer

  @staticmethod
  def create_user_from_raw_user(raw_user):
    user = User.objects.create(
      email=raw_user.get("email"),
      first_name=raw_user.get("first_name"),
      last_name=raw_user.get("last_name"),
      avatar_url=raw_user.get("avatar"),
    )
    user.save()
    return user

  def post(self, request):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    token = serializer.validated_data["token"]

    raw_user = GoogleOAuthProvider.get_user(access_token=token)
    if raw_user is None:
      raise BadOAuthToken()

    # Find or create user
    user = None
    try:
      user = User.objects.get(email=raw_user.get("email"))
      user.avatar_url = raw_user.get("avatar")
      user.save()
    except User.DoesNotExist:
      user = self.create_user_from_raw_user(raw_user)

    (access_token, refresh_token) = generate_tokens_for_user(user)

    body = UserSerializer(user, context=self.get_serializer_context()).data

    headers = {
      "x-access-token": access_token,
    }

    response = Response(body, headers=headers, status=status.HTTP_200_OK)
    set_refresh_token_cookie(response, refresh_token)

    return response
