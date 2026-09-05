# ADR-005: Deployment Topology

## Status

Accepted

## Context

The deployment target is a single Oracle Cloud Always Free ARM64 host with
2 vCPU and 12 GB RAM.

Initial stores have low traffic and no heavy background processing. Deployments
run at night, outside customer hours.

CPU is the constraint, not memory. Node is single-threaded per process, so the
Vendure server and worker consume roughly one core each while PostgreSQL, Redis storefront and Caddy
share what remains.

## Decision

All services run on one host, each in its own container:

| Container        | Role                                                               | `cpus` | `mem_limit` |
| ---------------- | ------------------------------------------------------------------ | ------ | ----------- |
| `caddy`          | Reverse proxy and TLS. The only service exposed to the internet    | 0.5    | 256m        |
| `storefront`     | Store frontend. Belongs to the store, not the Foundation (ADR-001) | 1.5    | 1.5g        |
| `vendure-server` | GraphQL APIs                                                       | 1.5    | 2g          |
| `vendure-worker` | Job queue processing                                               | 0.75   | 1.5g        |
| `postgres`       | Primary database                                                   | 1.0    | 2g          |
| `redis`          | Job queue and cache backend (ADR-008)                              | 0.25   | 2g          |

`cpus` is a ceiling, not a reservation, so the column adds up to more than 2 on purpose:
idle capacity stays usable and no container can monopolise the host. The customer's
request path is Caddy, storefront, `vendure-server` and `postgres`; the worker is the
only service outside it, which is why it gets the lowest ceiling.

Committed memory is 9.25g of 12. The rest is for the OS and for the page cache
PostgreSQL depends on.

There is no staging environment. Changes are validated in production.

Rules:

- The worker runs as a separate container. It is never merged into the server.
- Every service declares explicit `cpus` and `mem_limit` in Compose.
- The `storefront` slot is sized for a server-rendered frontend, which is another Node
  process. A frontend built to static files needs no container: Caddy serves it and the
  slot's 1.5 cpus and 1.5g go back to the host.
- Redis sets `maxmemory` to 1g, half its `mem_limit`. Rewriting the AOF forks, and
  copy-on-write can push RSS towards double the dataset. Below the container limit Redis
  rejects writes; at the container limit the kernel kills it instead.
- Job queue concurrency starts at 1-2 and is raised only with measurements.
- Only Caddy publishes ports. Internal traffic is split in two Docker networks: `edge`
  for Caddy, the storefront and the server; `data` for the server, the worker,
  PostgreSQL and Redis. The server is the only service on both, so nothing reachable
  from the internet has a route to the database or to Redis.

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
- **Redis is a second stateful service on the same two cores**, and a hard startup
  dependency for the server and the worker. Its own risks are in ADR-008.
- **Search reindexing and image processing running together saturate both cores**,
  raising API latency to the point of checkout timeouts. Run them off-hours.
