from django.contrib import admin

from .models import Comment, Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "priority", "status", "user", "updated_at")
    list_filter = ("priority", "status", "created_at")
    search_fields = ("title", "description", "user__username")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "ticket", "user", "created_at")
    list_filter = ("created_at",)
    search_fields = ("content", "ticket__title", "user__username")
    readonly_fields = ("created_at",)
