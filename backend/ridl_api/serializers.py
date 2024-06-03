from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field


# Serializer for django.contrib.gis.geos.Point
@extend_schema_field(
  field={
    "type": "object",
    "additionalProperties": {
      "long": "number",
      "lat": "number",
    }
  },
)
class PointSerializer(serializers.Field):
  def to_representation(self, value):
    return {"long": value.coords[0], "lat": value.coords[1]}
