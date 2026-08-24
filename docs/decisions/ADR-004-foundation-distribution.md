# ADR-004: Foundation Distribution

## Status

Accepted

## Context

The Foundation must be reusable across stores without being copied into each
repository. Each store needs its own Vendure plugins and configuration, so the
Foundation cannot be a fixed runtime configured only through environment variables.

Alternatives considered:

- **npm package of plugins**: the store owns the Dockerfile and repeats the runtime,
  base image and build setup in every project.
- **Monorepo with all stores**: couples release cycles and breaks store isolation.
- **Template repository**: the Foundation is copied at creation time and never
  receives upstream fixes.

## Decision

The Foundation is distributed as a versioned base Docker image.

Each store builds its own image with:

```dockerfile
FROM foundation:x.y.z
```

and adds its `vendure-config.ts`, its store-specific plugins and its assets.

Rules:

- The base image provides the runtime, the Vendure core, shared plugins and the entrypoint.
- The store provides configuration, catalog-specific plugins and branding.
- The image is versioned with semver. `x.y.z` is the version of the Foundation.
- Stores pin an exact version. `latest` is not used in production.
- The image is built for `linux/arm64`, the deployment target.
- Images are built in GitHub Actions on `ubuntu-24.04-arm` runners (native ARM64, no emulation).
- Images are published to GHCR, versioned by tag. The production host only pulls.

## Consequences

Stores receive Foundation fixes by bumping one version and rebuilding.

The Foundation gains release obligations: semver discipline, a changelog and an
upgrade path between versions.

Risks accepted:

- **A breaking change in the base image breaks every store that bumps it.** Mitigated
  by semver and by stores pinning exact versions.
- **GHCR access from the production host requires a token.** A leaked or expired token
  blocks deployments. It is a secret with rotation, not a fixed value.
- **On a private repository the ARM runner has 2 vCPU instead of 4** and consumes the
  plan's free minutes. Builds are slower and the minute quota is a real limit.
- **Building on the production host would compete for its 2 vCPU and degrade the store.**
  Building in CI is mandatory, not a preference.
