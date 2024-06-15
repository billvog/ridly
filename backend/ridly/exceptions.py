from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError


def custom_exception_handler(exc, context):
  response = exception_handler(exc, context)

  """
  If the exception is a ValidationError, we want to wrap all the errors in a
  single key "errors," so we can serialize it better, and have better synergy
  with spectacular, to generate better schema
  """
  if isinstance(exc, ValidationError) and response is not None:
    response.data = {"errors": exc.detail}

  return response
