from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Product(models.Model):
    code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255)
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0"))],
    )
    commission_percent = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal("0")),
            MaxValueValidator(Decimal("10")),
        ],
    )

    class Meta:
        ordering = ["code"]  # noqa: RUF012

    def __str__(self):
        return f"{self.code} - {self.description}"


class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    def __str__(self):
        return self.name


class Seller(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    def __str__(self):
        return self.name


class WeekdayCommission(models.Model):
    class Weekday(models.IntegerChoices):
        MONDAY = 0, "Monday"
        TUESDAY = 1, "Tuesday"
        WEDNESDAY = 2, "Wednesday"
        THURSDAY = 3, "Thursday"
        FRIDAY = 4, "Friday"
        SATURDAY = 5, "Saturday"
        SUNDAY = 6, "Sunday"

    weekday = models.PositiveSmallIntegerField(unique=True, choices=Weekday.choices)
    min_percent = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0")), MaxValueValidator(Decimal("10"))],
    )
    max_percent = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0")), MaxValueValidator(Decimal("10"))],
    )

    class Meta:
        ordering = ["weekday"]  # noqa: RUF012

    def __str__(self):
        return f"{self.get_weekday_display()}: {self.min_percent}% - {self.max_percent}%"

    def clean(self):
        super().clean()
        if (
            self.min_percent is not None
            and self.max_percent is not None
            and self.min_percent > self.max_percent
        ):
            raise ValidationError(
                {"max_percent": ("max_percent must be greater than or equal to min_percent.")}
            )


class Sale(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True)
    sold_at = models.DateTimeField()
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name="sales")
    seller = models.ForeignKey(Seller, on_delete=models.PROTECT, related_name="sales")

    class Meta:
        ordering = ["-sold_at"]  # noqa: RUF012

    def __str__(self):
        return f"NF {self.invoice_number}"

    @property
    def total(self):
        return sum(
            (item.quantity * item.unit_price for item in self.items.all()),
            Decimal("0"),
        )


class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0"))],
    )

    def __str__(self):
        return f"{self.quantity}x {self.product}"
