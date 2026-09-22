from django.utils import timezone
from rest_framework import serializers

from sales.models import Customer, Product, Sale, SaleItem, Seller
from sales.services.commission import item_commission, load_weekday_commission_rules


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "code", "description", "unit_price", "commission_percent"]  # noqa: RUF012


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["id", "name", "email", "phone"]  # noqa: RUF012


class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = ["id", "name", "email", "phone"]  # noqa: RUF012


class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.description", read_only=True)
    commission_percent = serializers.SerializerMethodField()
    commission = serializers.SerializerMethodField()
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    _rules = None

    class Meta:
        model = SaleItem
        fields = [  # noqa: RUF012
            "id",
            "product",
            "product_name",
            "quantity",
            "unit_price",
            "commission_percent",
            "commission",
        ]

    @property
    def rules(self):
        if self._rules is None:
            self._rules = load_weekday_commission_rules()
        return self._rules

    def _commission_data(self, obj):
        return item_commission(
            obj.product.commission_percent,
            obj.sale.sold_at.weekday(),
            obj.quantity,
            obj.unit_price,
            self.rules,
        )

    def get_commission_percent(self, obj):
        percent, _ = self._commission_data(obj)
        return str(percent)

    def get_commission(self, obj):
        _, amount = self._commission_data(obj)
        return str(amount)


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)
    invoice_number = serializers.CharField(required=False)
    total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    seller_name = serializers.CharField(source="seller.name", read_only=True)

    class Meta:
        model = Sale
        fields = [  # noqa: RUF012
            "id",
            "invoice_number",
            "sold_at",
            "customer",
            "customer_name",
            "seller",
            "seller_name",
            "items",
            "total",
        ]

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("A sale must have at least one item.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        if "invoice_number" not in validated_data:
            validated_data["invoice_number"] = self._next_invoice_number()
        sale = Sale.objects.create(**validated_data)
        self._replace_items(sale, items_data)
        return sale

    def _next_invoice_number(self):
        """DEV/validation scaffold: sequential NF-{year}-{seq:04d}.

        No lock or transaction guard; the unique constraint on
        invoice_number is the backstop against concurrent creates.
        """
        year = timezone.now().year
        prefix = f"NF-{year}-"
        rows = Sale.objects.filter(invoice_number__startswith=prefix).values_list(
            "invoice_number", flat=True
        )
        last = max(
            (int(row[len(prefix):]) for row in rows if row[len(prefix):].isdigit()),
            default=0,
        )
        return f"{prefix}{last + 1:04d}"

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()
            self._replace_items(instance, items_data)
        return instance

    def _replace_items(self, sale, items_data):
        for item_data in items_data:
            product = item_data["product"]
            SaleItem.objects.create(
                sale=sale,
                product=product,
                quantity=item_data["quantity"],
                unit_price=product.unit_price,
            )


class SellerCommissionSerializer(serializers.Serializer):
    id = serializers.IntegerField(source="seller.id")
    name = serializers.CharField(source="seller.name")
    total_sales = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_commission = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        source="total",
    )


class CommissionReportSerializer(serializers.Serializer):
    start = serializers.DateField()
    end = serializers.DateField()
    sellers = SellerCommissionSerializer(many=True)
    total_commission = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        source="total",
    )
