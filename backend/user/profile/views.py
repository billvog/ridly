from rest_framework.generics import RetrieveAPIView

from user.models import User
from user.profile.serializers import UserProfileSerializer


class UserProfileAPIView(RetrieveAPIView):
  serializer_class = UserProfileSerializer
  queryset = User.objects.filter(is_active=True)
