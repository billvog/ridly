# Generated by Django 5.0.4 on 2024-06-08 17:58

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0003_rename_location_event_location_name_and_more'),
        ('hunt', '0005_rename_treasurehunt_hunt_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='hunt',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hunt', to='event.event'),
        ),
        migrations.CreateModel(
            name='HuntStat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('completed', models.BooleanField(default=False)),
                ('completed_at', models.DateTimeField(null=True)),
                ('shadow_banned', models.BooleanField(default=False)),
                ('shadow_banned_at', models.DateTimeField(null=True)),
                ('hunt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hunt_stats', to='hunt.hunt')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]