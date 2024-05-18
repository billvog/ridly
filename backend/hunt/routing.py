from django.urls import path

from . import consumers

ws_urlpatterns = [path("ws/hunt/<str:hunt_pk>/", consumers.HuntConsumer.as_asgi())]
