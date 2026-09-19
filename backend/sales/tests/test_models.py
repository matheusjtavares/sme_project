from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.db.models.deletion import ProtectedError
from django.test import TestCase
from django.utils import timezone

from sales.models import Customer, Product, Sale, SaleItem, Seller, WeekdayCommission


class ProductModelTests(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            code="P001",
            description="Test product",
            unit_price=Decimal("29.90"),
            commission_percent=Decimal("5.00"),
        )

    def test_str(self):
        self.assertEqual(str(self.product), "P001 - Test product")

    def test_default_ordering_by_code(self):
        Product.objects.create(
            code="B100",
            description="Second product",
            unit_price=Decimal("9.99"),
            commission_percent=Decimal("2.00"),
        )
        products = list(Product.objects.all())
        self.assertEqual([p.code for p in products], ["B100", "P001"])

    def test_code_is_unique(self):
        with self.assertRaises(IntegrityError):
            Product.objects.create(
                code="P001",
                description="Duplicate product",
                unit_price=Decimal("10.00"),
                commission_percent=Decimal("1.00"),
            )

    def test_negative_unit_price_is_invalid(self):
        self.product.unit_price = Decimal("-0.01")
        with self.assertRaises(ValidationError):
            self.product.full_clean()

    def test_negative_commission_percent_is_invalid(self):
        self.product.commission_percent = Decimal("-0.01")
        with self.assertRaises(ValidationError):
            self.product.full_clean()

    def test_commission_percent_above_max_is_invalid(self):
        self.product.commission_percent = Decimal("10.01")
        with self.assertRaises(ValidationError):
            self.product.full_clean()

    def test_boundary_commission_percent_is_valid(self):
        self.product.commission_percent = Decimal("10.00")
        self.product.full_clean()


class CustomerModelTests(TestCase):
    def setUp(self):
        self.customer = Customer.objects.create(
            name="Acme Corp",
            email="contato@acme.com",
            phone="1199999999",
        )

    def test_str(self):
        self.assertEqual(str(self.customer), "Acme Corp")


class SellerModelTests(TestCase):
    def setUp(self):
        self.seller = Seller.objects.create(
            name="Maria Silva",
            email="maria@example.com",
            phone="11988888888",
        )

    def test_str(self):
        self.assertEqual(str(self.seller), "Maria Silva")


class WeekdayCommissionModelTests(TestCase):
    def setUp(self):
        self.commission = WeekdayCommission.objects.create(
            weekday=WeekdayCommission.Weekday.MONDAY,
            min_percent=Decimal("1.50"),
            max_percent=Decimal("5.00"),
        )

    def test_str(self):
        self.assertEqual(str(self.commission), "Monday: 1.50% - 5.00%")

    def test_weekday_is_unique(self):
        with self.assertRaises(IntegrityError):
            WeekdayCommission.objects.create(
                weekday=WeekdayCommission.Weekday.MONDAY,
                min_percent=Decimal("2.00"),
                max_percent=Decimal("3.00"),
            )

    def test_default_ordering_by_weekday(self):
        WeekdayCommission.objects.create(
            weekday=WeekdayCommission.Weekday.WEDNESDAY,
            min_percent=Decimal("1.00"),
            max_percent=Decimal("4.00"),
        )
        commissions = list(WeekdayCommission.objects.all())
        self.assertEqual(
            [c.weekday for c in commissions],
            [WeekdayCommission.Weekday.MONDAY, WeekdayCommission.Weekday.WEDNESDAY],
        )

    def test_min_percent_greater_than_max_percent_is_invalid(self):
        commission = WeekdayCommission(
            weekday=WeekdayCommission.Weekday.TUESDAY,
            min_percent=Decimal("5.00"),
            max_percent=Decimal("2.00"),
        )
        with self.assertRaises(ValidationError) as context:
            commission.full_clean()
        self.assertIn("max_percent", context.exception.message_dict)

    def test_min_percent_equal_to_max_percent_is_valid(self):
        commission = WeekdayCommission(
            weekday=WeekdayCommission.Weekday.TUESDAY,
            min_percent=Decimal("5.00"),
            max_percent=Decimal("5.00"),
        )
        commission.full_clean()


