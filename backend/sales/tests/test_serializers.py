from decimal import Decimal

from django.utils import timezone

from sales.models import SaleItem
from sales.serializers import (
    CustomerSerializer,
    ProductSerializer,
    SaleItemSerializer,
    SaleSerializer,
    SellerSerializer,
)
from sales.tests.base import (
    SalesTestCase,
    make_customer,
    make_product,
    make_sale,
    make_seller,
)


class ProductSerializerTests(SalesTestCase):
    def setUp(self):
        super().setUp()
        self.product = make_product(unit_price=Decimal("29.90"))

    def test_serializes_fields(self):
        data = ProductSerializer(self.product).data
        self.assertEqual(
            set(data),
            {"id", "code", "description", "unit_price", "commission_percent"},
        )
        self.assertEqual(data["code"], "P001")
        self.assertEqual(data["unit_price"], "29.90")

    def test_valid_data_creates_product(self):
        serializer = ProductSerializer(
            data={
                "code": "P002",
                "description": "Second product",
                "unit_price": "9.99",
                "commission_percent": "2.00",
            }
        )
        self.assertTrue(serializer.is_valid())
        product = serializer.save()
        self.assertEqual(product.code, "P002")

    def test_duplicate_code_is_invalid(self):
        serializer = ProductSerializer(
            data={
                "code": "P001",
                "description": "Duplicate",
                "unit_price": "10.00",
                "commission_percent": "1.00",
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("code", serializer.errors)

    def test_negative_unit_price_is_invalid(self):
        serializer = ProductSerializer(
            data={
                "code": "P003",
                "description": "Invalid",
                "unit_price": "-1.00",
                "commission_percent": "1.00",
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("unit_price", serializer.errors)

    def test_commission_percent_above_max_is_invalid(self):
        serializer = ProductSerializer(
            data={
                "code": "P004",
                "description": "Invalid",
                "unit_price": "10.00",
                "commission_percent": "10.01",
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("commission_percent", serializer.errors)


class CustomerSerializerTests(SalesTestCase):
    def setUp(self):
        super().setUp()
        self.customer = make_customer()

    def test_serializes_fields(self):
        data = CustomerSerializer(self.customer).data
        self.assertEqual(set(data), {"id", "name", "email", "phone"})
        self.assertEqual(data["name"], "Acme Corp")

    def test_valid_data_creates_customer(self):
        serializer = CustomerSerializer(
            data={"name": "Outra Empresa", "email": "oi@empresa.com.br", "phone": "1133334444"}
        )
        self.assertTrue(serializer.is_valid())
        customer = serializer.save()
        self.assertEqual(customer.email, "oi@empresa.com.br")

    def test_invalid_email_is_invalid(self):
        serializer = CustomerSerializer(
            data={"name": "Outra Empresa", "email": "not-an-email", "phone": "1133334444"}
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)


class SellerSerializerTests(SalesTestCase):
    def setUp(self):
        super().setUp()
        self.seller = make_seller()

    def test_serializes_fields(self):
        data = SellerSerializer(self.seller).data
        self.assertEqual(set(data), {"id", "name", "email", "phone"})
        self.assertEqual(data["name"], "Maria Silva")

    def test_valid_data_creates_seller(self):
        serializer = SellerSerializer(
            data={"name": "Outro Vendedor", "email": "vendedor@example.com", "phone": "1133334444"}
        )
        self.assertTrue(serializer.is_valid())
        seller = serializer.save()
        self.assertEqual(seller.name, "Outro Vendedor")


class SaleItemSerializerTests(SalesTestCase):
    def setUp(self):
        super().setUp()
        self.product = make_product(unit_price=Decimal("10.00"))
        self.sale = make_sale()
        self.item = SaleItem.objects.create(
            sale=self.sale,
            product=self.product,
            quantity=2,
            unit_price=self.product.unit_price,
        )

    def test_serializes_unit_price_from_instance(self):
        data = SaleItemSerializer(self.item).data
        self.assertEqual(data["unit_price"], "10.00")
        self.assertEqual(data["quantity"], 2)
        self.assertEqual(data["product"], self.product.id)

    def test_unit_price_is_read_only(self):
        serializer = SaleItemSerializer(
            data={
                "product": self.product.id,
                "quantity": 3,
                "unit_price": "99.99",
            }
        )
        self.assertTrue(serializer.is_valid())
        self.assertNotIn("unit_price", serializer.validated_data)


class SaleSerializerTests(SalesTestCase):
    def setUp(self):
        super().setUp()
        self.product = make_product(unit_price=Decimal("10.00"))
        self.customer = make_customer()
        self.seller = make_seller()

    def _sale_payload(self, items, **overrides):
        payload = {
            "invoice_number": "NF-TEST-0001",
            "sold_at": "2026-09-02T09:30:00Z",
            "customer": self.customer.id,
            "seller": self.seller.id,
            "items": items,
        }
        payload.update(overrides)
        return payload

    def test_create_sale_with_items_uses_product_price(self):
        serializer = SaleSerializer(data=self._sale_payload([{"product": self.product.id, "quantity": 2}]))
        self.assertTrue(serializer.is_valid(), serializer.errors)
        sale = serializer.save()
        self.assertEqual(sale.items.count(), 1)
        item = sale.items.get()
        self.assertEqual(item.quantity, 2)
        self.assertEqual(item.unit_price, self.product.unit_price)

    def test_empty_items_is_invalid(self):
        serializer = SaleSerializer(data=self._sale_payload([]))
        self.assertFalse(serializer.is_valid())
        self.assertIn("items", serializer.errors)

    def test_missing_items_is_invalid(self):
        serializer = SaleSerializer(
            data={
                "invoice_number": "NF-TEST-0002",
                "sold_at": "2026-09-02T09:30:00Z",
                "customer": self.customer.id,
                "seller": self.seller.id,
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("items", serializer.errors)

    def test_serialized_output_includes_derived_fields(self):
        sale = make_sale(invoice_number="NF-0001", customer=self.customer, seller=self.seller)
        SaleItem.objects.create(
            sale=sale,
            product=self.product,
            quantity=2,
            unit_price=self.product.unit_price,
        )
        data = SaleSerializer(sale).data
        self.assertEqual(data["total"], "20.00")
        self.assertEqual(data["customer_name"], "Acme Corp")
        self.assertEqual(data["seller_name"], "Maria Silva")
        self.assertEqual(len(data["items"]), 1)

    def test_update_replaces_items(self):
        sale = make_sale(invoice_number="NF-0001", customer=self.customer, seller=self.seller)
        SaleItem.objects.create(
            sale=sale,
            product=self.product,
            quantity=1,
            unit_price=self.product.unit_price,
        )
        payload = self._sale_payload(
            [{"product": self.product.id, "quantity": 5}],
            invoice_number="NF-0001",
            sold_at=timezone.now(),
        )
        serializer = SaleSerializer(sale, data=payload)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated = serializer.save()
        self.assertEqual(updated.items.count(), 1)
        self.assertEqual(updated.items.get().quantity, 5)
