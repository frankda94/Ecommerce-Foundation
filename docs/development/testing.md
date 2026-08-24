# Testing

The workflow (`workflow.md`) requires every change to be validated according to its
impact. This defines what that means.

## Levels

| Level | Applies to |
| --- | --- |
| Type check | Every change. Non-negotiable |
| Lint | Every change |
| Unit | Business logic, custom plugins, pure functions |
| Integration | Anything touching the database, the job queue or Vendure services |
| End-to-end | Checkout, payments and order lifecycle |

## Rules

- Prefer integration tests over mocks when the logic depends on Vendure or PostgreSQL.
  Mocking Vendure services tests the mock, not the system.
- Payment flows are tested against the provider sandbox, never against production.
- A bug fix adds the test that would have caught it.
- Tests run in CI before the image is built. A failure stops the pipeline.

## Risks

- **Untested migrations are the main danger.** Rollback does not revert them (ADR-007),
  so a broken migration is recovered from a dump, not from a redeploy.
- Payment webhooks are hard to test end-to-end and are where silent failures accumulate.
