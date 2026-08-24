# Architecture Overview

## 1. Purpose

Define the high-level architecture of the E-commerce Foundation.

The Foundation provides the backend commerce platform, standard infrastructure, integrations and development conventions required to build and deploy B2C e-commerce applications.

The frontend is external to the Foundation and may vary for each store.

## 2. Architecture

```text
                    Customer
                        │
                        ▼
                 Store Frontend
                        │
                        ▼
                   Vendure API
                        │
                        ▼
              Vendure Commerce Core
                        │
      ┌─────────────────┼─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼
 PostgreSQL           Redis       External Services
                                          │
                              ┌───────────┼───────────┐
                              ▼           ▼           ▼
                        Cloudflare R2  Resend       Wompi
```

## 3. Main Components

### 3.1 Frontend

The frontend belongs to the individual store.
It is not part of the Foundation and may use a different implementation or design for each store.
The frontend communicates with Vendure through its public APIs.

### 3.2 Vendure

Vendure is the core commerce backend.
It provides the main e-commerce capabilities, including:

- Products and variants
- Customers
- Carts
- Orders
- Payments
- Shipping
- Inventory
- Promotions
- Authentication

The Foundation should use Vendure's native capabilities whenever they satisfy the requirement.
Custom implementations should only be introduced when there is a clear technical or business requirement.

### 3.3 PostgreSQL

PostgreSQL is the primary database for the commerce backend.
Commerce data must be persisted in PostgreSQL unless a specific architectural decision defines otherwise.

### 3.4 Redis

Redis is part of the standard infrastructure.
It may be used for caching, background jobs and other use cases where it provides a clear technical benefit.

**Redis should not be introduced into a feature without a defined need.**

### 3.5 Cloudflare R2

Cloudflare R2 is the standard object storage for product images and other persistent application assets.

### 3.6 Resend

Resend is the standard email delivery provider for transactional and application emails.

### 3.7 Wompi

Wompi is the standard payment provider.
Payment-related logic should integrate with Vendure's payment architecture rather than bypassing it.

### 3.8 Docker

Docker is the standard containerization technology.
Application services should be reproducible through containerized environments.

### 3.9 Caddy

Caddy is the standard reverse proxy.
It is responsible for routing external traffic to the appropriate application services and managing TLS.

### 3.10 Cloudflare

Cloudflare is the standard DNS, CDN and security layer.
It sits in front of the production infrastructure where applicable.

### 3.11 GitHub Actions

GitHub Actions is the standard CI/CD platform.
It is responsible for automating validation, testing and deployment according to the project's CI/CD workflow.

### 3.12 Oracle Cloud

Oracle Cloud Always Free ARM64 is the standard deployment target.
Production infrastructure should be designed to operate within the defined Oracle Cloud resources unless an approved architectural decision requires otherwise.

### 3.13 Umami Cloud

Umami Cloud is the standard analytics platform.
Analytics should remain independent from the commerce backend.

## 4. Infrastructure Flow

```text
                Internet
                    │
                    ▼
                Cloudflare
                    │
                    ▼
                  Caddy
                    │
                    ▼
            Docker Containers
                    │
            ┌───────┴───────┐
            ▼               ▼
         Vendure        Services
            │
      ┌─────┴─────┐
      ▼           ▼
 PostgreSQL     Redis
```

Persistent product assets are stored in Cloudflare R2.
Transactional emails are delivered through Resend.
Payments are processed through Wompi through Vendure's payment architecture.

## 5. Architectural Principles

Architectural rules are defined in `CLAUDE.md` (Rules) and in the accepted ADRs
under `docs/decisions/`. They are not repeated here.
