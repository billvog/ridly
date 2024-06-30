from django.urls import path, include

from . import views


urlpatterns = [
  path("<uuid:pk>/", view=views.UserProfileAPIView.as_view()),
  path("<uuid:pk>/follow/", include("user.profile.follow.urls")),
  path("edit/", view=views.UpdateUserProfileAPIView.as_view()),
]
