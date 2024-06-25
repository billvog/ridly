from rest_framework import serializers

from user.profile.models import UserProfile


class FollowUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserProfile
    fields = ["follower_count", "following_count"]
