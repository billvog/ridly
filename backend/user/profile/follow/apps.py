from django.apps import AppConfig


class FollowConfig(AppConfig):
  name = "user.profile.follow"

  def ready(self):
    import user.profile.follow.signals  # noqa: F401
