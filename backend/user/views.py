from django.conf import settings

from rest_framework import status, permissions
from rest_framework.generics import GenericAPIView, DestroyAPIView
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer
from .auth_tokens import (
  clear_refresh_token_cookie,
  generate_tokens_for_user,
)


class TestAuthTokenAPIView(GenericAPIView):
  def get(self, request):
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


class LogoutAPIView(DestroyAPIView):
  def delete(self, request):
    response = Response(None, status=status.HTTP_204_NO_CONTENT)
    clear_refresh_token_cookie(response)
    return response


class MeAPIView(GenericAPIView):
  serializer_class = UserSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get(self, request):
    user = request.user
    data = self.get_serializer(user).data
    return Response({"user": data})
