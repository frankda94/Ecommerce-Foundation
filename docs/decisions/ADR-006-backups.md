# ADR-006: Backups

## Status

Accepted

## Context

ADR-005 accepts a single host with no replica and no failover. Availability
therefore depends entirely on backups and on restore time.

The data that cannot be rebuilt is the PostgreSQL database: orders, payments and
customers. Product assets already live in Cloudflare R2. Application code is
rebuilt from the base image (ADR-004).

## Decision

Backups use restic, encrypted, to Cloudflare R2, in a bucket separate from assets.

- Source: `pg_dump` of the PostgreSQL database. Never a file copy of a running data directory.
- Frequency: daily at 03:00 store time, when CPU is idle.
- The backup window is exclusive. Reindexing and bulk image processing (ADR-005) must
  not be scheduled in it.
- Retention: `--keep-daily 5 --keep-weekly 4 --keep-monthly 3`.
- The restic repository key is stored outside the host. Losing the host must not mean
  losing access to the backups.
- Restores are tested. A backup that has never been restored is not a backup.

## Consequences

Recovery point objective is 24 hours. Recovery time depends on rebuilding the host
and restoring the dump; it is not instantaneous.

Risks accepted:

- **Backups and assets live in the same Cloudflare account.** A suspended or
  compromised account loses both at once. A separate bucket does not mitigate this.
- **Up to 24 hours of orders and payments can be lost.** This is the accepted RPO.
- **Silent corruption may outlive the retention window.** Three months is the limit;
  damage detected later is unrecoverable.
- **`pg_dump` and encryption compete for the host's 2 vCPU.** If a backup overlaps a
  reindex, both slow down and the API degrades. Schedules must not collide.
- **The schedule depends on the host timezone.** If the host runs in UTC, 03:00 is not
  03:00 in Colombia and the backup lands in customer hours. Set the timezone explicitly.
- **If the restic key is lost, every backup is unreadable.** The key is a secret with
  its own custody, independent of the host and of the R2 credentials.
