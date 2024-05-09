"""
ASGI config for ridl_api project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

from django.core.asgi import get_asgi_application

import hunt.routing
from user.authentication import JWTWebSocketAuthentication

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ridl_api.settings")

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
  {
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
      JWTWebSocketAuthentication(URLRouter(hunt.routing.ws_urlpatterns)),
    ),
  }
)
