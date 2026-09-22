import datetime as dt
from decimal import Decimal

from django.urls import reverse
from django.utils import timezone
from rest_framework import status

from sales.models import Product, Sale, SaleItem
from sales.tests.base import (
    SalesAPITestCase,
    add_permissions,
    make_customer,
    make_product,
    make_sale,
    make_seller,
    make_user,
)


class URLTests(SalesAPITestCase):
    def setUp(self):
        super().setUp()
        self.product = make_product()

    def test_reverse_names_resolve(self):
        self.assertEqual(reverse("product-list"), "/api/products/")
        self.assertEqual(reverse("customer-list"), "/api/customers/")
        self.assertEqual(reverse("seller-list"), "/api/sellers/")
        self.assertEqual(reverse("sale-list"), "/api/sales/")
        self.assertEqual(
            reverse("product-detail", args=[self.product.id]),
            f"/api/products/{self.product.id}/",
        )
        self.assertEqual(reverse("commission-report"), "/api/commission-report/")

    def test_health_endpoint(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"status": "ok"})


class ProductApiTests(SalesAPITestCase):
    def setUp(self):
        super().setUp()
        self.product = make_product()
        self.user = add_permissions(
            make_user(username="manager"),
            "add_product",
            "change_product",
            "delete_product",
            "view_product",
        )

    def test_list_products(self):
        response = self.client.get(reverse("product-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)

    def test_retrieve_product(self):
        response = self.client.get(reverse("product-detail", args=[self.product.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["code"], "P001")

    def test_create_product(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("product-list"),
            data={
                "code": "P002",
                "description": "Novo produto",
                "unit_price": "19.90",
                "commission_percent": "3.00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Product.objects.filter(code="P002").exists())

    def test_create_product_without_permission_is_forbidden(self):
        user = make_user(username="noperms")
        self.client.force_authenticate(user=user)
        response = self.client.post(
            reverse("product-list"),
            data={
                "code": "P002",
                "description": "Novo produto",
                "unit_price": "19.90",
                "commission_percent": "3.00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_product(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            reverse("product-detail", args=[self.product.id]),
            data={"description": "Updated"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(self.product.description, "Updated")

    def test_delete_product(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(reverse("product-detail", args=[self.product.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(id=self.product.id).exists())


class PermissionMatrixTests(SalesAPITestCase):
    def setUp(self):
        super().setUp()
        self.product = make_product()

    def test_anonymous_can_read(self):
        response = self.client.get(reverse("product-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_anonymous_cannot_create(self):
        response = self.client.post(reverse("product-list"), data={}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_anonymous_cannot_update_or_delete(self):
        url = reverse("product-detail", args=[self.product.id])
        patch = self.client.patch(url, data={}, format="json")
        delete = self.client.delete(url)
        self.assertEqual(patch.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(delete.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_without_permissions_can_read(self):
        user = make_user(username="plain")
        self.client.force_authenticate(user=user)
        response = self.client.get(reverse("product-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_without_permissions_cannot_create(self):
        user = make_user(username="plain")
        self.client.force_authenticate(user=user)
        response = self.client.post(reverse("product-list"), data={}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_add_permission_allows_create(self):
        user = add_permissions(make_user(username="adder"), "add_product")
        self.client.force_authenticate(user=user)
        response = self.client.post(
            reverse("product-list"),
            data={
                "code": "P009",
                "description": "Novo",
                "unit_price": "1.00",
                "commission_percent": "1.00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_change_permission_required_to_update(self):
        user = add_permissions(make_user(username="changer"), "change_product")
        self.client.force_authenticate(user=user)
        response = self.client.patch(
            reverse("product-detail", args=[self.product.id]),
            data={"description": "changed"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_permission_required_to_delete(self):
        user = add_permissions(make_user(username="deleter"), "delete_product")
        self.client.force_authenticate(user=user)
        response = self.client.delete(reverse("product-detail", args=[self.product.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class ResourcePermissionTests(SalesAPITestCase):
    def test_customer_requires_add_permission(self):
        url = reverse("customer-list")
        self.assertEqual(
            self.client.post(url, data={}, format="json").status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
        user = add_permissions(make_user(username="cust"), "add_customer")
        self.client.force_authenticate(user=user)
        response = self.client.post(
            url,
            data={"name": "Acme", "email": "acme@acme.com", "phone": "1133334444"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_seller_requires_add_permission(self):
        user = add_permissions(make_user(username="sellers"), "add_seller")
        self.client.force_authenticate(user=user)
        response = self.client.post(
            reverse("seller-list"),
            data={"name": "Joao", "email": "joao@example.com", "phone": "11999998888"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class SaleApiTests(SalesAPITestCase):
    def setUp(self):
        super().setUp()
        self.product = make_product(unit_price=Decimal("10.00"))
        self.customer = make_customer()
        self.seller = make_seller()
        self.user = add_permissions(
            make_user(username="salesperson"),
            "add_sale",
            "view_sale",
        )

    def _payload(self, items):
        return {
            "invoice_number": "NF-API-0001",
            "sold_at": "2026-09-02T09:30:00Z",
            "customer": self.customer.id,
            "seller": self.seller.id,
            "items": items,
        }

    def test_create_sale_with_items(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("sale-list"),
            data=self._payload([{"product": self.product.id, "quantity": 2}]),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        sale = Sale.objects.get(invoice_number="NF-API-0001")
        item = sale.items.get()
        self.assertEqual(item.quantity, 2)
        self.assertEqual(item.unit_price, self.product.unit_price)

    def test_create_sale_requires_items(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("sale-list"),
            data=self._payload([]),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_sale_list_includes_item_derived_fields(self):
        sale = make_sale(
            invoice_number="NF-0001",
            customer=self.customer,
            seller=self.seller,
        )
        SaleItem.objects.create(
            sale=sale,
            product=self.product,
            quantity=2,
            unit_price=self.product.unit_price,
        )
        response = self.client.get(reverse("sale-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 1)
        item = data[0]["items"][0]
        self.assertEqual(item["product_name"], "Test product")
        self.assertEqual(item["commission_percent"], "5.00")
        self.assertEqual(item["commission"], "1.00")

    def test_sale_detail_includes_derived_fields(self):
        sale = make_sale(
            invoice_number="NF-0001",
            customer=self.customer,
            seller=self.seller,
        )
        SaleItem.objects.create(
            sale=sale,
            product=self.product,
            quantity=2,
            unit_price=self.product.unit_price,
        )
        response = self.client.get(reverse("sale-detail", args=[sale.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["total"], "20.00")
        self.assertEqual(data["customer_name"], "Acme Corp")
        self.assertEqual(data["seller_name"], "Maria Silva")
        self.assertEqual(len(data["items"]), 1)
        item = data["items"][0]
        self.assertEqual(item["product_name"], "Test product")
        self.assertEqual(item["commission_percent"], "5.00")
        self.assertEqual(item["commission"], "1.00")

    def test_anonymous_cannot_create_sale(self):
        response = self.client.post(reverse("sale-list"), data={}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_sale_without_invoice_number_generates(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("sale-list"),
            data={
                "sold_at": "2026-09-02T09:30:00Z",
                "customer": self.customer.id,
                "seller": self.seller.id,
                "items": [{"product": self.product.id, "quantity": 2}],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.json()["invoice_number"],
            f"NF-{timezone.now().year}-0001",
        )
        self.assertEqual(Sale.objects.count(), 1)

    def test_patch_sale_preserves_invoice_number(self):
        add_permissions(self.user, "change_sale")
        self.client.force_authenticate(user=self.user)
        sale = make_sale(
            invoice_number="NF-KEEP-1",
            customer=self.customer,
            seller=self.seller,
        )
        SaleItem.objects.create(
            sale=sale,
            product=self.product,
            quantity=1,
            unit_price=self.product.unit_price,
        )
        response = self.client.patch(
            reverse("sale-detail", args=[sale.id]),
            data={"items": [{"product": self.product.id, "quantity": 5}]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["invoice_number"], "NF-KEEP-1")
        sale.refresh_from_db()
        self.assertEqual(sale.items.get().quantity, 5)


class ListResponseTests(SalesAPITestCase):
    def test_list_returns_bare_array(self):
        for i in range(51):
            make_product(code=f"PAG-{i:03d}")
        response = self.client.get(reverse("product-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 51)


class CommissionReportApiTests(SalesAPITestCase):
    def setUp(self):
        super().setUp()
        self.product = make_product(
            unit_price=Decimal("100.00"),
            commission_percent=Decimal("5.00"),
        )
        self.seller = make_seller()
        self.sale = make_sale(
            invoice_number="NF-C-0001",
            seller=self.seller,
            sold_at=timezone.make_aware(dt.datetime(2026, 1, 5, 10, 0)),
        )
        SaleItem.objects.create(
            sale=self.sale,
            product=self.product,
            quantity=1,
            unit_price=self.product.unit_price,
        )

    def test_anonymous_can_access_report(self):
        response = self.client.get(
            reverse("commission-report"),
            {"start_date": "2026-01-01", "end_date": "2026-01-31"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_report_returns_commission_per_seller(self):
        response = self.client.get(
            reverse("commission-report"),
            {"start_date": "2026-01-01", "end_date": "2026-01-31"},
        )
        data = response.json()
        self.assertEqual(data["start"], "2026-01-01")
        self.assertEqual(data["end"], "2026-01-31")
        self.assertEqual(len(data["sellers"]), 1)
        self.assertEqual(data["sellers"][0]["name"], "Maria Silva")
        self.assertEqual(Decimal(data["sellers"][0]["total_sales"]), Decimal("100.00"))
        self.assertEqual(Decimal(data["sellers"][0]["total_commission"]), Decimal("5.00"))
        self.assertEqual(Decimal(data["total_commission"]), Decimal("5.00"))

    def test_report_empty_range_returns_zero_total(self):
        response = self.client.get(
            reverse("commission-report"),
            {"start_date": "2026-02-01", "end_date": "2026-02-28"},
        )
        data = response.json()
        self.assertEqual(data["sellers"], [])
        self.assertEqual(Decimal(data["total_commission"]), Decimal("0"))

    def test_missing_dates_returns_400(self):
        response = self.client.get(reverse("commission-report"))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("errors", response.json())

    def test_invalid_date_format_returns_400(self):
        response = self.client.get(
            reverse("commission-report"),
            {"start_date": "not-a-date", "end_date": "2026-01-31"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_future_start_date_returns_400(self):
        start = (dt.date.today() + dt.timedelta(days=1)).isoformat()
        end = (dt.date.today() + dt.timedelta(days=2)).isoformat()
        response = self.client.get(reverse("commission-report"), {"start_date": start, "end_date": end})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_start_after_end_returns_400(self):
        response = self.client.get(
            reverse("commission-report"),
            {"start_date": "2026-01-31", "end_date": "2026-01-01"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
