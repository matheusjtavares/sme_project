"""Create (or update) a development superuser for local auth validation.

Dev-only helper: reads credentials from `DJANGO_SUPERUSER_*` environment
variables and is idempotent, so the JWT login flow can be exercised
against a predictable account. Not meant for production seeding.
"""

import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update a dev superuser using DJANGO_SUPERUSER_* env vars."

    def handle(self, *args, **options):
        User = get_user_model()
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "admin")

        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": email},
        )
        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save(update_fields=["email", "is_staff", "is_superuser", "password"])

        action = "created" if created else "updated"
        self.stdout.write(self.style.SUCCESS(f"Superuser '{username}' {action}."))
