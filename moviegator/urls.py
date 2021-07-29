from django.urls import path

from . import views
from moviegator.views import *

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile", views.profile_view, name="profile"),
    path('ratings', views.ratings_view, name="ratings"),
]
