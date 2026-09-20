import datetime as dt
from decimal import Decimal

from django.utils import timezone

from sales.models import SaleItem, WeekdayCommission
from sales.services.commission import (
    commission_report,
    effective_commission_percent,
    sale_commission,
)
from sales.tests.base import (
    SalesTestCase,
    make_product,
    make_sale,
    make_seller,
)


class EffectiveCommissionPercentTests(SalesTestCase):
    def setUp(self):
        super().setUp()
        self.rule = WeekdayCommission.objects.create(
            weekday=WeekdayCommission.Weekday.MONDAY,
            min_percent=Decimal("2.00"),
            max_percent=Decimal("8.00"),
        )
        self.rules = {self.rule.weekday: self.rule}

    def test_no_rule_returns_product_percent(self):
        self.assertEqual(effective_commission_percent(Decimal("5.00"), 3, {}), Decimal("5.00"))

    def test_weekday_without_config_returns_product_percent(self):
        self.assertEqual(
            effective_commission_percent(Decimal("5.00"), 2, self.rules),
            Decimal("5.00"),
        )

    def test_within_bounds_returns_product_percent(self):
        self.assertEqual(
            effective_commission_percent(Decimal("5.00"), 0, self.rules),
            Decimal("5.00"),
        )

    def test_below_min_clamps_to_min(self):
        self.assertEqual(
            effective_commission_percent(Decimal("1.00"), 0, self.rules),
            Decimal("2.00"),
        )

    def test_above_max_clamps_to_max(self):
        self.assertEqual(
            effective_commission_percent(Decimal("9.00"), 0, self.rules),
            Decimal("8.00"),
        )


class SaleCommissionTests(SalesTestCase):
    def setUp(self):
        super().setUp()
        self.product = make_product(
            code="P100",
            unit_price=Decimal("100.00"),
            commission_percent=Decimal("5.00"),
        )
        self.sale = make_sale(sold_at=timezone.make_aware(dt.datetime(2026, 1, 5, 10, 0)))
        SaleItem.objects.create(
            sale=self.sale,
            product=self.product,
            quantity=2,
            unit_price=self.product.unit_price,
        )

    def test_empty_sale_returns_zero(self):
        empty = make_sale(invoice_number="NF-EMPTY")
        self.assertEqual(sale_commission(empty, {}), Decimal("0.00"))

    def test_no_rules_uses_product_commission(self):
        self.assertEqual(sale_commission(self.sale, {}), Decimal("10.00"))

    def test_rules_clamp_commission(self):
        rule = WeekdayCommission.objects.create(
            weekday=0,
            min_percent=Decimal("6.00"),
            max_percent=Decimal("10.00"),
        )
        self.assertEqual(sale_commission(self.sale, {0: rule}), Decimal("12.00"))

    def test_rounding_to_cents(self):
        sale = make_sale(invoice_number="NF-ROUND")
        product = make_product(
            code="P200",
            unit_price=Decimal("33.35"),
            commission_percent=Decimal("5.00"),
        )
        SaleItem.objects.create(
            sale=sale,
            product=product,
            quantity=1,
            unit_price=product.unit_price,
        )
        self.assertEqual(sale_commission(sale, {}), Decimal("1.67"))


class CommissionReportTests(SalesTestCase):
    def setUp(self):
        super().setUp()
        self.ana = make_seller(name="Ana Costa", email="ana@example.com")
        self.maria = make_seller(name="Maria Silva", email="maria@example.com")
        self.product = make_product(
            code="P100",
            unit_price=Decimal("100.00"),
            commission_percent=Decimal("5.00"),
        )
        self.report_start = dt.date(2026, 1, 1)
        self.report_end = dt.date(2026, 1, 31)

    def _sale_with_item(self, seller, day, quantity, invoice):
        sale = make_sale(
            invoice_number=invoice,
            seller=seller,
            sold_at=timezone.make_aware(dt.datetime(2026, 1, day, 10, 0)),
        )
        SaleItem.objects.create(
            sale=sale,
            product=self.product,
            quantity=quantity,
            unit_price=self.product.unit_price,
        )
        return sale

    def test_report_aggregates_per_seller_and_sorts_by_name(self):
        self._sale_with_item(self.ana, 5, 1, "NF-A-1")
        self._sale_with_item(self.maria, 10, 2, "NF-M-1")
        report = commission_report(self.report_start, self.report_end)
        sellers = report["sellers"]
        self.assertEqual([row["seller"].name for row in sellers], ["Ana Costa", "Maria Silva"])
        self.assertEqual(sellers[0]["total"], Decimal("5.00"))
        self.assertEqual(sellers[1]["total"], Decimal("10.00"))
        self.assertEqual(report["total"], Decimal("15.00"))

    def test_report_excludes_sales_outside_range(self):
        self._sale_with_item(self.ana, 5, 1, "NF-A-1")
        outside = make_sale(
            invoice_number="NF-OUT",
            seller=self.maria,
            sold_at=timezone.make_aware(dt.datetime(2026, 2, 5, 10, 0)),
        )
        SaleItem.objects.create(
            sale=outside,
            product=self.product,
            quantity=1,
            unit_price=self.product.unit_price,
        )
        report = commission_report(self.report_start, self.report_end)
        self.assertEqual([row["seller"].name for row in report["sellers"]], ["Ana Costa"])
        self.assertEqual(report["total"], Decimal("5.00"))

    def test_report_includes_boundary_dates(self):
        self._sale_with_item(self.ana, 1, 1, "NF-B-1")
        self._sale_with_item(self.maria, 31, 1, "NF-B-2")
        report = commission_report(self.report_start, self.report_end)
        self.assertEqual(len(report["sellers"]), 2)
        self.assertEqual(report["total"], Decimal("10.00"))

    def test_report_empty_range_returns_zero(self):
        report = commission_report(self.report_start, self.report_end)
        self.assertEqual(report["sellers"], [])
        self.assertEqual(report["total"], Decimal("0"))
