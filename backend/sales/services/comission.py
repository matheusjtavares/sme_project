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
        percent = effective_commission_percent(item.product.commission_percent, weekday, rules)
        total += (percent / HUNDRED) * item.quantity * item.unit_price
    return total.quantize(CENTS, rounding=ROUND_HALF_UP)


def _load_weekday_commission_rules():
    return {config.weekday: config for config in WeekdayCommission.objects.all()}


def commission_report(start: dt.datetime, end: dt.datetime) -> dict:
    """Generate a commission report for sales between the given start and end dates.
    Args:
        start (dt.datetime): The start date of the report.
        end (dt.datetime): The end date of the report.
    Returns:
        dict: A dictionary containing the commission report data.
    """
    rules = _load_weekday_commission_rules()
    sales = (
        Sale.objects.filter(sold_at__date__gte=start, sold_at__date__lte=end)
        .select_related("seller")
        .prefetch_related("items__product")
    )

    totals = defaultdict(lambda: ZERO)
    sellers = {}
    grand_total = ZERO
    for sale in sales:
        commission = sale_commission(sale, rules)
        totals[sale.seller_id] += commission
        sellers[sale.seller_id] = sale.seller
        grand_total += commission

    rows = [{"seller": sellers[seller_id], "total": totals[seller_id]} for seller_id in totals]
    rows.sort(key=lambda row: row["seller"].name)

    return {"sellers": rows, "total": grand_total}
