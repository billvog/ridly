# Generated by Django 5.0.4 on 2024-06-25 18:14

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
  dependencies = [
    ("event", "0003_rename_location_event_location_name_and_more"),
    migrations.swappable_dependency(settings.AUTH_USER_MODEL),
  ]

  operations = [
    migrations.AlterField(
      model_name="event",
      name="participants",
      field=models.ManyToManyField(
        blank=True, related_name="joined_events", to=settings.AUTH_USER_MODEL
      ),
    ),
  ]