from django.urls import path
from . import views

urlpatterns = [
  path("google/login/", view=views.OAuthLoginAPIView.as_view()),
]
