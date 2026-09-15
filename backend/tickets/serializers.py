from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Ticket, Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'content', 'ticket', 'user', 'created_at']
        read_only_fields = ['user']


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description',
            'priority', 'status', 'user',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user']


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user