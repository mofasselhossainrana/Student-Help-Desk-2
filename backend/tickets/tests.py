from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Comment, Ticket


def results(response):
    return response.data["results"]


class AuthAndRegistrationTests(APITestCase):
    def test_register_creates_user(self):
        response = self.client.post(
            reverse("register"),
            {
                "username": "student1",
                "email": "student1@example.com",
                "password": "securepass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="student1").exists())

    def test_register_rejects_duplicate_username(self):
        User.objects.create_user(
            username="student1",
            email="first@example.com",
            password="securepass123",
        )

        response = self.client.post(
            reverse("register"),
            {
                "username": "student1",
                "email": "second@example.com",
                "password": "securepass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_returns_token(self):
        User.objects.create_user(
            username="student1",
            email="student1@example.com",
            password="securepass123",
        )

        response = self.client.post(
            reverse("login"),
            {"username": "student1", "password": "securepass123"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)

    def test_logout_deletes_token(self):
        user = User.objects.create_user(
            username="student1",
            email="student1@example.com",
            password="securepass123",
        )
        token = Token.objects.create(user=user)

        response = self.client.post(
            reverse("logout"),
            HTTP_AUTHORIZATION=f"Token {token.key}",
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Token.objects.filter(user=user).exists())

    def test_register_response_does_not_include_password(self):
        response = self.client.post(
            reverse("register"),
            {
                "username": "student2",
                "email": "student2@example.com",
                "password": "securepass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotIn("password", response.data)


class HealthCheckTests(APITestCase):
    def test_health_check_returns_ok(self):
        response = self.client.get(reverse("health-check"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "ok")
        self.assertTrue(response.data["database"])


class TicketAccessTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username="owner",
            email="owner@example.com",
            password="securepass123",
        )
        self.other = User.objects.create_user(
            username="other",
            email="other@example.com",
            password="securepass123",
        )
        self.staff = User.objects.create_user(
            username="staff",
            email="staff@example.com",
            password="securepass123",
            is_staff=True,
        )

        self.owner_ticket = Ticket.objects.create(
            title="Owner ticket",
            description="Needs help",
            user=self.owner,
        )
        self.other_ticket = Ticket.objects.create(
            title="Other ticket",
            description="Private issue",
            user=self.other,
        )

        self.owner_token = Token.objects.create(user=self.owner).key
        self.other_token = Token.objects.create(user=self.other).key
        self.staff_token = Token.objects.create(user=self.staff).key

    def auth(self, token):
        return {"HTTP_AUTHORIZATION": f"Token {token}"}

    def test_user_sees_only_own_tickets(self):
        response = self.client.get(reverse("ticket-list-create"), **self.auth(self.owner_token))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(results(response)[0]["id"], self.owner_ticket.id)

    def test_staff_sees_all_tickets(self):
        response = self.client.get(reverse("ticket-list-create"), **self.auth(self.staff_token))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)

    def test_unauthenticated_user_cannot_list_tickets(self):
        response = self.client.get(reverse("ticket-list-create"))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_cannot_retrieve_other_users_ticket(self):
        response = self.client.get(
            reverse("ticket-detail", kwargs={"pk": self.other_ticket.id}),
            **self.auth(self.owner_token),
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_create_ticket(self):
        response = self.client.post(
            reverse("ticket-list-create"),
            {
                "title": "New ticket",
                "description": "Broken laptop",
                "priority": "HIGH",
            },
            format="json",
            **self.auth(self.owner_token),
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["user"]["username"], "owner")
        self.assertEqual(response.data["priority"], "HIGH")

    def test_ticket_filter_by_priority_is_case_insensitive(self):
        Ticket.objects.create(
            title="High priority ticket",
            description="Urgent",
            priority="HIGH",
            user=self.owner,
        )

        response = self.client.get(
            reverse("ticket-list-create") + "?priority=high",
            **self.auth(self.owner_token),
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(results(response)[0]["priority"], "HIGH")

    def test_invalid_priority_is_rejected(self):
        response = self.client.post(
            reverse("ticket-list-create"),
            {
                "title": "Bad ticket",
                "description": "Invalid priority",
                "priority": "URGENT",
            },
            format="json",
            **self.auth(self.owner_token),
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_student_cannot_update_ticket_status(self):
        response = self.client.patch(
            reverse("ticket-detail", kwargs={"pk": self.owner_ticket.id}),
            {"status": "CLOSED"},
            format="json",
            **self.auth(self.owner_token),
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.owner_ticket.refresh_from_db()
        self.assertEqual(self.owner_ticket.status, "OPEN")


class CommentAccessTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username="owner",
            email="owner@example.com",
            password="securepass123",
        )
        self.other = User.objects.create_user(
            username="other",
            email="other@example.com",
            password="securepass123",
        )

        self.owner_ticket = Ticket.objects.create(
            title="Owner ticket",
            description="Needs help",
            user=self.owner,
        )
        self.other_ticket = Ticket.objects.create(
            title="Other ticket",
            description="Private issue",
            user=self.other,
        )

        Comment.objects.create(
            content="Owner comment",
            ticket=self.owner_ticket,
            user=self.owner,
        )
        Comment.objects.create(
            content="Other comment",
            ticket=self.other_ticket,
            user=self.other,
        )

        self.owner_token = Token.objects.create(user=self.owner).key
        self.other_token = Token.objects.create(user=self.other).key

    def auth(self, token):
        return {"HTTP_AUTHORIZATION": f"Token {token}"}

    def test_user_sees_only_comments_on_own_tickets(self):
        response = self.client.get(reverse("comment-list-create"), **self.auth(self.owner_token))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(results(response)[0]["content"], "Owner comment")

    def test_user_cannot_comment_on_other_users_ticket(self):
        response = self.client.post(
            reverse("comment-list-create"),
            {"content": "Should fail", "ticket": self.other_ticket.id},
            format="json",
            **self.auth(self.owner_token),
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_nested_comments_endpoint_returns_ticket_comments(self):
        response = self.client.get(
            reverse(
                "ticket-comment-list-create",
                kwargs={"ticket_pk": self.owner_ticket.id},
            ),
            **self.auth(self.owner_token),
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_nested_comments_endpoint_hides_other_users_ticket(self):
        response = self.client.get(
            reverse(
                "ticket-comment-list-create",
                kwargs={"ticket_pk": self.other_ticket.id},
            ),
            **self.auth(self.owner_token),
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_create_nested_comment(self):
        response = self.client.post(
            reverse(
                "ticket-comment-list-create",
                kwargs={"ticket_pk": self.owner_ticket.id},
            ),
            {"content": "Follow-up update"},
            format="json",
            **self.auth(self.owner_token),
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["content"], "Follow-up update")
        self.assertEqual(response.data["user"]["username"], "owner")
