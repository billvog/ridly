import requests
from google.cloud import storage
from django.conf import settings


def download_and_upload_avatar(oauth_avatar, gcs_file_name):
  """
  Downloads avatar from OAuth provider and uploads it to a GS bucket.
  """

  # Function to download the image
  def download_image(url):
    response = requests.get(url, stream=True)
    if response.status_code == 200:
      response.raw.decode_content = True
      return response.raw
    else:
      raise Exception(f"Error downloading image: {response.status_code}")

  # Function to upload to Google Cloud Storage
  def upload_to_gcs(file_stream, bucket_name, gcs_file_name):
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(gcs_file_name)
    blob.upload_from_file(file_stream)

  # Download the image
  file_stream = download_image(oauth_avatar)

  # Upload the image to GCS
  upload_to_gcs(file_stream, settings.GS_BUCKET_NAME, gcs_file_name)


def update_avatar_from_oauth(user, oauth_avatar, should_save=True):
  """
  Updates user's avatar from OAuth provided avatar URL.
  """

  avatar_path = f"user/avatar/{user.id}"
  download_and_upload_avatar(oauth_avatar, avatar_path)
  user.avatar_url = avatar_path
  if should_save:
    user.save()
