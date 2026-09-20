from django.contrib import admin

from sales.admin import (
    CustomerAdmin,
    ProductAdmin,
    SaleAdmin,
    SellerAdmin,
    WeekdayCommissionAdmin,
)
from sales.models import Customer, Product, Sale, Seller, WeekdayCommission
from sales.tests.base import SalesTestCase, make_user


class AdminRegistrationTests(SalesTestCase):
    def test_all_models_registered(self):
        for model in (Product, Customer, Seller, WeekdayCommission, Sale):
            self.assertIn(model, admin.site._registry)

    def test_custom_admin_classes_used(self):
        self.assertIsInstance(admin.site._registry[Product], ProductAdmin)
        self.assertIsInstance(admin.site._registry[Customer], CustomerAdmin)
        self.assertIsInstance(admin.site._registry[Seller], SellerAdmin)
        self.assertIsInstance(admin.site._registry[WeekdayCommission], WeekdayCommissionAdmin)
        self.assertIsInstance(admin.site._registry[Sale], SaleAdmin)

    def test_changelists_render(self):
        user = make_user(username="admin", password="adminpass")
        user.is_staff = True
        user.is_superuser = True
        user.save()
        self.client.force_login(user)
        for label in ("product", "customer", "seller", "weekdaycommission", "sale"):
            response = self.client.get(f"/admin/sales/{label}/")
            self.assertEqual(response.status_code, 200, f"changelist for {label} failed")
