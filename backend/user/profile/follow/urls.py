from django.urls import path

from . import views


urlpatterns = [path("", view=views.FollowUserAPIView.as_view())]
