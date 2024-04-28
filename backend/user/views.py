from rest_framework import status, permissions
from rest_framework.generics import GenericAPIView, DestroyAPIView
from rest_framework.response import Response

from .serializers import UserSerializer
from .auth_tokens import (
  clear_refresh_token_cookie,
)


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
