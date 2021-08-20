from django.urls import path

from . import views
from moviegator.views import *

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile", views.profile_view, name="profile"),
    path('trailers', views.trailers_view, name="trailers"),
    path('get_data/<parameter>', views.get_data),
    path('get_data/<type>/<genre>', views.get_data_by_genre),
    path('add_to_watchlist', views.add_to_watchlist),
    path('get_watchlist/<page_number>', views.get_watchlist),
    path('remove_from_watchlist', views.remove_from_watchlist),
    path('mark_as_watched', views.mark_as_watched),
    path('get_watched/<page_number>', views.get_watched),
    path('mark_as_not_watched', views.mark_as_not_watched),
    path('save_rating', views.save_rating),
    path('search_title/<title>', views.search_title),
    path('get_trailer/<movie_id>', views.get_trailer)
]
