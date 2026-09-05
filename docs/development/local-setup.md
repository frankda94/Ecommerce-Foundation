# Local Setup

## Requirements

Node 22 or newer, Docker.

## Steps

```bash
cp .env.example .env      # set COOKIE_SECRET and SUPERADMIN_PASSWORD
npm install
docker compose -f docker-compose.dev.yml up -d
npm run migration:run
npm run populate          # solo la primera vez: idioma, moneda, pais, IVA
npm run dev:server        # in one terminal
npm run dev:worker        # in another
```

Admin UI: `http://localhost:3000/admin`. Shop API: `http://localhost:3000/shop-api`.

## What runs where

PostgreSQL and Redis run in containers. The application runs on the host so that
changes are picked up without rebuilding an image.

Neither the server nor the worker starts without Redis (ADR-008).

In development, assets are written to `static/assets` and emails to
`static/email/output` instead of reaching R2 and Resend.

## Password authentication failed for user "vendure"

`POSTGRES_PASSWORD` is only applied the first time the volume is created. Changing
`DB_PASSWORD` in `.env` afterwards does not change the password inside the database.

Destroy the volume and start again:

```bash
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up -d
npm run migration:run
```

`down -v` deletes the local database. It is safe in development and never on a host
that holds real data.

## Notes

- The database and Redis ports are bound to `127.0.0.1`, not to all interfaces.
- `REDIS_HOST`, `REDIS_PORT` and `REDIS_PASSWORD` come from `.env`. `REDIS_HOST` is
  required: a missing value stops the process at startup.
- `synchronize` is off. Schema changes only happen through migrations (ADR-007).
- `npm run populate` runs once on an empty database. Language, currency (COP), country
  and tax rates are data, not configuration: re-running it on a populated database
  duplicates records.
