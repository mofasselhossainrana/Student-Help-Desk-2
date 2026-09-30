from rest_framework.permissions import BasePermission


class IsOwnerOrStaff(BasePermission):
    """Allow staff full access; regular users only access their own objects."""

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True

        owner = getattr(obj, "user", None)
        if owner is not None:
            return owner == request.user

        ticket = getattr(obj, "ticket", None)
        if ticket is not None:
            return ticket.user == request.user

        return False


class IsTicketOwnerOrStaff(BasePermission):
    """Object-level permission for tickets."""

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.user == request.user
