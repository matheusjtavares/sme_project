# Frontend — React SPA

Single-page admin application (React 19 + TypeScript + Vite) for managing sales
and viewing commission reports against the Django REST API.

## Requirements

- **Node.js 20+** and npm

## Setup & run

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

The Vite dev server proxies every `/api` request to `http://localhost:8000`
(`vite.config.ts`), so no CORS config is needed. Log in with `admin` / `admin`
(see the [backend README](../backend/README.md#running)).

### Scripts

| Script              | Command          | Description                              |
| ------------------- | ---------------- | ---------------------------------------- |
| `dev`               | `vite`           | Dev server with HMR at `:5173`           |
| `build`             | `tsc -b && vite build` | Type-check then production build    |
| `preview`           | `vite preview`   | Serve the production build locally       |
| `lint`              | `oxlint`         | Lint with Oxc's Oxlint (config in `.oxlintrc.json`) |

## Architecture

```
src/
├── api/client.ts        # Axios instance + JWT interceptors
├── auth/                # AuthProvider, AuthContext, RequireAuth, token storage
├── components/          # Reusable UI pieces (Autocomplete, DatePicker, SaleForm, ...)
├── hooks/               # Data-fetching hooks (useSales, useProducts, ...)
├── layouts/             # AppLayout shell (nav, content)
├── pages/               # Route-level pages (Home, Sales, NewSales, EditSales, Commissions, Login)
├── routes/              # Route table
├── services/            # API functions, one module per resource
├── store/               # Reserved for global state (unused so far)
├── styles/              # Global CSS
├── types/               # Shared TypeScript models (mirror API payloads)
├── utils/               # Pure formatting helpers
└── main.tsx / App.tsx   # Entry point + providers
```

### Data flow

```
Page (pages/)  →  Hook (hooks/)  →  Service (services/)  →  api/client.ts  →  /api
```

- **`services/`** owns all HTTP calls — one module per resource
  (`sales.ts`, `products.ts`, `customers.ts`, `sellers.ts`, `commissions.ts`),
  typed against the interfaces in **`types/`**.
- **`hooks/`** wrap services into reusable data state with loading/error
  handling (`useSales`, `useSaleForm`, `useCommissionReport`, ...).
- **`pages/`** compose hooks + components and are never called directly by the
  router logic; `components/` holds presentational pieces.

### Routing

Defined in `routes/index.tsx` and mounted in `App.tsx`:

| Route              | Page        | Access          |
| ------------------ | ----------- | --------------- |
| `/login`           | Login       | Public          |
| `/`                | Home        | Authenticated   |
| `/sales`           | Sales       | Authenticated   |
| `/sales/new`       | NewSales    | Authenticated   |
| `/sales/edit/:id`  | EditSales   | Authenticated   |
| `/commissions`     | Commissions | Authenticated   |

`RequireAuth` guards the layout; unauthenticated users are redirected to `/login`.

### Authentication

JWT flow via `api/client.ts`:

- The request interceptor attaches `Authorization: Bearer <access>` to every
  call (token cached in `localStorage` via `auth/tokens.ts`).
- On a `401`, the response interceptor uses the refresh token once (shared
  `refreshPromise` prevents concurrent refreshes), retries the original request,
  and redirects to `/login` when refresh fails.

> **Dev scaffold**: tokens live in `localStorage` (XSS-exposed). A production
> design would use HTTP-only cookies — see the notes in the
> [backend README](../backend/README.md#authentication).

### Conventions

- Path alias `@/` → `src/` (configured in `vite.config.ts` and `tsconfig*.json`).
- Snake-case API fields are kept as-is in `types/` to match backend payloads.
- Currency formatting lives in one place (`utils/format.ts`, pt-BR).
- Lint with `npm run lint` (Oxlint) before committing; `npm run build` also
  runs `tsc` type-checking.