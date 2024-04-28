from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = [
      "id",
      "first_name",
      "last_name",
      "username",
      "email",
      "avatar_url",
      "created_at",
    ]


class PublicUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = [
      "id",
      "first_name",
      "last_name",
      "username",
      "avatar_url",
    ]
