from rest_framework.exceptions import APIException


class UnsupportedOAuthProvider(APIException):
  """
  Raised when the OAuth provider is not supported.
  """

  status_code = 400
  default_detail = "Unsupported OAuth provider"
  default_code = "unsupported_oauth_provider"


class BadOAuthToken(APIException):
  """
  Raised when the OAuth token is invalid.
  """

  status_code = 400
  default_detail = "Bad OAuth token"
  default_code = "bad_oauth_token"
