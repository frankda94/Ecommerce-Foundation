# CI/CD

Pipeline for building and deploying the Foundation. Decisions behind it: ADR-004
(distribution), ADR-007 (deployment, secrets, migrations).

## Build

1. Runs on GitHub Actions, `ubuntu-24.04-arm` runners. Native ARM64, no emulation.
2. Type check, lint and tests. A failure stops the pipeline.
3. Build the image and push to GHCR, tagged with the semver version. `latest` is not
   used in production.

## Deploy

1. Triggered from GitHub Actions against a GitHub Environment.
2. Secrets are injected at this step, never baked into the image.
3. The host pulls the pinned tag from GHCR.
4. The job takes a database dump.
5. Migrations run before the application starts.
6. The stack restarts.

## Rules

- The production host never builds images. Building competes for its 2 vCPU.
- Stores pin an exact image version.
- Rolling back a version with migrations means restoring the pre-deploy dump, not just
  redeploying the previous image (ADR-007).
- Deploy at night, outside customer hours, and outside the backup window (ADR-006).
