from django.urls import path
from . import views

urlpatterns = [
  path("<str:provider>/login/", view=views.OAuthLoginAPIView.as_view()),
]
