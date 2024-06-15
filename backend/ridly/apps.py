from django.apps import AppConfig


class MyMainAppNameConfig(AppConfig):
  name = "ridly"

  def ready(self):
    import ridly.schema  # noqa: F401
