from django.urls import path
from . import views

urlpatterns = [
  path("upcoming/", view=views.ListUpcomingEventsAPIVIew.as_view()),
  path("joined/", view=views.ListJoinedEventsAPIView.as_view()),
  path("<uuid:pk>/", view=views.RetrieveEventAPIView.as_view()),
  path("<uuid:pk>/join/", view=views.JoinEventAPIView.as_view()),
]
