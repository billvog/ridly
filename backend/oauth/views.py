from django import forms
from django.conf import settings
from django.http import JsonResponse
from django.views import View
from django.shortcuts import redirect

from python_socialite.python_socialite import OAuthProvider
from python_socialite.exceptions import BadVerification

# Load python-socialite config from settings.py
SocialiteConfig = settings.SOCIALITE_OAUTH_PROVIDERS


class RedirectToOAuthProviderView(View):
  def get(self, request, provider_id):
    provider = OAuthProvider(provider_id, SocialiteConfig)
    redirect_url = provider.get_auth_url()

    return redirect(redirect_url)


class OAuthProviderCallbackView(View):
  class InputValidationForm(forms.Form):
    code = forms.CharField(required=True)
    error = forms.CharField(required=False, empty_value=None)

  def get(self, request, provider_id):
    input_form = self.InputValidationForm(data=request.GET)

    if not input_form.is_valid():
      return JsonResponse({"ok": False}, status=500)

    code, error = input_form.cleaned_data.values()

    if error is not None:
      return JsonResponse({"error": error}, status=400)

    provider = OAuthProvider(provider_id, SocialiteConfig)

    try:
      token = provider.get_token(code)
      user = provider.get_user(token["access_token"])

      # do things with user
      print(user)

    except BadVerification:
      return JsonResponse({"ok": False, "error": "Invalid code given."}, status=500)

    return JsonResponse({"ok": True}, status=200)
