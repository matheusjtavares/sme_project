import datetime as dt
from collections import defaultdict
from decimal import ROUND_HALF_UP, Decimal

from sales.models import Sale, WeekdayCommission

# Use Decimal for monetary calculations to avoid floating-point precision issues
ZERO = Decimal("0")
HUNDRED = Decimal("100")
CENTS = Decimal("0.01")


def effective_commission_percent(product_percent, weekday, configs):
    config = configs.get(weekday)
    if config is None:
        return product_percent
    return max(config.min_percent, min(product_percent, config.max_percent))


def item_commission(base_percent, weekday, quantity, unit_price, rules):
    """Calculate the effective commission percent and amount for a single sale item.
    Args:
        base_percent (Decimal): The product's configured commission percent.
        weekday (int): The Python weekday (0=Monday) of the parent sale.
        quantity (int): Number of items sold.
        unit_price (Decimal): The unit price applied to the sale item.
        rules (dict): A dictionary of weekday commission rules.
    Returns:
        tuple[Decimal, Decimal]: The effective commission percent and the commission amount in cents.
    """
    percent = effective_commission_percent(base_percent, weekday, rules)
    amount = ((percent / HUNDRED) * quantity * unit_price).quantize(CENTS, rounding=ROUND_HALF_UP)
    return percent, amount


def sale_commission(sale, rules):
    """Calculate the commission for a single sale based on the product's commission percent and any applicable weekday rules.
    Args:
        sale (Sale): The sale object for which to calculate the commission.
        rules (dict): A dictionary of weekday commission rules.
    Returns:
        Decimal: The calculated commission for the sale.
    """
    weekday = sale.sold_at.weekday()
    total = ZERO
    for item in sale.items.all():
        _, amount = item_commission(
            item.product.commission_percent,
            weekday,
            item.quantity,
            item.unit_price,
            rules,
        )
        total += amount
    return total.quantize(CENTS, rounding=ROUND_HALF_UP)


def load_weekday_commission_rules():
    return {config.weekday: config for config in WeekdayCommission.objects.all()}


def commission_report(start: dt.datetime, end: dt.datetime) -> dict:
    """Generate a commission report for sales between the given start and end dates.
    Args:
        start (dt.datetime): The start date of the report.
        end (dt.datetime): The end date of the report.
    Returns:
        dict: A dictionary containing the commission report data.
    """
    rules = load_weekday_commission_rules()
    sales = (
        Sale.objects.filter(sold_at__date__gte=start, sold_at__date__lte=end)
        .select_related("seller")
        .prefetch_related("items__product")
    )

    totals = defaultdict(lambda: ZERO)
    sales_totals = defaultdict(lambda: ZERO)
    sellers = {}
    grand_total = ZERO
    for sale in sales:
        commission = sale_commission(sale, rules)
        totals[sale.seller_id] += commission
        sales_totals[sale.seller_id] += sale.total
        sellers[sale.seller_id] = sale.seller
        grand_total += commission

    rows = [
        {
            "seller": sellers[seller_id],
            "total": totals[seller_id],
            "total_sales": sales_totals[seller_id],
        }
        for seller_id in totals
    ]
    rows.sort(key=lambda row: row["seller"].name)

    return {"sellers": rows, "total": grand_total}
