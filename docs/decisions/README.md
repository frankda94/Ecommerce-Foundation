# Architectural Decision Records

An ADR records a significant architectural decision, its context and its consequences.

## Index

| ADR | Title | Status |
| --- | --- | --- |
| [ADR-001](ADR-001-foundation-scope.md) | Foundation Scope | Accepted |
| [ADR-002](ADR-002-standard-stack.md) | Standard Stack | Accepted |
| [ADR-003](ADR-003-vendure-commerce-core.md) | Vendure as Commerce Core | Accepted |
| [ADR-004](ADR-004-foundation-distribution.md) | Foundation Distribution | Accepted |
| [ADR-005](ADR-005-deployment-topology.md) | Deployment Topology | Accepted |
| [ADR-006](ADR-006-backups.md) | Backups | Accepted |
| [ADR-007](ADR-007-deployment-and-migrations.md) | Deployment, Secrets and Migrations | Accepted |

## Rules

- One decision per ADR.
- Numbers are sequential and never reused.
- File name: `ADR-<number>-<kebab-case-title>.md`.
- Use `ADR-TEMPLATE.md` as the starting point.
- Add every new ADR to the index above.
- An ADR is never edited to reverse a decision. Set its status to `Superseded by ADR-<n>`
  and record the new decision in a new ADR.
- Status values: `Proposed`, `Accepted`, `Superseded by ADR-<n>`, `Deprecated`.

## Scope

Write an ADR when a decision affects architecture, the standard stack, external
integrations, infrastructure, security or the development methodology.
Do not write an ADR for implementation details that the code already expresses.
