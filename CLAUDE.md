# E-commerce Foundation

## 1. Purpose

This project is a reusable technical foundation and development methodology
for building and deploying B2C e-commerce applications for physical products.
The Foundation is based on Vendure and is designed to be reused across
different stores, brands, catalogs and product categories.
The Foundation must not be coupled to a specific store, brand or catalog.

## 2. Objectives

The Foundation aims to:

- Reuse architecture across e-commerce projects.
- Reuse common code, integrations and configurations.
- Standardize infrastructure and deployment.
- Standardize development, testing and CI/CD practices.
- Use Claude Code through a structured development methodology.
- Allow each store to have its own frontend and business-specific requirements.
- Minimize custom code when Vendure already provides the required capability.
- Reduce the time required to launch new stores.
- Keep the Foundation independent from specific brands, catalogs and product categories.
- Create a repeatable methodology for taking a new store from initial setup to production.

Foundation
│
├── Architecture
├── Standard Stack
├── Code
├── Infrastructure
├── Integrations
├── Claude Code
└── Documentation
│
▼
REPEATABLE METHODOLOGY
│
▼
New Store → Production

## 3. Standard Stack

| Layer                | Technology                        |
| -------------------- | --------------------------------- |
| Commerce             | Vendure                           |
| Language             | TypeScript                        |
| Database             | PostgreSQL                        |
| Cache / Jobs         | Redis                             |
| Storage              | Cloudflare R2                     |
| Email                | Resend                            |
| Payments             | Wompi                             |
| Containerization     | Docker                            |
| Reverse Proxy        | Caddy                             |
| CDN / DNS / Security | Cloudflare                        |
| CI/CD                | GitHub Actions (ubuntu-24.04-arm) |
| Container Registry   | GHCR                              |
| Deployment           | Oracle Cloud Always Free ARM64    |
| Uptime Monitoring    | UptimeRobot                       |
| Cron Monitoring      | Healthchecks.io                   |
| Alerts               | Telegram                          |
| Analytics            | Umami Cloud                       |
| AI Development       | Claude Code                       |

The standard stack must not be changed without explicit approval.
Rationale and full record: `docs/decisions/ADR-002-standard-stack.md` (source of truth).

## 4. Architecture

The Foundation provides the backend commerce layer, infrastructure and development methodology.
The frontend is outside the Foundation and may vary for each store.

High-level architecture:

Frontend
→ Vendure
→ PostgreSQL

Additional infrastructure and services are defined by the Standard Stack.
Detailed architecture: docs/architecture/

## 5. Rules

- Do not couple the Foundation to a specific store or product category.
- Prefer native Vendure capabilities before implementing custom solutions.
- Do not introduce unnecessary dependencies.
- Do not change the Standard Stack without approval.
- Do not change architectural decisions without approval.
- Do not modify unrelated code.
- Keep changes small and testable.
- Significant architectural decisions must be documented.
- Do not modify this file without explicit approval.

## 6. Internal Rules

- All source code must be written in English.
- Code identifiers must be written in English.
- Comments must be written in English.
- Comment only non-obvious logic; do not comment what the code already states.
- Documentation must be concise, precise and actionable.
- Avoid unnecessary documentation.
- Do not introduce dependencies without justification.

## 7. Context Management

- Use only the context relevant to the current task.
- Inspect existing code before proposing new implementations.
- Treat the codebase as the source of truth for current implementation.
- Treat ADRs as the source of truth for accepted architectural decisions.
- Avoid unnecessary context and documentation.
- Document significant architectural decisions in `docs/decisions/`.

## 8. New Implementation

To implement new features follow `docs/development/workflow.md`

## 9. Documentation

- **Architecture** → `docs/architecture/`
- **Domain** → `docs/domain/`
- **Decisions** → `docs/decisions/`
- **Development** → `docs/development/`
- **Features** → `docs/features/`
- **Integrations** → `docs/integrations/`

Full index: `docs/README.md`

Rules:

- Do not duplicate content across documents; link to the owning document instead.
- The code explains **how** it works; documentation explains **why** it works that way
  and how to work with it.
- One decision per ADR. An ADR records only its own context, decision and consequences;
  whatever follows from another decision belongs to that ADR and is linked from this one.
- A committed ADR is never edited to reverse a decision. Set its status to
  `Superseded by ADR-<n>` and record the new decision in a new ADR. An ADR that has not
  been committed yet is a draft and may be edited or replaced freely.
- Do not create a document just because a folder exists. Folders are empty until there
  is something worth writing. Risk of ignoring this: dozens of Markdown files that duplicate the code, go stale, and get loaded as context in every session without adding value.
