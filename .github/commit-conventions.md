# Commit Conventions

This document outlines the commit message conventions for our flight booking API project.

## 📝 Conventional Commits Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Required Elements

- **type**: The type of change being made
- **description**: A brief description of the change (lowercase, no period)

### Optional Elements

- **scope**: The module/area of code being changed
- **body**: Detailed explanation of the change
- **footer**: References to issues, breaking changes, etc.

## 🏷️ Commit Types

| Type       | Description                              | Example                                             |
| ---------- | ---------------------------------------- | --------------------------------------------------- |
| `feat`     | New feature or functionality             | `feat(auth): add JWT token validation`              |
| `fix`      | Bug fix                                  | `fix(redis): resolve connection timeout issues`     |
| `docs`     | Documentation changes                    | `docs(api): update booking endpoint documentation`  |
| `style`    | Code style changes (formatting, etc.)    | `style(booking): fix code formatting in service`    |
| `refactor` | Code refactoring without feature changes | `refactor(tokens): migrate to modular DI approach`  |
| `perf`     | Performance improvements                 | `perf(booking): optimize seat search algorithm`     |
| `test`     | Adding or updating tests                 | `test(airport): add unit tests for airport service` |
| `build`    | Build system or dependency changes       | `build: update TypeScript to version 5.0`           |
| `ci`       | CI/CD configuration changes              | `ci: add GitHub Actions workflow for testing`       |
| `chore`    | Maintenance tasks                        | `chore: update npm dependencies`                    |
| `revert`   | Reverting previous changes               | `revert: revert "feat(auth): add OAuth support"`    |

## 🎯 Scope Guidelines

Use the module or domain name as scope when applicable:

### Domain Scopes

- `airports` - Airport-related changes
- `flights` - Flight-related changes
- `bookings` - Booking-related changes
- `passengers` - Passenger-related changes
- `payments` - Payment-related changes
- `seats` - Seat-related changes
- `auth` - Authentication-related changes

### Infrastructure Scopes

- `redis` - Redis configuration or implementation
- `redlock` - Redlock distributed locking
- `database` - Database configuration or migrations
- `api` - API layer changes
- `infra` - General infrastructure changes

### General Scopes

- `config` - Configuration changes
- `deps` - Dependency updates
- `docker` - Docker configuration
- `scripts` - Build scripts or tooling

## ✅ Good Examples

```bash
# Feature additions
feat(bookings): implement booking confirmation workflow
feat(auth): add role-based access control
feat(redis): add Redis cluster configuration

# Bug fixes
fix(seats): resolve seat availability calculation error
fix(api): handle validation errors in booking controller
fix(redis): resolve connection timeout in cluster mode

# Refactoring
refactor(tokens): migrate from centralized to modular DI tokens
refactor(services): convert use cases to service pattern
refactor(entities): improve booking entity validation logic

# Documentation
docs(readme): update project setup instructions
docs(api): add OpenAPI specification for flights endpoint
docs(architecture): create DDD architecture documentation

# Testing
test(bookings): add integration tests for booking service
test(airports): increase unit test coverage to 90%

# Infrastructure
build(docker): add Redis cluster to docker-compose
ci(github): add automated testing workflow
chore(deps): update NestJS to version 10.0
```

## ❌ Bad Examples

```bash
# Too vague
fix: bug fix
feat: new feature
update: changes

# Not following format
Fix booking bug
Added new feature for users
Updated README file

# Wrong type
feat: fix typo in documentation  # Should be docs:
fix: add new booking feature     # Should be feat:

# Missing scope when applicable
feat: add authentication         # Should be feat(auth):
fix: resolve Redis issues        # Should be fix(redis):
```

## 📋 Body and Footer Guidelines

### Body (Optional)

Use the body to explain **what** and **why**, not **how**:

```
feat(bookings): implement seat selection during booking

Allow passengers to select their preferred seats during the booking
process. This improves user experience and reduces customer service
requests about seat assignments.

Includes validation for seat availability and class restrictions.
```

### Footer (Optional)

Use footer for:

- **Breaking changes**: `BREAKING CHANGE: <description>`
- **Issue references**: `Fixes #123`, `Closes #456`
- **Co-authors**: `Co-authored-by: Name <email>`

```
feat(auth): implement OAuth 2.0 authentication

Add support for OAuth 2.0 authentication with Google and GitHub
providers. This replaces the previous basic authentication system.

BREAKING CHANGE: Basic authentication endpoints have been removed.
All clients must migrate to OAuth 2.0.

Fixes #45
Closes #67
```

## 🚀 Special Cases

### Multiple Changes

If commit contains multiple unrelated changes, consider splitting into separate commits:

```bash
# Instead of:
feat(api): add booking endpoint and fix Redis connection

# Do:
feat(api): add booking endpoint
fix(redis): resolve connection timeout issues
```

### Breaking Changes

Always include `BREAKING CHANGE:` in footer:

```bash
feat(api): redesign booking API endpoints

BREAKING CHANGE: All booking endpoints now require authentication.
Previous anonymous booking is no longer supported.
```

### Work in Progress

Use `wip:` prefix for temporary commits (will be squashed later):

```bash
wip: debugging Redis connection issues
wip: implementing booking validation
```

## 🔧 Tools Integration

### Git Hooks

Consider using tools like:

- **commitizen** - Interactive commit message generator
- **commitlint** - Validate commit messages
- **husky** - Git hooks for validation

### Example commitlint config:

```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "scope-enum": [
      2,
      "always",
      [
        "airports",
        "flights",
        "bookings",
        "passengers",
        "payments",
        "seats",
        "auth",
        "redis",
        "redlock",
        "database",
        "api",
        "infra",
        "config",
        "deps"
      ]
    ]
  }
}
```

## 📖 References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [Semantic Versioning](https://semver.org/)

## 🤝 Team Guidelines

- **Language**: All commit messages must be in **English**
- **Imperative mood**: Use "add" not "added" or "adds"
- **Lowercase**: Description should be lowercase
- **No period**: Don't end description with a period
- **Limit length**: Keep description under 72 characters
- **Be descriptive**: Explain what the commit does, not how it does it
