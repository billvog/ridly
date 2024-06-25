from rest_framework import serializers

from user.profile.models import UserProfile


class FollowUserSerializer(serializers.ModelSerializer):
  follow_status = serializers.BooleanField()

  class Meta:
    model = UserProfile
    fields = ["follower_count", "following_count", "follow_status"]
