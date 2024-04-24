from django.contrib.auth import authenticate
from rest_framework import status, permissions
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from .serializers import UserSerializer, LoginUserSerializer, RegisterUserSerializer
from .auth_tokens import generate_tokens_for_user, set_refresh_token_cookie


class LoginAPIView(GenericAPIView):
  serializer_class = LoginUserSerializer

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    email = data["email"]
    password = data["password"]

    user = authenticate(email=email, password=password)
    if user is None:
      return Response(
        {"detail": "You entered an incorrect email or password."},
        status=status.HTTP_400_BAD_REQUEST,
      )

    (access_token, refresh_token) = generate_tokens_for_user(user)

    body = {"user": UserSerializer(user, context=self.get_serializer_context()).data}

    headers = {
      "x-access-token": access_token,
    }

    response = Response(body, headers=headers, status=status.HTTP_200_OK)
    set_refresh_token_cookie(response, refresh_token)

    return response


class RegisterAPIView(GenericAPIView):
  serializer_class = RegisterUserSerializer

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = serializer.save()

    (access_token, refresh_token) = generate_tokens_for_user(user)

    body = {
      "user": UserSerializer(user, context=self.get_serializer_context()).data,
    }

    headers = {
      "x-access-token": str(access_token),
    }

    response = Response(body, headers=headers, status=status.HTTP_201_CREATED)
    set_refresh_token_cookie(response, refresh_token)

    return response


class MeAPIView(GenericAPIView):
  serializer_class = UserSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get(self, request):
    user = request.user
    data = self.get_serializer(user).data
    return Response({"user": data})
