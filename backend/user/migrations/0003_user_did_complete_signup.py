# Generated by Django 5.0.4 on 2024-06-11 16:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_user_avatar_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='did_complete_signup',
            field=models.BooleanField(default=False),
        ),
    ]