from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.deletion import CASCADE


class User(AbstractUser):
    pass


class MovieDB(models.Model):
    imdb_id = models.CharField(max_length=18, helpt_text="ID of title on IMDb site", blank=False, unique=True, editable=False)

    TYPES = (
        ('m', 'movie'),
        ('s', 'show')
    )

    type = models.CharField(max_length=1, choices=TYPES, help_text="Movie or TV show", blank=False)
    title = models.CharField(max_length=256, help_text="Movie / TV Show title", blank=False)
    year = models.CharField(max_length=4, help_text="Release year", blank=False)
    image = models.URLField(max_length=1024, help_text='URL for poster from IMDb', blank=False)
    details = models.CharField(max_length=512, help_text="Additional details about director, cast, etc.")


class userActions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    movie_id = models.ForeignKey(MovieDB, on_delete=models.CASCADE, blank=False)
    watchlist = models.BooleanField(default=False)
    watched = models.BooleanField(default=False)
    RATINGS = [None, 1, 2, 3, 4, 5]
    rating = models.IntegerField(max_length=1, choices=RATINGS, help_text="Rate a movie / show from 1 to 5", default=None)
