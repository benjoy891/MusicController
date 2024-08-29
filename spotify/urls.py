from django.urls import path
from .views import AuthURL, spotify_callback, IsAuthenticated, CurrentSong, PlaySong, PauseSong, SkipSong

urlpatterns = [
    path('getauthurl', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is_authenticated', IsAuthenticated.as_view()),
    path('currentsong', CurrentSong.as_view()),
    path('pause', PauseSong.as_view()),
    path('play', PlaySong.as_view()),
    path('skip', SkipSong.as_view()),
]


