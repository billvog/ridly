from django.urls import path
from . import views

urlpatterns = [
  path("logout/", view=views.LogoutAPIView.as_view()),
  path("me/", view=views.MeAPIView.as_view()),
]
