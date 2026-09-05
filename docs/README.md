# Documentation Index

Project rules and standard stack are defined in `CLAUDE.md` at the repository root.

| Folder          | Purpose                                             | Examples                                                      |
| --------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| `architecture/` | How the system is built                             | `overview.md`, `backend.md`, `infrastructure.md`              |
| `domain/`       | Business concepts common to e-commerce              | products, orders, customers, payments                         |
| `decisions/`    | Significant architectural decisions (ADRs)          | `ADR-002-standard-stack.md`                                   |
| `development/`  | How we work. Detailed rules kept out of `CLAUDE.md` | `constraints.md`, `testing.md`, `git.md`, `ci-cd.md`          |
| `integrations/` | How each standard integration works                 | `r2.md`, `resend.md`, `wompi.md`, `cloudflare.md`, `umami.md` |
| `features/`     | Temporary or feature-specific documentation         | `product-personalization.md`                                  |

## What we document

Document what helps make a decision, understand the architecture or repeat a process.

## Where to start

1. `CLAUDE.md` - purpose, standard stack, rules.
2. `architecture/overview.md` - how the system is composed.
3. `decisions/README.md` - what has already been decided and why.
4. `development/workflow.md` - how changes are made.
