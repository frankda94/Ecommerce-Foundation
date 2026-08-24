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

## 4. Errors follow a defined taxonomy

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
