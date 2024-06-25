from django.urls import path

from . import views


urlpatterns = [
  path("<uuid:pk>/", view=views.UserProfileAPIView.as_view()),
  path("edit/", view=views.UpdateUserProfileAPIView.as_view()),
]
