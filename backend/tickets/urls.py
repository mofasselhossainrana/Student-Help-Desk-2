from django.urls import path
from .views import TicketListCreateView, TicketDetailView, CommentListCreateView
from .views import (
    TicketListCreateView,
    TicketDetailView,
    CommentListCreateView,
    UserRegistrationView
)
from rest_framework.authtoken.views import obtain_auth_token
urlpatterns = [
    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/<int:pk>/', TicketDetailView.as_view(), name='ticket-detail'),
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', obtain_auth_token, name='login'),
]