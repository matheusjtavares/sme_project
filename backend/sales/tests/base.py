from decimal import Decimal

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APITestCase

from sales.models import Customer, Product, Sale, SaleItem, Seller, WeekdayCommission


def clear_tables():
    Sale.objects.all().delete()
    SaleItem.objects.all().delete()
    Product.objects.all().delete()
    Customer.objects.all().delete()
    Seller.objects.all().delete()
    WeekdayCommission.objects.all().delete()


def make_product(
    code="P001",
    description="Test product",
    unit_price=Decimal("10.00"),
    commission_percent=Decimal("5.00"),
):
    return Product.objects.create(
        code=code,
        description=description,
        unit_price=unit_price,
        commission_percent=commission_percent,
    )


def make_customer(name="Acme Corp", email="contato@acme.com", phone="1199999999"):
    return Customer.objects.create(name=name, email=email, phone=phone)


def make_seller(name="Maria Silva", email="maria@example.com", phone="11988888888"):
    return Seller.objects.create(name=name, email=email, phone=phone)


def make_sale(invoice_number="NF-0001", sold_at=None, customer=None, seller=None):
    if sold_at is None:
        sold_at = timezone.now()
    if customer is None:
        customer = make_customer()
    if seller is None:
        seller = make_seller()
    return Sale.objects.create(
        invoice_number=invoice_number,
        sold_at=sold_at,
        customer=customer,
        seller=seller,
    )


def make_user(username="tester", password="testpass123", **kwargs):
    return get_user_model().objects.create_user(
        username=username,
        password=password,
        **kwargs,
    )


def add_permissions(user, *codenames):
    for codename in codenames:
        user.user_permissions.add(Permission.objects.get(codename=codename))
    return user


class SalesTestCase(TestCase):
    def setUp(self):
        clear_tables()
        super().setUp()


class SalesAPITestCase(APITestCase):
    def setUp(self):
        clear_tables()
        super().setUp()
