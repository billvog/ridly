from django.apps import AppConfig


class HuntConfig(AppConfig):
  default_auto_field = "django.db.models.BigAutoField"
  name = "hunt"

  def ready(self):
    from . import signals  # noqa: F401
