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
    path('get_data/<parameter>', views.get_data),
    path('get_data/<type>/<genre>', views.get_data_by_genre),
    path('add_to_watchlist', views.add_to_watchlist),
    path('get_watchlist', views.get_watchlist),
    path('remove_from_watchlist', views.remove_from_watchlist),
]
