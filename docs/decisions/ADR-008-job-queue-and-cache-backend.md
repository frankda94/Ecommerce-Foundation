# ADR-008: Job Queue and Cache Backend

## Status

Accepted

## Context

Vendure keeps two kinds of ephemeral state outside the commerce tables: the job queue
and the cache. Both need a backend, and the choice is the same for both.

Background work runs through the job queue: search indexing, collection updates,
transactional emails and scheduled tasks.

Vendure offers two backends for it. `DefaultJobQueuePlugin` stores jobs in the SQL
database and polls for them; each queue queries the database on every `pollInterval`,
and job latency is bounded by that interval rather than by zero. `BullMQJobQueuePlugin`
stores jobs in Redis and receives them by push, with no polling and no `job_record`
table to grow.

The cache is a separate problem. Vendure's default is `InMemoryCacheStrategy`, which
is per process. The server and the worker are separate processes (ADR-005), so each
would hold its own cache and neither would invalidate the other's. Since v3.1 the
session cache uses the configured cache strategy, so sessions would be affected too.
`DefaultCachePlugin` (SQL) and `RedisCachePlugin` both give a single shared cache;
the SQL one turns every cache read and write into a database round trip.

The cost of Redis is a stateful service: another container competing for CPU on a
2 vCPU host, its own durability configuration, and a hard startup dependency for the
worker.

## Decision

The job queue and the cache both live in Redis, through `BullMQJobQueuePlugin` and
`RedisCachePlugin`.

Rules:

- One Redis instance and one keyspace for both. They do not collide: BullMQ prefixes
  its keys with `bull:` and the cache with `vendure-cache:`.
- Redis is sized so that it never reaches its memory limit. The numbers belong to the
  deployment topology and live in ADR-005.
- `--appendonly yes` and `--maxmemory-policy noeviction` are the backstop, not the
  sizing. AOF answers a different question than memory: without it a restart replays the
  last RDB snapshot, up to an hour old by default, and every job queued since is gone.
  `noeviction` decides what happens if the limit is reached anyway, and it applies to the
  whole instance: cache and jobs cannot be given different policies, so evicting only the
  cache would take a second Redis.
- `DefaultSchedulerPlugin` must remain in the configuration. Scheduled tasks do not
  run without it.
- The in-memory cache default is never used. It is silently wrong with a separate
  worker process.
- Redis is never exposed outside the `data` network (ADR-005), and it requires a
  password. Job payloads carry the serialized request context, session token included.

## Consequences

Jobs are delivered by push, so there is no polling load on PostgreSQL and no job table
to grow. The cache is shared across processes without a database round trip per
operation. Sessions survive a process restart.

The queue is no longer part of the PostgreSQL dump. Recovering it after a restore is a
manual step, defined in [ADR-006](ADR-006-backups.md).

Risks accepted:

- **A wrong eviction policy loses jobs with no error.** If Redis is reconfigured with
  `allkeys-lru` and reaches `maxmemory`, BullMQ keys are evicted like any other and
  nothing reports it: the jobs simply never run.
- **Redis durability is weaker than PostgreSQL's.** AOF with the default `everysec`
  fsync can lose up to one second of writes on a hard crash. Acceptable for jobs and
  cache, never for commerce data.
