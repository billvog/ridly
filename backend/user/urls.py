from django.urls import path, include
from django.conf import settings

from . import views

urlpatterns = [
  path("me/", view=views.MeAPIView.as_view()),
  path("complete-signup/", view=views.CompleteSignupAPIView.as_view()),
  path("update/location/", view=views.UpdateLastKnownLocationAPIView.as_view()),
  path("profile/", include("user.profile.urls")),
]

# Only for testing!!!
if settings.DEBUG:
  urlpatterns += [path("test-token/", view=views.TestAuthTokenAPIView.as_view())]
