from django.urls import path

from . import views

urlpatterns = [
  path("<uuid:pk>/", views.RetrieveHuntAPIView.as_view()),
  path("<uuid:pk>/clue/<int:clue_order>/", views.RetrieveHuntClueAPIView.as_view()),
]
