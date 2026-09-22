# Sales & Commission Management System

A full-stack application for a stationery store to **register sales** and **calculate
seller commissions** based on per-product commission percentages and
configurable per-weekday limits over a given date range.

The project is split into two independent applications:

| Directory    | Stack                                      | Purpose                          |
| ------------ | ------------------------------------------ | -------------------------------- |
| [`backend/`](backend/README.md) | Django 6 + Django REST Framework + SimpleJWT | REST API, data model, business rules |
| [`frontend/`](frontend/README.md) | React 19 + TypeScript + Vite + Bootstrap 5   | Single-page admin application    |

## Core features

- **Sales management** — create, edit, list and delete sales (invoice number,
  date/time, customer, seller, and one or more products with quantities).
- **Catalog** — products, customers and sellers with full CRUD via API and admin.
- **Commission rules** — each product carries a commission percentage (0–10%);
  each weekday can define min/max limits that clamp the effective percentage.
- **Commission report** — for any date range, lists each seller's total sales and
  total commission owed, plus an overall total.
- **JWT authentication** — `dj-rest-auth` + SimpleJWT login flow consumed by the SPA.

> Commission is always computed on the fly from configured rules — it is never
> persisted, so changing a weekday limit immediately affects future reports.

## Tech stack

**Backend** — Python 3.14, Django 6.1, Django REST Framework, SimpleJWT,
dj-rest-auth, python-dotenv, managed with `uv`. Tests use Django's test runner;
linting/formatting via Ruff.

**Frontend** — React 19, TypeScript, Vite, React Router 7, React Bootstrap 5,
Axios (with JWT refresh interceptor), react-datepicker, date-fns. Linting via Oxlint.

## Repository layout

```
sme_project/
├── backend/            # Django project (core) + sales app
├── frontend/           # Vite + React SPA
├── docs/
│   ├── guidelines/     # 12-factor, SOLID, git best practices
│   └── GIT SME.md      # Challenge specification
└── LICENSE
```

## Getting started

### Prerequisites

- **Python 3.14+** and [uv](https://docs.astral.sh/uv/) (used to manage the venv)
- **Node.js 20+** and npm

### 1. Run the backend

```bash
cd backend
uv sync                 # install dependencies into .venv
uv run python manage.py migrate     # apply schema + seed demo data
uv run python manage.py seed_superuser  # creates admin / admin
uv run python manage.py runserver   # http://localhost:8000
```

Four settings pages in the Django admin (`/admin/`) cover products, customers,
sellers, weekday commission limits and sales:

- Admin URL: <http://localhost:8000/admin/> — login with `admin` / `admin`

Database migrations automatically seed demo products, customers, sellers,
weekday commission rules and a handful of sales so the app is usable immediately.

See **[backend/README.md](backend/README.md)** for API endpoints, architecture
and testing.

### 2. Run the frontend

```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

The Vite dev server proxies all `/api` requests to `http://localhost:8000`,
so no CORS setup is required locally. Open <http://localhost:5173> and log in
with `admin` / `admin`.

See **[frontend/README.md](frontend/README.md)** for the folder architecture and
development workflow.

## Documentation

- [**Backend README**](backend/README.md) — models, API surface, services, testing
- [**Frontend README**](frontend/README.md) — folder structure, data flow, scripts
- [**Engineering guidelines**](docs/guidelines/) — 12-factor app, SOLID, and git best practices
- [**Challenge specification**](docs/GIT%20SME.md) — original requirements

## License

See [LICENSE](LICENSE).