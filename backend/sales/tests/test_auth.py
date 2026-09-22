import os
from io import StringIO
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.urls import reverse
from rest_framework import status

from sales.tests.base import SalesAPITestCase, make_user


class AuthApiTests(SalesAPITestCase):
    def setUp(self):
        super().setUp()
        self.username = "authuser"
        self.password = "s3cret-password"
        make_user(username=self.username, password=self.password)

    def _login(self):
        return self.client.post(
            reverse("rest_login"),
            {"username": self.username, "password": self.password},
            format="json",
        )

    def test_login_returns_jwt_tokens(self):
        response = self._login()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn("access", data)
        self.assertIn("refresh", data)
        self.assertIn("user", data)
        self.assertEqual(data["user"]["username"], self.username)

    def test_login_with_wrong_password_fails(self):
        response = self.client.post(
            reverse("rest_login"),
            {"username": self.username, "password": "wrong"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_unknown_user_fails(self):
        response = self.client.post(
            reverse("rest_login"),
            {"username": "ghost", "password": "whatever"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_endpoint_requires_authentication(self):
        response = self.client.get(reverse("rest_user_details"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_endpoint_with_valid_token(self):
        access = self._login().json()["access"]
        response = self.client.get(
            reverse("rest_user_details"),
            HTTP_AUTHORIZATION=f"Bearer {access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["username"], self.username)

    def test_user_endpoint_with_invalid_token_fails(self):
        response = self.client.get(
            reverse("rest_user_details"),
            HTTP_AUTHORIZATION="Bearer not-a-valid-jwt",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_blacklists_refresh_token(self):
        refresh = self._login().json()["refresh"]
        logout = self.client.post(
            reverse("rest_logout"),
            {"refresh": refresh},
            format="json",
        )
        self.assertEqual(logout.status_code, status.HTTP_200_OK)

        refresh_response = self.client.post(
            reverse("token_refresh"),
            {"refresh": refresh},
            format="json",
        )
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_referencing_blacklisted_access_token_still_passes_before_expiry(self):
        data = self._login().json()
        self.client.post(
            reverse("rest_logout"),
            {"refresh": data["refresh"]},
            format="json",
        )
        # The access token remains valid until it expires (logout only
        # blacklists the refresh token).
        response = self.client.get(
            reverse("rest_user_details"),
            HTTP_AUTHORIZATION=f"Bearer {data['access']}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SeedSuperuserCommandTests(SalesAPITestCase):
    def test_seed_superuser_creates_superuser(self):
        out = StringIO()
        env = {
            "DJANGO_SUPERUSER_USERNAME": "seeded",
            "DJANGO_SUPERUSER_EMAIL": "seeded@example.com",
            "DJANGO_SUPERUSER_PASSWORD": "seeded-pass",
        }
        with patch.dict(os.environ, env):
            call_command("seed_superuser", stdout=out)
        user = get_user_model().objects.get(username="seeded")
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.check_password("seeded-pass"))

    def test_seed_superuser_updates_existing_user(self):
        make_user(username="seeded", password="old-pass")
        out = StringIO()
        env = {
            "DJANGO_SUPERUSER_USERNAME": "seeded",
            "DJANGO_SUPERUSER_EMAIL": "seeded@example.com",
            "DJANGO_SUPERUSER_PASSWORD": "new-pass",
        }
        with patch.dict(os.environ, env):
            call_command("seed_superuser", stdout=out)
        user = get_user_model().objects.get(username="seeded")
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.check_password("new-pass"))
