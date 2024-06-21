from rest_framework.generics import RetrieveAPIView

from user.models import User
from user.profile.serializers import UserWithProfileSerializer


class UserProfileAPIView(RetrieveAPIView):
  serializer_class = UserWithProfileSerializer
  queryset = User.objects.filter(is_active=True)
