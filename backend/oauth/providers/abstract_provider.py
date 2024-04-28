class AbstractOAuthProvider:
  def get_user(self, access_token):
    pass

  def map_response_to_user(self, response):
    pass
