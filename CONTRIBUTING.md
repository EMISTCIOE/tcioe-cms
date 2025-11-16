# Contributing Guidelines

Thank you for your interest in contributing! Please review these guidelines before you begin.

---

## Commit Guidelines

### Commit Message Format

Use: `type(scope): message`

**Types:**

- `fix`: Bug fix
- `feat`: New feature
- `docs`: Documentation update
- `style`: Code formatting only
- `test`: Adding or fixing tests
- `chore`: Tooling or configuration
- `refactor`: Code restructuring without behavior changes

**Examples:**

- `feat: add dark mode toggle`
- `style: fix header alignment`
- `fix: handle error in form submission`
- `test: add unit tests for user service`
- `docs: update README with setup instructions`
- `refactor: simplify user authentication logic`
- `chore: update dependencies to latest versions`

---

### Linting, Formatting & Type Safety

We use `eslint`, `prettier`, and `typescript` to ensure quality and consistency.

**Pre-commit automatically runs:**

- `yarn lint-staged` — lint & format staged files

**You can run manually anytime:**

- `yarn format` — format entire codebase
- `yarn lint-staged` — lint & format changed files
- `yarn lint` — full eslint scan

Fix all issues before committing.

---

## Issues

### Creating an Issue

- Search existing issues before creating a new one.
- Use issue templates and fill required fields.
- Add appropriate labels (`bug`, `feature`, etc.).

### 🛠️ Working on an Issue

- Work only on assigned issues.
- Request assignment by commenting if unassigned.
- One issue at a time unless approved otherwise.

### Closing an Issue

- Reference issues in PRs with `Closes #123` to auto-close.

---

## Pull Requests

### Creating a PR

- Target the `dev` branch.
- Only create a PR if assigned to the issue.
- Ensure PR passes linting, type-check, and build steps.

### PR Title Format

- PR titles follow the same format as commit messages to keep things consistent and readable.

---

## PR Review Etiquette

### DOs

- Be kind, clear, and constructive.
- Use inline suggestions when possible.

### DON'Ts

- Don’t duplicate feedback.
- Avoid rude or aggressive comments.

---

## Final Checklist

- [ ] Code builds and runs properly.
- [ ] PR title is clear and follows the format and links related issue(s).

Thank you for contributing! Let’s build something awesome

---
