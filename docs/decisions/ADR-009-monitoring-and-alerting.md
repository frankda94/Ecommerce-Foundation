# ADR-009: Monitoring and Alerting

## Status

Accepted

## Context

ADR-005 accepts a single host with no replica and no failover, so availability depends
on how long it takes to notice that something is down.

The failures that matter here are silent. Redis down does not fail fast (ADR-008): reads
keep answering and only the mutations that enqueue a job hang, with no error. The worker
is outside the customer's request path, so if it stops, the site looks healthy and the
confirmation emails simply never go out. And the backup is a scheduled task (ADR-006):
one that never ran produces nothing to alert on. In all three cases the signal is
silence, not an error.

Two constraints shape the answer. The host has 2 vCPU (ADR-005), so a self-hosted metrics
stack does not fit. And in `@vendure/core` 3.7.2 the `/health` endpoint returns a fixed
`{ "status": "ok" }`: application-level health checks (`systemOptions.healthChecks` and
its strategies) are deprecated and removed in v4.0.0, with Vendure's own guidance being
to check dependencies from the infrastructure.

## Decision

Monitoring is split by what each side can see, because neither covers the other.

**From outside**, UptimeRobot probes the public URL. It is the only thing that proves the
whole chain works for a customer: DNS, Cloudflare, Caddy, the TLS certificate and the
server. A container can be healthy while the certificate is expired.

**From inside**, cron jobs on the host check what has no public URL, and ping
Healthchecks.io only when they pass. The alert is the missing ping, which is what catches
a job that was disabled or a host that is off.

| Check | How | Threshold |
| --- | --- | --- |
| Public chain reachable | UptimeRobot on `GET /health`, every 5 min | 2 consecutive failures |
| Containers healthy (server, worker, postgres, redis) | Host cron -> Healthchecks.io | No ping in 5 min, 5 min grace |
| Container restarts | Host cron -> Healthchecks.io | 3 within one hour |
| Disk usage | Host cron -> Healthchecks.io | 80% |
| Backup completed | Backup cron (ADR-006) -> ping on success only | No ping within the day |
| restic repository integrity | Weekly `restic check` -> ping | No ping, or check failure |

Rules:

- Every service declares a `healthcheck` in Compose: `pg_isready`, `redis-cli ping`, and
  `GET /health` for server and worker. The cron reads those, it does not reimplement them.
- The worker's health endpoint is started explicitly with
  `worker.startHealthCheckServer({ port })` in `src/index-worker.ts`. Vendure does not
  start it by default.
- `systemOptions.healthChecks` stays empty. The application does not check its own
  dependencies, and a non-empty array logs a deprecation warning on every boot.
- No monitor runs inside what it watches, and no local check alerts on its own. A watcher
  that dies with the watched reports nothing.
- Monitored routes stay public and unauthenticated. A monitor pointed at a protected route
  reports a permanent outage, and a monitor always in red stops being looked at.
- Every alert has a written action next to it. One that nobody knows what to do with is
  ignored by the third time it fires.
- Alerts go to Telegram from Healthchecks.io. UptimeRobot's free plan does not integrate
  Telegram (that is the Solo plan, US$9/month), so public downtime arrives by email.

## Consequences

The host, the four containers, the public chain and any scheduled task that stops running
are all covered, with no extra service competing for the host's 2 vCPU.

Risks accepted:

- **A green `/health` does not mean a working store.** It answers `ok` with PostgreSQL
  unreachable and with Redis down. It proves the process answers HTTP, nothing more.
- **A stuck queue is not detected.** Every container can be healthy while jobs pile up
  unprocessed. Detecting that needs a heartbeat through the queue or a check on failed
  jobs; neither is in this ADR.
- **The storefront is not monitored by default.** It belongs to the store, not to the
  Foundation (ADR-001), so a store that does not add its own monitor can be down for
  customers with everything here in green.
- **Alerts are split across two channels**, and public downtime lands on the weaker one.
  Mitigation is a mail rule that pushes it to the phone; revisit when the store has sales.
- **Monitoring depends on free third-party plans with no SLA.** If either provider changes
  its terms, monitoring disappears without notice and nothing on the host reports it.
- **The host cron is installed outside `docker compose up`.** Forget it while provisioning
  a new host and the store runs unmonitored, with no alert about it: a check that was
  never created cannot report its own absence.
- **Detection is slow and shallow.** Around 10 minutes before the first alert, and no
  metrics or history: degradation is invisible and diagnosis starts from the live logs.
