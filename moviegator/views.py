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
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views import generic
from django.db.models import Count
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.db.models import Exists, OuterRef
from requests import status_codes

from .models import User, MovieDB, UserActions

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


@ensure_csrf_cookie
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


def profile_view(request):
    """
    Renders profile page of signed in user
    or suggests anonymous user to log in or register
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
        # API calls depending on user's choice
        if parameter == "top-movies":
            r = requests.get(API_URL+top250_movies+API_KEY)

        if parameter == "top-shows":
            r = requests.get(API_URL+top250_shows+API_KEY)

        if parameter == "trend":
            r = requests.get(API_URL+in_theatres+API_KEY)

        # Request to API was successful
        if r.status_code == 200:
            result = r.json()
            random_choice = random.choice(result["items"])
            processed = set()

            if request.user.is_authenticated:
                # Ensure that user hasn't already interacted with this movie/show
                watchlist = UserActions.objects.filter(user=request.user, watchlist=True).values_list('movie__imdb_id', flat=True)
                watched_list = UserActions.objects.filter(user=request.user, watched=True).values_list('movie__imdb_id', flat=True)
                # While random movie/show is known to user...
                while random_choice["id"] in watchlist or random_choice["id"] in watched_list:
                    # ...remember that this random item was processed...
                    processed.add(random_choice["id"])
                    # ...if all items was already processed, return error and end loop...
                    if len(result["items"]) == len(processed):
                        return JsonResponse({"empty": "Sorry, we have no more recommendations in this category which you haven't already added to your watchlist or marked as watched. Please start over."})
                    # ...else, try another random
                    random_choice = random.choice(result["items"])
            
            return JsonResponse(random_choice)
        
        # Request to API failed
        else:
            return JsonResponse({"error": "Sorry, something went wrong. Please, try again."})
    # Show error, if page was not requested by AJAX
    else:
        return HttpResponseNotFound('<h1>Page not found</h1>')


def get_data_by_genre(request, type, genre):
    # Ensure request is made by Javascript (fetch)
    if request.is_ajax():
        # API calls depending on user's choice
        if type == "movie":
            r = requests.get(API_URL+list_by_genre+API_KEY+'/'+movies_lists_ids[genre])

        if type == "show":
            r = requests.get(API_URL+list_by_genre+API_KEY+'/'+shows_lists_ids[genre])

        # Request to API was successful
        if r.status_code == 200:
            result = r.json()
            random_choice = random.choice(result["items"])
            processed = set()

            if request.user.is_authenticated:
                # Ensure that user hasn't already interacted with this movie/show
                watchlist = UserActions.objects.filter(user=request.user, watchlist=True).values_list('movie__imdb_id', flat=True)
                watched_list = UserActions.objects.filter(user=request.user, watched=True).values_list('movie__imdb_id', flat=True)
                # While random movie/show is known to user...
                while random_choice["id"] in watchlist or random_choice["id"] in watched_list:
                    # ...remember that this item was processed
                    processed.add(random_choice["id"])
                    # ...if all items was already processed, return error and end loop...
                    if len(result["items"]) == len(processed):
                        return JsonResponse({"empty": "Sorry, we have no more recommendations in this category which you haven't already added to your watchlist or marked as watched. Please start over."})
                    # ...else, try another random
                    random_choice = random.choice(result["items"])
            
            return JsonResponse(random_choice)

        # Request to API failed
        else:
            return JsonResponse({"error": "Sorry, something went wrong. Please, try again."})
    # Show error, if page was not requested by AJAX
    else:
        return HttpResponseNotFound('<h1>Page not found</h1>')


def add_to_watchlist(request):
    # In case user is anonymous
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Sorry, you should log in first'})

    # Ensure POST-request is made by Javascript (fetch) and user is logged in
    if request.method == "POST" and request.is_ajax() and request.user.is_authenticated:
        # Getting JSON data
        data = json.loads(request.body)
        # Add movie/show details to MovieDB of this app or get movie (if already in MovieDB)
        try:
            imdb_id = data['imdb_id']
            type = data['type']
            title = data['title']
            year = data['year']
            image = data['image']
            details = data['details']

            movie = MovieDB(
                imdb_id=imdb_id,
                type=type,
                title=title,
                year=year,
                image=image,
                details=details
            )

            movie.save()

        except IntegrityError:
            movie = MovieDB.objects.get(imdb_id=data['imdb_id'])

        # Adding to watchlist
        obj, created = UserActions.objects.update_or_create(
            user=request.user, 
            movie=movie,
            defaults={'watchlist': True, 'watched': False},
        )
        if obj:
            return JsonResponse({'message': 'Successfully added to your watchlist'})
        else:
            return JsonResponse({'error': 'Sorry, something went wrong'})
    
    # In case request was GET or not AJAX
    else:
        return HttpResponseNotFound('<h1>Page not found</h1>')


@login_required
def get_watchlist(request):
    # Ensure request is AJAX
    if request.is_ajax():
        watchlist_to_render = []
        try:
            watchlist = UserActions.objects.filter(user=request.user, watchlist=True)
            for obj in watchlist:
                item = obj.movie
                watchlist_to_render.append(item.serialize())

            if len(watchlist_to_render) > 0:
                return JsonResponse(watchlist_to_render, safe=False)
            else: 
                return JsonResponse({'empty': 'Watchlist is empty'})

        except UserActions.DoesNotExist:
            return JsonResponse({'empty': 'Watchlist is empty'})


@login_required
def remove_from_watchlist(request):
    # Ensure POST-request is made by Javascript (fetch)
    if request.method == "POST" and request.is_ajax():
        # Getting JSON data
        data = json.loads(request.body)
        imdb_id = data['imdb_id']
        # Get movie from MovieDB
        try:
            movie = MovieDB.objects.get(imdb_id=imdb_id)
        except MovieDB.DoesNotExist:
            return JsonResponse({'error': 'This title was not found'})

        # Removing from watchlist
        movie_actions = movie.movie_actions
        try:
            movie_actions.watchlist = False
            movie_actions.save(update_fields=['watchlist'])
            return JsonResponse({'message': 'Removed from your watchlist'})
        except IntegrityError:
            return JsonResponse({'error': 'Sorry, something went wrong'})
    
    # In case request was GET or not AJAX
    else:
        return HttpResponseNotFound('<h1>Page not found</h1>')


@login_required
def get_watched(request):
    # Ensure request is AJAX
    if request.is_ajax():
        watched_to_render = []
        try:
            watched = UserActions.objects.filter(user=request.user, watched=True)
            for obj in watched:
                item = obj.movie
                watched_to_render.append(item.serialize())

            if len(watched_to_render) > 0:
                return JsonResponse(watched_to_render, safe=False)
            else:
                return JsonResponse({'empty': 'List of watched is empty'})
        
        except UserActions.DoesNotExist:
            return JsonResponse({'empty': 'List of watched is empty'})


def mark_as_watched(request):
    # In case user is anonymous
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Sorry, you should log in first'})

    # Ensure POST-request is made by Javascript (fetch) and user is logged in
    if request.method == "POST" and request.is_ajax() and request.user.is_authenticated:
        # Getting JSON data
        data = json.loads(request.body)
        # Add movie/show details to MovieDB of this app or get movie (if already in MovieDB)
        try:
            imdb_id = data['imdb_id']
            type = data['type']
            title = data['title']
            year = data['year']
            image = data['image']
            details = data['details']

            movie = MovieDB(
                imdb_id=imdb_id,
                type=type,
                title=title,
                year=year,
                image=image,
                details=details
            )

            movie.save()

        except IntegrityError:
            movie = MovieDB.objects.get(imdb_id=data['imdb_id'])

        # Mark as watched
        obj, created = UserActions.objects.update_or_create(
            user=request.user, 
            movie=movie,
            defaults={'watchlist': False, 'watched': True},
        )
        if obj:
            return JsonResponse({'message': 'Successfully marked as watched'})
        else:
            return JsonResponse({'error': 'Sorry, something went wrong'})
    
    # In case request was GET or not AJAX
    else:
        return HttpResponseNotFound('<h1>Page not found</h1>')


@login_required
def mark_as_not_watched(request):
    # Ensure POST-request is made by Javascript (fetch)
    if request.method == "POST" and request.is_ajax():
        # Getting JSON data
        data = json.loads(request.body)
        imdb_id = data['imdb_id']
        # Get movie from MovieDB
        try:
            movie = MovieDB.objects.get(imdb_id=imdb_id)
        except MovieDB.DoesNotExist:
            return JsonResponse({'error': 'This title was not found'})

        # Mark as not watched
        movie_actions = movie.movie_actions
        try:
            movie_actions.watched = False
            movie_actions.rating = '0'
            movie_actions.save(update_fields=['watched', 'rating'])
            return JsonResponse({'message': 'Marked as not watched'})
        except IntegrityError:
            return JsonResponse({'error': 'Sorry, something went wrong'})
    
    # In case request was GET or not AJAX
    else:
        return HttpResponseNotFound('<h1>Page not found</h1>')

