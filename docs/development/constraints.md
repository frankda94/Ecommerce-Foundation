# Development Constraints

Non-negotiable rules for writing code in the Foundation.

## 1. Simplicity first

The correct solution is the one that solves the problem with the fewest moving parts.
Fewer files, fewer abstractions, fewer dependencies. Complexity is added when it is
proven necessary, not in anticipation.

## 2. Follow Vendure conventions before inventing

Use Vendure's plugin API, entities, services, job queue and error results as they are
designed to be used. A custom mechanism that duplicates one Vendure already provides
loses every upgrade and every fix upstream.

## 3. The server never trusts the client

Prices, totals, stock, discounts, permissions and order state are decided on the server.
Anything arriving from the client is input to validate, never a fact to accept.

## 4. Money is stored in minor units

Vendure stores every price as an integer and divides by 100 when formatting. This
applies to COP as well, even though Colombian prices are not written with cents.

`$15.000 COP` is stored as `1500000`, not `15000`.

Never do arithmetic on formatted values, and never store a price already divided.

Every payable total is a multiple of 100, because Wompi rejects an amount that does not
end in `00`. `CopMoneyStrategy` (`src/config/money.ts`) enforces this; the payment
handler sends `order.totalWithTax` to `amount_in_cents` unchanged. See ADR-010.

Risk:

- **The `int` column caps any value at ~$21.474.836 COP.** Passing it requires
  `BigIntMoneyStrategy` and a schema migration.

## 5. Migrations

Foundation migrations live in `src/migrations/foundation/`, store migrations in
`src/migrations/store/`. Both are applied through the single `migrations` table.

- `migration:generate` applies pending migrations before diffing. TypeORM compares
  every entity against the database, so generating with a Foundation migration pending
  copies that migration into the store's own file. Both then run and the second fails.
- A store never alters a Foundation table. It adds its own entities through its plugin,
  and uses custom fields for extra data on `order`, `customer` or `product`.
- Store tables and custom fields carry a per-store prefix. A store table named the same
  as one the Foundation adds later collides at deploy time.
- Foundation tables are a public API. Renaming or dropping a column in a minor version
  breaks every store using it.

Risks:

- **The `migrations` table is shared**, so a Foundation migration cannot be reverted in a store on its own. Rollback means restoring the dump (ADR-007).
- **A name collision is not caught by the compiler.** It surfaces when the migration runs.

## 6. Errors follow a defined taxonomy

| Category | Meaning | Handling |
| --- | --- | --- |
| Expected business errors | Part of the contract: out of stock, invalid coupon, illegal state transition | Vendure `ErrorResult` in the GraphQL schema. Not exceptions |
| Client errors | Invalid input, unauthenticated, unauthorized, not found | Explicit and actionable. Never leak internal detail |
| Server errors | Bugs and unexpected failures | Logged with full context. The client gets a generic message and a correlation id |
| External integration errors | Wompi, Resend, R2, network | Distinguish transient from permanent. Transient retries with backoff and idempotency; permanent fails loudly |

Rules:

- Never swallow an error silently.
- Never return a business failure as a `500`, and never return a bug as a business error.
- Payment errors are always logged with the provider reference.

## Risks

- **Treating expected business errors as exceptions** makes the GraphQL contract lie and
  forces the frontend to parse messages instead of reading typed results.
- **Retrying a payment call without idempotency charges the customer twice.**
- **Leaking internal errors to the client** exposes stack traces, queries and structure.
