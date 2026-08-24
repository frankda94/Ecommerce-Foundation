# Git

## Branches

- `main` is always deployable.
- Work happens in short-lived branches merged into `main` via pull request.
- Long-lived branches are not used. They diverge and hide integration problems.

## Commits

- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- One logical change per commit.
- Messages in English, like the rest of the codebase.

## Tags

- The Foundation is released with semver tags: `vX.Y.Z`.
- The tag is what produces the image version in GHCR (ADR-004).
- Tags are never moved or reused. A published version is immutable.

## Rules

- Never commit secrets. They live in GitHub Environments (ADR-007).
- Do not commit generated files, build output or dependencies.
