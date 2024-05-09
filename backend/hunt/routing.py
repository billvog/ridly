from django.urls import re_path

from . import consumers

ws_urlpatterns = [
  re_path(r"ws/hunt/(?P<hunt_pk>[A-Za-z0-9_-]+)/$", consumers.HuntConsumer.as_asgi())
]
