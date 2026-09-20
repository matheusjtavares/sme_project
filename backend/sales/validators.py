# This file holds all validations that can be shared
# accross functions within the sales app

import datetime as dt


def validate_date_range(start_date: dt.date, end_date: dt.date) -> tuple[bool, str]:
    """Validate that the date range is valid.
    Args:
        start_date (dt.date): The start date of the range.
        end_date (dt.date): The end date of the range.
    Returns:
        tuple[bool, str]: A tuple containing a boolean indicating if the range is valid and a message describing the result.
    """
    current_date = dt.date.today()
    if not isinstance(start_date, dt.date) or not isinstance(end_date, dt.date):
        return (False, "Invalid Range. Start date and End date must be valid dates")
    if start_date > current_date:
        return (False, "Invalid Range. Start date cannot be in the future")
    if start_date > end_date:
        return (False, "Invalid Range. Start date must come before End date")
    return (True, "Valid Range")
