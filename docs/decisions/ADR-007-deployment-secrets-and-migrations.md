# ADR-007: Deployment, Secrets and Migrations

## Status

Accepted

## Context

Deployment targets a single host (ADR-005) running images built in CI and published
to GHCR (ADR-004). Two things were undefined: where secrets live and when database
migrations run.

## Decision

**Secrets** live in GitHub Environments and are injected at deploy time.

- Never baked into the image. Never committed to the repository.
- Each environment holds its own values.
- The runner is GitHub-hosted (ADR-002), not self-hosted on the target server, so it
  cannot read the secrets locally on the host. They reach the server over SSH, pushed
  by the deploy job as part of the same step that writes the `.env` file consumed by
  Compose.

**Deployment** is triggered from GitHub Actions. The host pulls a pinned image tag
from GHCR and restarts the stack.

**Migrations** run before the application starts, on every deployment.

- Image rollback does not revert migrations.
- The deploy job takes a database dump automatically, immediately before migrating.
- Rollback of a version containing migrations means restoring that dump and deploying
  the previous image. Rolling back the image alone is valid only for versions without
  migrations.
- Expand/contract migrations are not required. They are adopted when restoring a dump
  stops being a matter of minutes, or when the server runs more than one instance.

## Consequences

The schema is always ahead of or equal to the running code.

Risks accepted:

- **Rollback of a migrated version costs downtime.** Restoring a dump is slower than
  swapping an image. Accepted because deployments run at night and the dump is minutes old.
- **Any writes between the dump and the rollback are lost.** Minutes, not the 24 hours
  of the nightly backup (ADR-006).
- **The trigger for adopting expand/contract is easy to miss.** As the database grows,
  restore time grows silently until an incident exposes it. Restore time must be measured,
  not assumed.
- **A migration failing halfway leaves an inconsistent schema** and the application does
  not start. The store is down until it is restored.
- **Migrations run at container start.** If the server is ever scaled beyond one
  container, two instances race to migrate the same database.
- **Anyone with write access to the repository can exfiltrate the secrets** through a
  workflow. Environment protection rules and reviewers are the only control.
- **The SSH deploy key carries the same blast radius as the secrets it delivers.**
  It must be dedicated to deployment, restricted to the deploy command, and rotated
  like any other credential in the Environment.
