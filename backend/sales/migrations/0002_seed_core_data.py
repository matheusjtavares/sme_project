from decimal import Decimal

from django.db import migrations


PRODUCTS = [
    {
        "code": "P001",
        "description": "Teclado Mecânico USB",
        "unit_price": Decimal("249.90"),
        "commission_percent": Decimal("5.00"),
    },
    {
        "code": "P002",
        "description": "Mouse Gamer 12000 DPI",
        "unit_price": Decimal("189.90"),
        "commission_percent": Decimal("4.50"),
    },
    {
        "code": "P003",
        "description": "Monitor LED 27\" Full HD",
        "unit_price": Decimal("1199.00"),
        "commission_percent": Decimal("3.00"),
    },
    {
        "code": "P004",
        "description": "Notebook Core i5 16GB 512GB SSD",
        "unit_price": Decimal("4299.00"),
        "commission_percent": Decimal("6.00"),
    },
    {
        "code": "P005",
        "description": "Impressora Multifuncional WiFi",
        "unit_price": Decimal("899.90"),
        "commission_percent": Decimal("2.50"),
    },
    {
        "code": "P006",
        "description": "Webcam Full HD 1080p",
        "unit_price": Decimal("279.90"),
        "commission_percent": Decimal("7.50"),
    },
]

CUSTOMERS = [
    {
        "name": "Acme Corp",
        "email": "contato@acme.com",
        "phone": "11999999999",
    },
    {
        "name": "TechNova Ltda",
        "email": "vendas@technova.com.br",
        "phone": "11977776666",
    },
    {
        "name": "Supermercado Bom Preço",
        "email": "compras@bompreco.com.br",
        "phone": "1133334444",
    },
    {
        "name": "Móveis Estilo",
        "email": "financeiro@moveisestilo.com.br",
        "phone": "2155556666",
    },
    {
        "name": "Padaria Pão Dourado",
        "email": "contato@paodourado.com.br",
        "phone": "3166667777",
    },
]

SELLERS = [
    {
        "name": "Maria Silva",
        "email": "maria.silva@example.com",
        "phone": "11988888888",
    },
    {
        "name": "João Pereira",
        "email": "joao.pereira@example.com",
        "phone": "11977771111",
    },
    {
        "name": "Ana Costa",
        "email": "ana.costa@example.com",
        "phone": "11966660000",
    },
    {
        "name": "Carlos Souza",
        "email": "carlos.souza@example.com",
        "phone": "11955559999",
    },
]

WEEKDAY_COMMISSIONS = [
    {"weekday": 0, "min_percent": Decimal("1.50"), "max_percent": Decimal("5.00")},
    {"weekday": 1, "min_percent": Decimal("1.00"), "max_percent": Decimal("4.00")},
    {"weekday": 2, "min_percent": Decimal("1.50"), "max_percent": Decimal("4.50")},
    {"weekday": 3, "min_percent": Decimal("1.00"), "max_percent": Decimal("3.50")},
    {"weekday": 4, "min_percent": Decimal("2.00"), "max_percent": Decimal("6.00")},
    {"weekday": 5, "min_percent": Decimal("2.50"), "max_percent": Decimal("7.50")},
    {"weekday": 6, "min_percent": Decimal("3.00"), "max_percent": Decimal("8.00")},
]


def seed_core_data(apps, schema_editor):
    Product = apps.get_model("sales", "Product")
    Customer = apps.get_model("sales", "Customer")
    Seller = apps.get_model("sales", "Seller")
    WeekdayCommission = apps.get_model("sales", "WeekdayCommission")

    if Product.objects.exists():
        return

    Product.objects.bulk_create([Product(**data) for data in PRODUCTS])
    Customer.objects.bulk_create([Customer(**data) for data in CUSTOMERS])
    Seller.objects.bulk_create([Seller(**data) for data in SELLERS])
    WeekdayCommission.objects.bulk_create(
        [WeekdayCommission(**data) for data in WEEKDAY_COMMISSIONS]
    )


def unseed_core_data(apps, schema_editor):
    Product = apps.get_model("sales", "Product")
    Customer = apps.get_model("sales", "Customer")
    Seller = apps.get_model("sales", "Seller")
    WeekdayCommission = apps.get_model("sales", "WeekdayCommission")

    WeekdayCommission.objects.filter(
        weekday__in=[data["weekday"] for data in WEEKDAY_COMMISSIONS]
    ).delete()
    Product.objects.filter(code__in=[data["code"] for data in PRODUCTS]).delete()
    Customer.objects.filter(email__in=[data["email"] for data in CUSTOMERS]).delete()
    Seller.objects.filter(email__in=[data["email"] for data in SELLERS]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("sales", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_core_data, unseed_core_data),
    ]