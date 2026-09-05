# ADR-002: Standard Stack

## Status

Accepted

## Context

The Foundation is intended to standardize the technical stack used
across e-commerce projects.

Standardizing the stack reduces repeated architectural decisions,
simplifies development and makes deployment more predictable.

## Decision

The Foundation will use the following standard stack:

| Area                 | Technology                     |
| -------------------- | ------------------------------ |
| Commerce             | Vendure                        |
| Language             | TypeScript                     |
| Database             | PostgreSQL                     |
| Cache / Jobs         | Redis                          |
| Storage              | Cloudflare R2                  |
| Email                | Resend                         |
| Payments             | Wompi                          |
| Containerization     | Docker                         |
| Reverse Proxy        | Caddy                          |
| CDN / DNS / Security | Cloudflare                     |
| CI/CD                | GitHub Actions (ubuntu-24.04-arm) |
| Container Registry   | GHCR                           |
| Deployment           | Oracle Cloud Always Free ARM64 |
| Uptime Monitoring    | UptimeRobot                    |
| Cron Monitoring      | Healthchecks.io                |
| Alerts               | Telegram                       |
| Analytics            | Umami Cloud                    |
| AI Development       | Claude Code                    |

The standard stack should not be changed for individual stores unless
there is a justified requirement and the change is explicitly approved.

## Consequences

New stores can reuse the same technical decisions and infrastructure
patterns.

The number of architectural decisions required for each new store is
reduced.

Changes to the standard stack may affect multiple projects and must
therefore be evaluated carefully.
