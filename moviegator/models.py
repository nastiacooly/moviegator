from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.deletion import CASCADE


class User(AbstractUser):
    pass


class MovieDB(models.Model):
    imdb_id = models.CharField(max_length=18, help_text="ID of title on IMDb site", blank=False, unique=True, editable=False)

    TYPES = (
        ('m', 'movie'),
        ('s', 'show')
    )

    type = models.CharField(max_length=1, choices=TYPES, help_text="Movie or TV show", blank=False)
    title = models.CharField(max_length=256, help_text="Movie / TV Show title", blank=False)
    year = models.CharField(max_length=4, help_text="Release year", blank=False)
    image = models.URLField(max_length=1024, help_text='URL for poster from IMDb', blank=False)
    details = models.CharField(max_length=512, help_text="Additional details about director, cast, etc.")

    def serialize(self, rating):
        return {
            "id": self.pk,
            "imdb_id": self.imdb_id,
            "type": self.type,
            "title": self.title,
            "year": self.year,
            "image": self.image,
            "details": self.details,
            "rating": rating
        }

class UserActions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    movie = models.ForeignKey(MovieDB, on_delete=models.CASCADE, blank=False, related_name="movie_actions")
    watchlist = models.BooleanField(default=False)
    watched = models.BooleanField(default=False)
    RATINGS = (
        ('0', 'not rated'),
        ('1', '1-star'),
        ('2', '2-star'),
        ('3', '3-star'),
        ('4', '4-star'),
        ('5', '5-star')
    )
    rating = models.CharField(max_length=1, choices=RATINGS, help_text="Rate a movie / show from 1 to 5", default='0')
