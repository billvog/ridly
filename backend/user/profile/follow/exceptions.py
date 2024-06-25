from rest_framework.exceptions import APIException


class CannotFollowYourselfException(APIException):
  status_code = 400
  default_detail = "You cannot follow yourself"
  default_code = "cannot_follow_yourself"
