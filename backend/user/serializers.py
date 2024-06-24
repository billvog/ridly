from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from ridly.serializers import PointSerializer, ImageSerializer
from user.models import User
from user.profile.serializers.common import UserProfileSerializer


class PublicUserSerializer(serializers.ModelSerializer):
  """
  User serializer that is available to the public.
  """

  avatar_url = ImageSerializer(params={"w": 500, "h": 500})
  profile = UserProfileSerializer()

  class Meta:
    model = User
    fields = [
      "id",
      "first_name",
      "last_name",
      "username",
      "is_creator",
      "avatar_url",
      "profile",
    ]


class UserSerializer(PublicUserSerializer):
  """
  Inherits `PublicUserSerializer` and adds fields that are only available to the user themselves.
  """

  class Meta(PublicUserSerializer.Meta):
    fields = PublicUserSerializer.Meta.fields + [
      "email",
      "did_complete_signup",
      "created_at",
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
