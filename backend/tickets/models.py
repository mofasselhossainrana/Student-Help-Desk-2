from django.db import models


class Ticket(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()

    priority = models.CharField(max_length=20, default="MEDIUM")
    status = models.CharField(max_length=20, default="OPEN")

    user = models.ForeignKey(
        "auth.User",
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Comment(models.Model):
    content = models.TextField()

    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.CASCADE
    )

    user = models.ForeignKey(
        "auth.User",
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)