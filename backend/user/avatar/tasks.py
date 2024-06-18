import uuid
from celery import shared_task

from user.models import User
from user.avatar.helpers import download_and_upload_avatar


@shared_task
def update_avatar_from_oauth(user_pk: uuid.UUID, oauth_avatar: str):
  """
  Updates user's avatar from OAuth provided avatar URL.
  """

  # Find user by pk
  user = None
  try:
    user = User.objects.get(id=user_pk)
  except User.DoesNotExist:
    print(f"User with id {user_pk} does not exist.")
    return

  # Get avatar path
  avatar_path = user.avatar_url

  # Download from OAuth and upload to bucket
  try:
    download_and_upload_avatar(oauth_avatar, avatar_path)
  except Exception as e:
    print(f"Error updating avatar for user {user.id}: {e}")
    return
