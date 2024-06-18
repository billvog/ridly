import imgix

from django.conf import settings
from django.contrib.gis.geos import Point

from rest_framework import serializers


class PointSerializer(serializers.Serializer):
  """
  Serializer for django.contrib.gis.geos.Point
  """

  def to_internal_value(self, data):
    try:
      lat = data.get("lat")
      long = data.get("long")
      return Point(long, lat)
    except (TypeError, ValueError, AttributeError):
      raise serializers.ValidationError("Invalid Point format.")

  long = serializers.FloatField(source="x")
  lat = serializers.FloatField(source="y")


class DetailedErrorSerializer(serializers.Serializer):
  detail = serializers.CharField(required=False)


class ValidationErrorSerializer(serializers.Serializer):
  errors = serializers.DictField(
    child=serializers.ListSerializer(child=serializers.CharField())
  )


class ImageSerializer(serializers.Field):
  """
  Serializer that creates an Imgix URL for an image, with optional parameters.
  """

  builder = imgix.UrlBuilder(
    domain=settings.IMGIX_SOURCE, use_https=True, include_library_param=False
  )

  def __init__(self, *args, **kwargs):
    self.params = kwargs.pop("params", None)
    super().__init__(*args, **kwargs)

  def to_representation(self, value):
    return ImageSerializer.builder.create_url(value, self.params)
