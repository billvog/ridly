from django.conf import settings

from rest_framework import status, permissions
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from ridl_api.serializers import DetailedErrorResponse
from .models import User
from .serializers import UserSerializer
from .auth_tokens import (
  clear_refresh_token_cookie,
  generate_tokens_for_user,
)


@extend_schema(
  methods=["GET"],
  request=None,
  responses={200: None, 404: None},
  description="Test endpoint to get an access token for the first user in the database used for WebSockets. Only for testing!",
)
class TestAuthTokenAPIView(APIView):
  def get(self, _):
    # Only for testing!!!
    if not settings.DEBUG:
      return Response(None, status=status.HTTP_404_NOT_FOUND)

    user = User.objects.first()
    (access_token, _) = generate_tokens_for_user(user)

    headers = {
      "x-access-token": access_token,
    }

    response = Response(None, headers=headers, status=status.HTTP_200_OK)
    return response


@extend_schema(
  methods=["DELETE"],
  request=None,
  responses={204: None},
)
class LogoutAPIView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  @extend_schema(
    request=None,
  )
  def delete(self, _):
    response = Response(None, status=status.HTTP_204_NO_CONTENT)
    clear_refresh_token_cookie(response)
    return response


@extend_schema(
  responses={200: UserSerializer, 403: DetailedErrorResponse},
)
class MeAPIView(GenericAPIView):
  serializer_class = UserSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get(self, request):
    user = request.user
    data = self.get_serializer(user).data
    return Response({"user": data})
