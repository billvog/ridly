# Generated by Django 5.0.4 on 2024-04-26 12:24

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
  initial = True

  dependencies = [
    ("creator", "0001_initial"),
    migrations.swappable_dependency(settings.AUTH_USER_MODEL),
  ]

  operations = [
    migrations.CreateModel(
      name="Event",
      fields=[
        (
          "id",
          models.UUIDField(
            default=uuid.uuid4, editable=False, primary_key=True, serialize=False
          ),
        ),
        ("name", models.CharField(max_length=50)),
        ("description", models.TextField()),
        ("participant_count", models.PositiveIntegerField(default=0)),
        ("happening_at", models.DateTimeField()),
        ("created_at", models.DateTimeField(auto_now_add=True)),
        ("updated_at", models.DateTimeField(auto_now=True)),
        (
          "creator",
          models.ForeignKey(
            on_delete=django.db.models.deletion.CASCADE,
            to="creator.creator",
            related_name="created_events",
          ),
        ),
        (
          "participants",
          models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
      ],
    ),
  ]
