from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom, JoinRoom, UserInRoom, LeaveRoom, UpdateView

urlpatterns = [
    path('home', RoomView.as_view()),
    path('createroom', CreateRoomView.as_view()),
    path('getroom', GetRoom.as_view()),
    path('joinroom', JoinRoom.as_view(), name='joinroom'),
    path('userinroom', UserInRoom.as_view()),
    path('leaveroom', LeaveRoom.as_view()),
    path('updateroom', UpdateView.as_view()),
]
