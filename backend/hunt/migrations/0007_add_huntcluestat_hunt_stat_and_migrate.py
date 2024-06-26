# Generated by Django 5.0.4 on 2024-06-08 18:02

import django.db.models.deletion
from django.db import migrations, models

DEFAULT = 1


def forwards(apps, _):
  HuntStat = apps.get_model("hunt", "HuntStat")
  HuntClueStat = apps.get_model("hunt", "HuntClueStat")

  for clue_stat in HuntClueStat.objects.all():
    clue_stat.hunt_stat = HuntStat.objects.get_or_create(
      user=clue_stat.user, hunt=clue_stat.clue.hunt
    )[0]
    clue_stat.save()


def backwards(apps, _):
  HuntClueStat = apps.get_model("hunt", "HuntClueStat")

  for clue_stat in HuntClueStat.objects.all():
    clue_stat.user = clue_stat.hunt_stat.user
    clue_stat.clue = clue_stat.hunt_stat.clue
    clue_stat.save()


class Migration(migrations.Migration):
  dependencies = [
    ("hunt", "0006_alter_hunt_event_huntstat"),
  ]

  operations = [
    migrations.AddField(
      model_name="huntcluestat",
      name="hunt_stat",
      field=models.ForeignKey(
        default=DEFAULT,
        on_delete=django.db.models.deletion.CASCADE,
        related_name="clue_stats",
        to="hunt.huntstat",
      ),
      preserve_default=False,
    ),
    migrations.RunPython(forwards, backwards),
    migrations.RemoveField(model_name="huntcluestat", name="user"),
  ]
