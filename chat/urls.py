from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    RoomListCreateView,
    RoomDetailView,
    MessageListCreateView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('rooms/', RoomListCreateView.as_view(), name='room-list-create'),
    path('rooms/<int:pk>/', RoomDetailView.as_view(), name='room-detail'),
    path('rooms/<int:room_id>/messages/', MessageListCreateView.as_view(), name='message-list-create'),
]
