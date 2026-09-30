from django.urls import path

from .auth_views import LogoutView, ThrottledLoginView
from .health import HealthCheckView
from .views import (
    CommentListCreateView,
    TicketCommentListCreateView,
    TicketDetailView,
    TicketListCreateView,
    UserRegistrationView,
)

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health-check"),
    path("tickets/", TicketListCreateView.as_view(), name="ticket-list-create"),
    path("tickets/<int:pk>/", TicketDetailView.as_view(), name="ticket-detail"),
    path(
        "tickets/<int:ticket_pk>/comments/",
        TicketCommentListCreateView.as_view(),
        name="ticket-comment-list-create",
    ),
    path("comments/", CommentListCreateView.as_view(), name="comment-list-create"),
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("login/", ThrottledLoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
]
