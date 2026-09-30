from rest_framework import generics
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Comment, Ticket
from .permissions import IsOwnerOrStaff, IsTicketOwnerOrStaff
from .serializers import CommentSerializer, TicketSerializer, UserRegistrationSerializer


def scoped_tickets_for_user(user):
    queryset = Ticket.objects.select_related("user")
    if user.is_staff:
        return queryset
    return queryset.filter(user=user)


def scoped_comments_for_user(user):
    queryset = Comment.objects.select_related("ticket", "user")
    if user.is_staff:
        return queryset
    return queryset.filter(ticket__user=user)


class TicketListCreateView(generics.ListCreateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = scoped_tickets_for_user(self.request.user)

        search = self.request.query_params.get("search")
        status = self.request.query_params.get("status")
        priority = self.request.query_params.get("priority")

        if search:
            queryset = queryset.filter(title__icontains=search)

        if status:
            queryset = queryset.filter(status=status)

        if priority:
            queryset = queryset.filter(priority__iexact=priority)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TicketDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated, IsTicketOwnerOrStaff]

    def get_queryset(self):
        return scoped_tickets_for_user(self.request.user)


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]

    def get_queryset(self):
        queryset = scoped_comments_for_user(self.request.user)

        ticket_id = self.request.query_params.get("ticket")
        if ticket_id:
            queryset = queryset.filter(ticket_id=ticket_id)

        return queryset

    def perform_create(self, serializer):
        ticket = serializer.validated_data["ticket"]
        user = self.request.user

        if not user.is_staff and ticket.user != user:
            raise PermissionDenied("You can only comment on your own tickets.")

        serializer.save(user=user)


class TicketCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]

    def get_ticket(self):
        ticket = scoped_tickets_for_user(self.request.user).filter(
            pk=self.kwargs["ticket_pk"]
        ).first()
        if ticket is None:
            raise NotFound("Ticket not found.")
        return ticket

    def get_queryset(self):
        ticket = self.get_ticket()
        return Comment.objects.filter(ticket=ticket).select_related("user")

    def perform_create(self, serializer):
        ticket = self.get_ticket()
        serializer.save(user=self.request.user, ticket=ticket)


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    throttle_scope = "register"
