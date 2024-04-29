from django.urls import path
from . import views

urlpatterns = [
  path("", view=views.ListEventsAPIVIew.as_view()),
  path("<uuid:pk>/", view=views.RetrieveEventAPIView.as_view()),
  path("<uuid:pk>/join/", view=views.JoinEventAPIView.as_view()),
]
