# ADR-001: Foundation Scope

## Status

Accepted

## Context

The project aims to create a reusable foundation for building multiple
B2C e-commerce applications.

The foundation must accelerate the development and deployment of new
stores without being coupled to a specific brand, catalog or product
category.

## Decision

The Foundation will provide:

- Backend commerce architecture
- Standard infrastructure
- Standard integrations
- Development conventions
- Testing and CI/CD practices
- Claude Code development methodology
- Documentation and architectural standards

The frontend is outside the Foundation and may vary for each store.

The Foundation must remain independent from:

- Specific brands
- Specific stores
- Specific product catalogs
- Specific product categories

Store-specific requirements should remain isolated unless they become
clearly reusable across multiple projects.

## Consequences

New stores can reuse the same technical foundation while maintaining
their own frontend, branding, catalog and business-specific requirements.

The Foundation must be carefully protected from unnecessary
store-specific customizations.
