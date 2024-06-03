from django.apps import AppConfig


class MyMainAppNameConfig(AppConfig):
  name = "ridl_api"

  def ready(self):
    import ridl_api.schema  # noqa: F401
