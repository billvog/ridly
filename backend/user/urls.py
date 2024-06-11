from django.urls import path
from django.conf import settings

from . import views

urlpatterns = [
  path("logout/", view=views.LogoutAPIView.as_view()),
  path("me/", view=views.MeAPIView.as_view()),
  path("complete-signup/", view=views.CompleteSignupAPIView.as_view()),
]

# Only for testing!!!
if settings.DEBUG:
  urlpatterns += [path("test-token/", view=views.TestAuthTokenAPIView.as_view())]
