from rest_framework import serializers

from .models import Creator
from user.serializers import PublicUserSerializer


class CreatorSerializer(serializers.ModelSerializer):
  user = PublicUserSerializer()

  class Meta:
    model = Creator
    fields = ["id", "user"]
