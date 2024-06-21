from django.urls import path

from . import views


urlpatterns = [path("<uuid:pk>/", view=views.UserProfileAPIView.as_view())]
