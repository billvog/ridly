from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
  token = serializers.CharField(required=True)
