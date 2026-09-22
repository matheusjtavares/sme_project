# Backend — Django REST API

Django 6 application exposing a REST API for products, customers, sellers, sales
and the commission report. Business rules (especially commission calculation)
live in a dedicated **service layer** independent of HTTP concerns.

## Requirements

- Python **3.14+**
- [uv](https://docs.astral.sh/uv/) — dependency & virtualenv management
  (a `.python-version` and `uv.lock` are committed)

## Setup

```bash
cd backend
uv sync                     # create .venv and install locked dependencies
```

Environment is read from environment variables (12-factor). A `.env` file placed
at **the repository root** is loaded automatically (`load_dotenv`). There is no
required configuration for local development — sensible defaults apply.

| Variable                          | Default                              | Purpose                                  |
| --------------------------------- | ------------------------------------ | ---------------------------------------- |
| `DATABASE_URL`                    | `sqlite:///db.sqlite3`               | `sqlite` or `postgres`/`postgresql` URLs  |
| `DJANGO_SECRET_KEY`               | dev-only fallback                    | **Must** be set in production            |
| `DJANGO_DEBUG`                    | `1` (`true`/`1`/`yes`/`on`)          | Django debug mode                        |
| `DJANGO_ALLOWED_HOSTS`            | `localhost,127.0.0.1`                | Comma-separated hosts                    |
| `DJANGO_TIME_ZONE`                | `UTC`                                | Timezone                                 |
| `JWT_ACCESS_LIFETIME_MINUTES`     | `60`                                 | Access token lifetime                    |
| `JWT_REFRESH_LIFETIME_DAYS`       | `7`                                  | Refresh token lifetime                   |
| `DJANGO_EMAIL_BACKEND`            | console backend                     | Email backend                            |
| `DJANGO_SUPERUSER_*`              | `admin` / `admin@example.com` / `admin` | Credentials for `seed_superuser`     |

## Running

```bash
uv run python manage.py migrate          # apply schema + seed demo data
uv run python manage.py seed_superuser   # idempotent admin account (admin / admin)
uv run python manage.py runserver        # http://localhost:8000
```

- API root: <http://localhost:8000/api/>
- Admin: <http://localhost:8000/admin/>
- Health check: `GET /api/health/` → `{"status": "ok"}`

The migrations `sales/0002_seed_core_data` and `sales/0003_seed_sales` seed
demo products, customers, sellers, weekday commission rules and sample sales, so
the API is usable right after `migrate`.

## Testing & quality

```bash
uv run python manage.py test sales      # run the test suite
uv run ruff check .                     # lint (isort, pyflakes, pylint, ...)
uv run ruff format .                    # auto-format
```

Tests live in `sales/tests/` with shared factories in `sales/tests/base.py`.
Run the full suite with `uv run python manage.py test`.

## Architecture

```
core/                   # Django project configuration
├── settings.py         # env-driven settings (12-factor)
├── urls.py             # routes /admin, /api/auth (dj-rest-auth), /api (sales)
└── management/commands/seed_superuser.py

sales/                  # the single business app
├── models.py           # ORM models
├── serializers.py      # DRF serializers (validations, invoice-number generation)
├── views.py            # ModelViewSets + CommissionReportView + health
├── urls.py             # router registrations
├── validators.py       # shared, framework-agnostic validation helpers
├── services/           # business logic (commission calculation)
│   └── commission.py
├── admin.py            # Django admin registrations
└── tests/              # unit & API tests
```

### Layering

Requests flow through **views → serializers → models**, while business rules
live in **`sales/services/`**:

- `views.py` only wires HTTP → serializers/services (thin).
- `services/commission.py` owns all commission math and the report aggregation,
  keeping rules out of models and serializers (SOLID — Single Responsibility).
- `validators.py` holds reusable validation helpers independent of DRF/Django.
- Serializers handle input/output shape, nested sale items, and the
  auto-generation of invoice numbers (`NF-{year}-{seq:04d}`).

### Config & dependency principles

- Settings are environment-driven (12-factor): database, secret key, JWT
  lifetimes, allowed hosts are all configurable via env vars.
- Dependencies are declared in `pyproject.toml` and pinned via `uv.lock`.
- Logging writes to stdout as an event stream (12-factor factor XI).

## Data model

| Model                | Fields                                                                      | Notable behavior                                   |
| -------------------- | --------------------------------------------------------------------------- | -------------------------------------------------- |
| `Product`            | `code` (unique), `description`, `unit_price`, `commission_percent` (0–10%)  | Ordered by `code`                                  |
| `Customer`           | `name`, `email`, `phone`                                                    |                                                    |
| `Seller`             | `name`, `email`, `phone`                                                    |                                                    |
| `WeekdayCommission`  | `weekday` (unique), `min_percent`, `max_percent`                            | Enforces `min ≤ max` in `clean()`; ISO weekday 0–6 |
| `Sale`               | `invoice_number` (unique), `sold_at`, `customer` (PROTECT), `seller` (PROTECT) | `total` property = Σ items; ordered by `-sold_at` |
| `SaleItem`           | `sale` (CASCADE, related `items`), `product` (PROTECT), `quantity`, `unit_price` | `quantity ≥ 1`                                  |

All money is stored as `Decimal` to avoid floating-point errors.

## API

REST endpoints under `/api/` (JSON). CRUD endpoints are `ModelViewSet`s and
accept `GET`/`POST`/`PUT`/`PATCH`/`DELETE` plus `/id/` detail routes.

| Method | Endpoint                          | Description                                  |
| ------ | --------------------------------- | -------------------------------------------- |
| CRUD   | `/api/products/`                  | Product catalog                              |
| CRUD   | `/api/customers/`                 | Customers                                    |
| CRUD   | `/api/sellers/`                   | Sellers                                      |
| CRUD   | `/api/sales/`                     | Sales with nested items                      |
| GET    | `/api/commission-report/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` | Per-seller sales & commission totals |
| GET    | `/api/health/`                    | Health check                                 |
| POST   | `/api/auth/login/` `{username, password}` | Returns JWT `access` + `refresh`     |
| POST   | `/api/auth/token/refresh/` `{refresh}` | Rotates JWT tokens                       |
| POST   | `/api/auth/logout/`               | Logout (blacklists refresh token)            |

A `Sale` payload looks like:

```json
{
  "sold_at": "2026-09-02T09:30:00Z",
  "customer": 1,
  "seller": 1,
  "items": [{ "product": 3, "quantity": 2 }]
}
```

`invoice_number` is optional — when omitted it is auto-generated from the latest
value. `unit_price` on items always snapshots the product's current price.

### Commission rule

Effective commission per item:

```
clamped % = max(weekday.min, min(product %, weekday.max))   # if a weekday rule exists
amount     = (clamped % / 100) * quantity * unit_price      # rounded half-up to cents
```

A sale's commission is the sum of its items. The report groups that sum and the
total sales value per seller for the requested range.

## Authentication

JWT via **dj-rest-auth + SimpleJWT** is enabled (`USE_JWT=True`).

> **Dev scaffold**: this is an integration/validation setup, not a
> production-grade auth design. JWT tokens are returned in the response body and
> cached in the SPA's `localStorage` (XSS-exposed); there are no HTTP-only
> cookies or CSRF hardening. Treat it as out of scope for production.

Use the `seed_superuser` command (or Django admin's `createsuperuser`) to get a
working account.