class SaleModelTests(TestCase):
    def setUp(self):
        self.customer = Customer.objects.create(
            name="Acme Corp",
            email="contato@acme.com",
            phone="1199999999",
        )
        self.seller = Seller.objects.create(
            name="Maria Silva",
            email="maria@example.com",
            phone="11988888888",
        )
        self.product = Product.objects.create(
            code="P001",
            description="Test product",
            unit_price=Decimal("10.00"),
            commission_percent=Decimal("5.00"),
        )
        self.sale = Sale.objects.create(
            invoice_number="NF-0001",
            sold_at=timezone.now(),
            customer=self.customer,
            seller=self.seller,
        )

    def test_str(self):
        self.assertEqual(str(self.sale), "NF NF-0001")

    def test_invoice_number_is_unique(self):
        with self.assertRaises(IntegrityError):
            Sale.objects.create(
                invoice_number="NF-0001",
                sold_at=timezone.now(),
                customer=self.customer,
                seller=self.seller,
            )

    def test_default_ordering_by_sold_at_descending(self):
        Sale.objects.create(
            invoice_number="NF-0002",
            sold_at=timezone.now() + timezone.timedelta(hours=1),
            customer=self.customer,
            seller=self.seller,
        )
        sales = list(Sale.objects.all())
        self.assertEqual([s.invoice_number for s in sales], ["NF-0002", "NF-0001"])

    def test_total_is_zero_without_items(self):
        self.assertEqual(self.sale.total, Decimal("0"))

    def test_total_sums_item_amounts(self):
        SaleItem.objects.create(
            sale=self.sale,
            product=self.product,
            quantity=2,
            unit_price=Decimal("10.00"),
        )
        SaleItem.objects.create(
            sale=self.sale,
            product=self.product,
            quantity=3,
            unit_price=Decimal("5.00"),
        )
        self.assertEqual(self.sale.total, Decimal("35.00"))

    def test_customer_delete_is_protected(self):
        with self.assertRaises(ProtectedError):
            self.customer.delete()

    def test_seller_delete_is_protected(self):
        with self.assertRaises(ProtectedError):
            self.seller.delete()

    def test_deleting_sale_cascades_to_items(self):
        SaleItem.objects.create(
            sale=self.sale,
            product=self.product,
            quantity=1,
            unit_price=Decimal("10.00"),
        )
        self.sale.delete()
        self.assertEqual(SaleItem.objects.count(), 0)


class SaleItemModelTests(TestCase):
    def setUp(self):
        self.customer = Customer.objects.create(
            name="Acme Corp",
            email="contato@acme.com",
            phone="1199999999",
        )
        self.seller = Seller.objects.create(
            name="Maria Silva",
            email="maria@example.com",
            phone="11988888888",
        )
        self.product = Product.objects.create(
            code="P001",
            description="Test product",
            unit_price=Decimal("10.00"),
            commission_percent=Decimal("5.00"),
        )
        self.sale = Sale.objects.create(
            invoice_number="NF-0001",
            sold_at=timezone.now(),
            customer=self.customer,
            seller=self.seller,
        )
        self.item = SaleItem.objects.create(
            sale=self.sale,
            product=self.product,
            quantity=2,
            unit_price=Decimal("10.00"),
        )

    def test_str(self):
        self.assertEqual(str(self.item), "2x P001 - Test product")

    def test_quantity_zero_is_invalid(self):
        self.item.quantity = 0
        with self.assertRaises(ValidationError):
            self.item.full_clean()

    def test_negative_unit_price_is_invalid(self):
        self.item.unit_price = Decimal("-0.01")
        with self.assertRaises(ValidationError):
            self.item.full_clean()

    def test_item_is_accessible_through_sale_related_name(self):
        self.assertIn(self.item, self.sale.items.all())

    def test_product_delete_is_protected(self):
        with self.assertRaises(ProtectedError):
            self.product.delete()
