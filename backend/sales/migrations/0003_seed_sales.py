from datetime import datetime

from django.db import migrations
from django.utils import timezone


SALES = [
    {
        "invoice_number": "NF-2026-0901",
        "sold_at": datetime(2026, 9, 2, 9, 30),
        "customer": "contato@acme.com",
        "seller": "maria.silva@example.com",
        "items": [
            {"product": "P003", "quantity": 2},
            {"product": "P001", "quantity": 1},
        ],
    },
    {
        "invoice_number": "NF-2026-0902",
        "sold_at": datetime(2026, 9, 5, 14, 15),
        "customer": "vendas@technova.com.br",
        "seller": "joao.pereira@example.com",
        "items": [
            {"product": "P004", "quantity": 1},
            {"product": "P002", "quantity": 2},
        ],
    },
    {
        "invoice_number": "NF-2026-0903",
        "sold_at": datetime(2026, 9, 8, 10, 0),
        "customer": "compras@bompreco.com.br",
        "seller": "ana.costa@example.com",
        "items": [
            {"product": "P005", "quantity": 1},
        ],
    },
    {
        "invoice_number": "NF-2026-0904",
        "sold_at": datetime(2026, 9, 11, 16, 45),
        "customer": "financeiro@moveisestilo.com.br",
        "seller": "carlos.souza@example.com",
        "items": [
            {"product": "P001", "quantity": 3},
            {"product": "P006", "quantity": 1},
        ],
    },
    {
        "invoice_number": "NF-2026-0905",
        "sold_at": datetime(2026, 9, 15, 11, 20),
        "customer": "contato@paodourado.com.br",
        "seller": "maria.silva@example.com",
        "items": [
            {"product": "P002", "quantity": 1},
            {"product": "P005", "quantity": 1},
        ],
    },
    {
        "invoice_number": "NF-2026-0906",
        "sold_at": datetime(2026, 9, 18, 9, 0),
        "customer": "contato@acme.com",
        "seller": "joao.pereira@example.com",
        "items": [
            {"product": "P003", "quantity": 1},
            {"product": "P004", "quantity": 1},
            {"product": "P006", "quantity": 2},
        ],
    },
    {
        "invoice_number": "NF-2026-0907",
        "sold_at": datetime(2026, 9, 19, 15, 30),
        "customer": "vendas@technova.com.br",
        "seller": "ana.costa@example.com",
        "items": [
            {"product": "P001", "quantity": 2},
            {"product": "P002", "quantity": 3},
        ],
    },
]


def seed_sales(apps, schema_editor):
    Sale = apps.get_model("sales", "Sale")
    SaleItem = apps.get_model("sales", "SaleItem")
    Customer = apps.get_model("sales", "Customer")
    Seller = apps.get_model("sales", "Seller")
    Product = apps.get_model("sales", "Product")

    if Sale.objects.exists():
        return

    for data in SALES:
        customer = Customer.objects.get(email=data["customer"])
        seller = Seller.objects.get(email=data["seller"])
        sale = Sale.objects.create(
            invoice_number=data["invoice_number"],
            sold_at=timezone.make_aware(data["sold_at"]),
            customer=customer,
            seller=seller,
        )
        items = []
        for item_data in data["items"]:
            product = Product.objects.get(code=item_data["product"])
            items.append(
                SaleItem(
                    sale=sale,
                    product=product,
                    quantity=item_data["quantity"],
                    unit_price=product.unit_price,
                )
            )
        SaleItem.objects.bulk_create(items)


def unseed_sales(apps, schema_editor):
    Sale = apps.get_model("sales", "Sale")
    Sale.objects.filter(
        invoice_number__in=[data["invoice_number"] for data in SALES]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("sales", "0002_seed_core_data"),
    ]

    operations = [
        migrations.RunPython(seed_sales, unseed_sales),
    ]