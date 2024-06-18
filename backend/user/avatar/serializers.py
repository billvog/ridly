from django.conf import settings

from rest_framework import serializers

BUCKET_NAME = settings.GS_BUCKET_NAME


class UserAvatarSerializer(serializers.Field):
  """
  Serializer that creates a signed URL for user's avatar,
  so the client can directly access the image.
  """

  def to_representation(self, value):
    return value
