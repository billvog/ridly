from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field


# Serializer for django.contrib.gis.geos.Point
@extend_schema_field(
  field={
    "type": "object",
    "properties": {
      "long": {
        "type": "number",
        "format": "float",
      },
      "lat": {
        "type": "number",
        "format": "float",
      },
    },
  },
)
class PointSerializer(serializers.Field):
  def to_representation(self, value):
    return {"long": value.coords[0], "lat": value.coords[1]}


class DetailedErrorResponse(serializers.Serializer):
  detail = serializers.CharField()
