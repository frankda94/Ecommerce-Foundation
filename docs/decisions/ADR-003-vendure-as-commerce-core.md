# ADR-003: Vendure as Commerce Core

## Status

Accepted

## Context

The Foundation requires a reliable commerce backend that provides
standard e-commerce capabilities while remaining extensible.

Building a custom commerce backend would increase development and
maintenance costs and would duplicate capabilities already provided
by established commerce platforms.

## Decision

Vendure will be the core commerce backend of the Foundation.

The Foundation will use Vendure's native capabilities whenever
possible.

Custom functionality will be implemented only when:

- Vendure does not provide the required capability.
- Configuration cannot adequately solve the requirement.
- There is a clear technical or business justification.

The Foundation will not create parallel domain models for concepts
already provided by Vendure without a documented architectural reason.

## Consequences

The Foundation benefits from Vendure's existing commerce capabilities
and extensibility.

The amount of custom backend code is reduced.

The Foundation remains dependent on Vendure's architecture and
extension mechanisms.

Vendure upgrades must therefore be evaluated as part of the
Foundation maintenance process.
