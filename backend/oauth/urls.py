from django.urls import path
from . import views

urlpatterns = [
  path("<str:provider_id>/redirect/", view=views.RedirectToOAuthProviderView.as_view()),
  path("<str:provider_id>/callback/", view=views.OAuthProviderCallbackView.as_view()),
]
