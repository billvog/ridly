from django.test import TestCase
from django.conf import settings


class TestEnvironmentVariables(TestCase):
  def test_secret_key(self):
    # Get secret key and ensure it's there.
    secret_key = str(settings.SECRET_KEY)
    self.assertIsNotNone(
      secret_key, "Missing DJANGO_SECRET_KEY from environment variables."
    )

    # Ensure secret key is strong.
    if not settings.DEBUG:
      self.assertFalse(
        secret_key.startswith("django-insecure-"), "SECRET_KEY is insecure."
      )

      self.assertTrue(
        len(secret_key) > 50, "SECRET_KEY is too short. Must be at least 50 characters."
      )

  def test_jwt_secrets(self):
    # Get access token secret and ensure it's there.
    access_token_secret = str(settings.JWT_ACCESS_TOKEN_SECRET)
    self.assertIsNotNone(
      access_token_secret, "Missing JWT_ACCESS_TOKEN_SECRET from environment variables."
    )

    # Get refresh token secret and ensure it's there.
    refresh_token_secret = str(settings.JWT_REFRESH_TOKEN_SECRET)
    self.assertIsNotNone(
      refresh_token_secret,
      "Missing JWT_REFRESH_TOKEN_SECRET from environment variables.",
    )

    # Ensure JWT secrets are strong.
    if not settings.DEBUG:
      self.assertTrue(
        len(access_token_secret) > 50,
        "JWT Access Token Secret is too short. Must be at least 50 characters.",
      )

      self.assertTrue(
        len(refresh_token_secret) > 50,
        "JWT Refresh Token Secret is too short. Must be at least 50 characters.",
      )
