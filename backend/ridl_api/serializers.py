from rest_framework import serializers


# Serializer for django.contrib.gis.geos.Point
class PointSerializer(serializers.Field):
  def to_representation(self, value):
    return {"long": value.coords[0], "lat": value.coords[1]}
