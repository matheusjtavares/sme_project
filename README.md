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
Axios (with JWT refresh interceptor), react-datepicker, date-fns. Linting via
Oxlint; unit tests via Vitest.

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

## Deploying to Render (free tier)

A [`render.yaml`](render.yaml) blueprint declares the whole stack: a free
PostgreSQL database, the Django API as a Python web service, and the React SPA
as a static site served from the CDN.

### Live deployment

The stack is currently published at (URLs come from [`render.yaml`](render.yaml)):

- **Frontend (SPA):** <https://sme-frontend-7e6j.onrender.com>
- **Backend (API + admin):** <https://sme-backend-u65g.onrender.com>
  - API base: `https://sme-backend-u65g.onrender.com/api`
  - Admin: <https://sme-backend-u65g.onrender.com/admin/>

### Recreating the stack

- In the Render dashboard choose **New > Blueprint** and select this repository.
- Render provisions `<your-project>-backend.onrender.com` (API + admin) and
  `<your-project>-frontend.onrender.com` (SPA), wires up `DATABASE_URL` to the
  internal database URL, and sets `VITE_API_URL` at build time.
- Update the URLs above (plus `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`
  and `CSRF_TRUSTED_ORIGINS` in `render.yaml`) to match the new services.
- The SPA is built with `npm ci && npm run lint && npm run test && npm run build`
  (lint, Vitest suite, then production build). A rewrite rule (`/*` →
  `/index.html`) keeps React Router deep links working; the backend uses
  gunicorn bound to Render's `$PORT`, WhiteNoise for static files, and a health
  check at `/api/health/`.

> The free PostgreSQL instance expires **30 days after creation**. When it
> expires, delete the resources and re-run **New > Blueprint** to recreate them.

Login with `admin` / `admin` (the build command runs `seed_superuser`).

## Documentation

- [**Backend README**](backend/README.md) — models, API surface, services, testing
- [**Frontend README**](frontend/README.md) — folder structure, data flow, scripts, testing
- [**Engineering guidelines**](docs/guidelines/) — 12-factor app, SOLID, and git best practices
- [**Challenge specification**](docs/GIT%20SME.md) — original requirements

## License

See [LICENSE](LICENSE).