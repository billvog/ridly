from django.conf import settings
from django.utils import timezone

from rest_framework import serializers
from google.cloud import storage

BUCKET_NAME = settings.GS_BUCKET_NAME


class UserAvatarSerializer(serializers.Field):
  """
  Serializer that creates a signed URL for user's avatar,
  so the client can directly access the image.
  """

  def to_representation(self, value):
    # If no avatar is set, return None
    if value is None or value == "":
      return None

    # Get our bucket
    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)

    # Find the blob, if not found return None
    blob = bucket.get_blob(value)
    if blob is None:
      return None

    # Expire URL 1 hour from now
    expiration = timezone.now() + timezone.timedelta(hours=1)

    # Create signed URL and return
    return blob.generate_signed_url(expiration=expiration)
