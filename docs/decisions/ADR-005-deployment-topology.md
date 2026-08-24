# ADR-005: Deployment Topology

## Status

Accepted

## Context

The deployment target is a single Oracle Cloud Always Free ARM64 host with
2 vCPU and 12 GB RAM.

Initial stores have low traffic and no heavy background processing. Deployments
run at night, outside customer hours.

CPU is the constraint, not memory. Node is single-threaded per process, so the
Vendure server and worker consume roughly one core each while PostgreSQL, Redis
and Caddy share what remains.

## Decision

All services run on one host, each in its own container:

| Container        | Role                                                            |
| ---------------- | --------------------------------------------------------------- |
| `caddy`          | Reverse proxy and TLS. The only service exposed to the internet |
| `vendure-server` | GraphQL APIs                                                    |
| `vendure-worker` | Job queue processing                                            |
| `postgres`       | Primary database                                                |
| `redis`          | Job queue backend (BullMQ)                                      |

There is no staging environment. Changes are validated in production.

Rules:

- The worker runs as a separate container. It is never merged into the server.
- Redis is mandatory. The job queue is BullMQ.
- Redis runs with `appendonly yes` and `maxmemory-policy noeviction`.
- Every service declares explicit `cpus` and `mem_limit` in Compose.
- Job queue concurrency starts at 1-2 and is raised only with measurements.
- Only Caddy publishes ports. The rest communicate over the internal Docker network.

## Consequences

A single Compose file describes production and is reproducible across stores.

Risks accepted:

- **No staging environment.** Vendure upgrades and base image bumps are first run in
  production. If one fails and it carried migrations, recovery means restoring a dump
  (ADR-007), not swapping the image back. Accepted deliberately.
- **No high availability.** One host, no replica, no failover. If the VM fails, the
  store is down. Availability depends on backups and restore time. See ADR-006.
- **Merging the worker into the server would let a heavy job block the Node event
  loop** and stop the API from responding. This is why they are separate.
- **`maxmemory-policy allkeys-lru` in Redis silently deletes in-flight jobs.**
  `noeviction` is mandatory.
- **Redis without `appendonly` loses queued jobs on restart**: no emails, no search
  indexing, and no visible error.
- **Redis is a hard startup dependency.** If it does not come up, the worker processes
  nothing.
- **Search reindexing and image processing running together saturate both cores**,
  raising API latency to the point of checkout timeouts. Run them off-hours.
