from drf_spectacular.extensions import OpenApiAuthenticationExtension


class JWTAuthenticationScheme(OpenApiAuthenticationExtension):
  target_class = "user.authentication.JWTAuthentication"
  name = "JWTAuthentication"

  def get_security_definition(self, _):
    return {
      "type": "apiKey",
      "in": "header",
      "name": "x-access-token",
    }
