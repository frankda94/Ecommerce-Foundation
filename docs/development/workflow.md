# Development Workflow

## 1. Purpose

Define the standard workflow for developing changes in the E-commerce Foundation.

The workflow is designed to make development predictable, reviewable and reproducible across e-commerce projects.

## 2. Workflow

Every significant change should follow this process:

```text
Requirement
    ↓
Context
    ↓
Plan
    ↓
Implementation
    ↓
Testing
    ↓
Review
    ↓
Documentation
```

### 2.1 Requirement

Understand what needs to be built or changed.

Before writing code:

- Identify the business requirement.
- Identify the expected behavior.
- Identify affected areas.
- Identify risks.
- Identify existing Vendure capabilities that may solve the requirement.

Do not start implementation when the requirement is unclear.

### 2.2 Context

Before modifying the codebase, inspect the relevant project context.

The developer or Claude Code should:

- Read the relevant documentation.
- Inspect existing implementations.
- Identify related modules and services.
- Check existing tests.
- Identify relevant architectural decisions.

Do not assume that a new implementation is required before checking what already exists.

### 2.3 Plan

Create a short implementation plan before making significant changes.

The plan should contain:

- What will change.
- Which files or modules are affected.
- How the change will work.
- How it will be tested.

For small and obvious changes, a separate written plan is not required.

### 2.4 Implementation

Implement the approved plan.

Rules:

- Follow existing project conventions.
- Prefer Vendure native capabilities.
- Reuse existing code when appropriate.
- Avoid unnecessary dependencies.
- Keep changes focused.
- Do not modify unrelated code.

### 2.5 Testing

Every change must be validated according to its impact.

Testing may include:

- Unit tests
- Integration tests
- End-to-end tests
- Type checking
- Linting
- Build validation

The appropriate level of testing depends on the change.

### 2.6 Review

Before considering the change complete, verify:

- The implementation matches the requirement.
- Tests pass.
- No unnecessary code was introduced.
- No unrelated files were modified.
- Existing functionality was not unintentionally affected.
- Documentation is updated when required.

### 2.7 Documentation

Documentation should be updated only when the change introduces knowledge that should be preserved.

Examples include:

- Architectural decisions
- New integrations
- New reusable patterns
- Significant domain changes
- Operational procedures

Documentation must be concise, precise and actionable.

## 3. Small Changes

Small and low-risk changes may use a simplified workflow:

```text
Context
    ↓
Implementation
    ↓
Testing
    ↓
Review
```

Examples:

- Typo fixes
- Small refactors
- Minor configuration changes
- Simple bug fixes

## 4. Significant Changes

Changes that affect architecture, domain behavior, infrastructure, security or external integrations should use the complete workflow.

```text
Requirement
    ↓
Context
    ↓
Plan
    ↓
Implementation
    ↓
Testing
    ↓
Review
    ↓
Documentation
```

## 5. Completion Criteria

A change is considered complete when:

- The requirement is satisfied.
- Relevant tests pass.
- The implementation follows project conventions.
- No unintended changes remain.
- Required documentation has been updated.
- The change is ready for CI/CD.
