from rest_framework import serializers

from sales.models import Customer, Product, Sale, SaleItem, Seller


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
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = SaleItem
        fields = ["id", "product", "quantity", "unit_price"]  # noqa: RUF012


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)
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
        sale = Sale.objects.create(**validated_data)
        self._replace_items(sale, items_data)
        return sale

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
