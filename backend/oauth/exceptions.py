from rest_framework.exceptions import APIException


class BadOAuthToken(APIException):
  """
  Raised when the OAuth token is invalid.
  """

  status_code = 400
  default_detail = "Bad OAuth token"
  default_code = "bad_oauth_token"
