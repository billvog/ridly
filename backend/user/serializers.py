from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from ridly.serializers import PointSerializer

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
      "did_complete_signup",
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


class CompleteSignupSerializer(serializers.ModelSerializer):
  username = serializers.CharField(
    allow_blank=False,
    max_length=50,
    validators=[
      UniqueValidator(queryset=User.objects.all(), message="Username already exists.")
    ],
  )

  did_complete_signup = serializers.BooleanField(read_only=True)

  class Meta:
    model = User
    fields = ["username", "did_complete_signup"]


class UpdateLastKnownLocationSerializer(serializers.ModelSerializer):
  last_known_location = PointSerializer()

  class Meta:
    model = User
    fields = ["last_known_location"]
