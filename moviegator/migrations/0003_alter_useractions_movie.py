# Generated by Django 3.2 on 2021-09-02 12:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('moviegator', '0002_moviedb_useractions'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useractions',
            name='movie',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movie_actions', to='moviegator.moviedb'),
        ),
    ]