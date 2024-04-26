from django.urls import path
from . import views

urlpatterns = [
  path("login/", view=views.LoginAPIView.as_view()),
  path("register/", view=views.RegisterAPIView.as_view()),
  path("logout/", view=views.LogoutAPIView.as_view()),
  path("me/", view=views.MeAPIView.as_view()),
]