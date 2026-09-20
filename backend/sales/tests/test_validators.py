import datetime as dt

from django.test import SimpleTestCase

from sales.validators import validate_date_range


def _today():
    return dt.date.today()


class ValidateDateRangeTests(SimpleTestCase):
    def test_valid_range(self):
        valid, message = validate_date_range(_today() - dt.timedelta(days=10), _today())
        self.assertTrue(valid)
        self.assertEqual(message, "Valid Range")

    def test_start_equal_end_is_valid(self):
        valid, _ = validate_date_range(_today(), _today())
        self.assertTrue(valid)

    def test_non_date_start_is_invalid(self):
        valid, message = validate_date_range("2026-01-01", _today())
        self.assertFalse(valid)
        self.assertIn("must be valid dates", message)

    def test_non_date_end_is_invalid(self):
        valid, _ = validate_date_range(_today(), None)
        self.assertFalse(valid)

    def test_missing_both_dates_is_invalid(self):
        valid, message = validate_date_range(None, None)
        self.assertFalse(valid)
        self.assertIn("must be valid dates", message)

    def test_future_start_is_invalid(self):
        valid, message = validate_date_range(_today() + dt.timedelta(days=1), _today())
        self.assertFalse(valid)
        self.assertIn("cannot be in the future", message)

    def test_start_after_end_is_invalid(self):
        valid, message = validate_date_range(_today(), _today() - dt.timedelta(days=1))
        self.assertFalse(valid)
        self.assertIn("must come before End date", message)
