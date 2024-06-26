from django.conf import settings

from rest_framework import status, permissions
from rest_framework.generics import GenericAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, extend_schema_view

from ridly.serializers import DetailedErrorSerializer, ValidationErrorSerializer
from user.models import User
from user.serializers import (
  UpdateLastKnownLocationSerializer,
  UserSerializer,
  CompleteSignupSerializer,
)
from user.auth_tokens import (
  generate_tokens_for_user,
)


@extend_schema(exclude=True)
class TestAuthTokenAPIView(APIView):
  def get(self, _):
    # Only for testing!!!
    if not settings.DEBUG:
      return Response(None, status=status.HTTP_404_NOT_FOUND)

    user = User.objects.first()
    access_token, refresh_token = generate_tokens_for_user(user)

    headers = {
      "x-access-token": access_token,
      "x-refresh-token": refresh_token,
    }

    response = Response(None, headers=headers, status=status.HTTP_200_OK)
    return response


@extend_schema_view(
  get=extend_schema(
    operation_id="user_me",
    responses={200: UserSerializer, 403: DetailedErrorSerializer},
  )
)
class MeAPIView(GenericAPIView):
  serializer_class = UserSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get(self, request):
    user = request.user
    data = self.get_serializer(user).data
    return Response(data)


@extend_schema_view(
  put=extend_schema(
    operation_id="user_complete_signup",
    responses={
      200: CompleteSignupSerializer,
      400: ValidationErrorSerializer,
      403: DetailedErrorSerializer,
    },
  ),
)
class CompleteSignupAPIView(UpdateAPIView):
  serializer_class = CompleteSignupSerializer
  permission_classes = [permissions.IsAuthenticated]
  http_method_names = ["put"]

  def get_object(self):
    return self.request.user

  def perform_update(self, serializer):
    validated_data = serializer.validated_data
    validated_data["did_complete_signup"] = True
    return super().perform_update(serializer)


@extend_schema_view(
  put=extend_schema(
    operation_id="user_update_last_known_location",
    responses={
      200: UpdateLastKnownLocationSerializer,
      400: ValidationErrorSerializer,
      403: DetailedErrorSerializer,
    },
  ),
)
class UpdateLastKnownLocationAPIView(UpdateAPIView):
  serializer_class = UpdateLastKnownLocationSerializer
  permission_classes = [permissions.IsAuthenticated]
  http_method_names = ["put"]

  def get_object(self):
    return self.request.user
