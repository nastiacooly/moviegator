import json
from django import urls
import requests
import random
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseNotFound
from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views import generic
from django.db.models import Count
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.db.models import Exists, OuterRef
from requests import status_codes

from .models import User

# For importing env variables
import os
from dotenv import load_dotenv
load_dotenv()

# Make sure API key is set
if not os.getenv("API_KEY"):
    raise RuntimeError("API_KEY not set")
else:
    API_KEY = os.getenv('API_KEY')


# For Third-party API calls
# IMDB Lists IDs
movies_lists_ids = {
    'drama': 'ls046058631', # The 250 Best Drama Movies of All Time
    'comedy': 'ls058726648', # Best comedy movies
    'romance': 'ls072723203', # Best Rated Romance movies
    'fantasy': 'ls009669258', # 100 Best Fantasy Movies
    'horror': 'ls026579006', # TOP HORROR MOVIES: 2000-2021
    'thriller': 'ls062989641', # Thrilles Movies: The Essential List
    'action': 'ls058416162', # Action Movies: The Essential List
    'mystery': 'ls009668531', # 100 Best Mystery Movies
    'western': 'ls002124326' # 100 Greatest Western Movies of All Time
}

shows_lists_ids = {
    'drama': 'ls063328951', # Top Drama TV Shows
    'comedy': 'ls059567201', # Top 100 Comedy TV Shows
    'romance': 'ls059567201', # The Most Romantic TV Shows
    'fantasy': 'ls036421812', # Best Fantasy TV Shows
    'horror': 'ls023806050', # Horror TV Shows
    'thriller': 'ls026958827', # Thriller TV Series
    'action': 'ls054323220', # Best Action TV Shows
    'mystery': 'ls020396926', # The Best Murder Mystery Thriller & Crime TV Shows
    'western': 'ls027044488' # 50 Western TV series shows
}

# API urls
API_URL = 'https://imdb-api.com/en/API/'
top250_movies = 'Top250Movies/'
top250_shows = 'Top250TVs/'
list_by_genre = 'IMDbList/'
in_theatres = 'InTheaters/'
title_details = 'Title/'


def index(request):
    return render(request, "moviegator/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "moviegator/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "moviegator/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "moviegator/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "moviegator/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "moviegator/register.html")


@login_required
def profile_view(request):
    """
    Renders profile page of signed in user
    """
    user = request.user
    return render(
        request, 
        "moviegator/profile.html",
        context={
            user: "user"
        })


@login_required
def ratings_view(request):
    """
    Renders page with movies/shows rated by all users of the app
    """
    return render(request, "moviegator/ratings.html")


def get_data(request, parameter):
    # Ensure request is made by Javascript (fetch)
    if request.is_ajax():
        if parameter == "top-movies":
            r = requests.get(API_URL+top250_movies+API_KEY)

        if parameter == "top-shows":
            r = requests.get(API_URL+top250_shows+API_KEY)

        if parameter == "trend":
            r = requests.get(API_URL+in_theatres+API_KEY)

        if r.status_code == 200:
            result = r.json()
            random_choice = random.choice(result["items"])
            return JsonResponse(random_choice)
        else:
            return JsonResponse({"message": "Sorry, something went wrong. Please, try again."})
    else:
        return HttpResponseNotFound('<h1>Page not found</h1>')


def get_data_by_genre(request, type, genre):
    # Ensure request is made by Javascript (fetch)
    if request.is_ajax():
        if type == "movie":
            r = requests.get(API_URL+list_by_genre+API_KEY+'/'+movies_lists_ids[genre])

        if type == "show":
            r = requests.get(API_URL+list_by_genre+API_KEY+'/'+shows_lists_ids[genre])

        if r.status_code == 200:
            result = r.json()
            random_choice = random.choice(result["items"])
            return JsonResponse(random_choice)
        else:
            return JsonResponse({"message": "Sorry, something went wrong. Please, try again."})
    else:
        return HttpResponseNotFound('<h1>Page not found</h1>')
