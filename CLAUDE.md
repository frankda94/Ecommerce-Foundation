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

| Layer            | Technology         |
| ---------------- | ------------------ |
| Commerce         | Vendure            |
| Language         | TypeScript         |
| Database         | PostgreSQL         |
| Cache / Jobs     | Redis              |
| Storage          | Cloudflare R2      |
| Email            | Resend             |
| Payments         | Wompi              |
| Containerization | Docker             |
| Reverse Proxy    | Caddy              |
| CDN / DNS / Sec. | Cloudflare         |
| CI/CD            | GitHub Actions     |
| Deployment       | Oracle Cloud ARM64 |
| Analytics        | Umami Cloud        |
| AI Development   | Claude Code        |

The standard stack must not be changed without explicit approval.

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
- Comments must be written in Spanish just if the code is very very important.
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
-