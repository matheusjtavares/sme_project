from django.contrib import admin

from sales.models import (
    Customer,
    Product,
    Sale,
    SaleItem,
    Seller,
    WeekdayCommission,
)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("code", "description", "unit_price", "commission_percent")
    search_fields = ("code", "description")


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone")
    search_fields = ("name", "email")


@admin.register(Seller)
class SellerAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone")
    search_fields = ("name", "email")


@admin.register(WeekdayCommission)
class WeekdayCommissionAdmin(admin.ModelAdmin):
    list_display = ("weekday", "min_percent", "max_percent")


class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 1


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ("invoice_number", "sold_at", "customer", "seller")
    list_filter = ("seller", "customer")
    search_fields = ("invoice_number",)
    inlines = [SaleItemInline]
