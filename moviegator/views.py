import json
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

from .models import User


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
    """
    user = request.user
    return render(
        request, 
        "moviegator/profile.html",
        context={
            user: "user"
        })


def ratings_view(request):
    """
    Renders page with movies/shows rated by all users of the app
    """
    return render(request, "moviegator/ratings.html")
