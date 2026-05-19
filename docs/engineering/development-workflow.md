# Development Workflow

This document defines the recommended engineering workflow for project changes.

## Branching

Use short-lived branches for changes:

```text
main
feature/<short-description>
fix/<short-description>
docs/<short-description>
```

Examples:

```text
feature/product-filter
fix/cart-total-calculation
docs/setup-guide
```

## Commit Messages

Use concise, action-oriented commit messages:

```text
Add product search validation
Fix order status update response
Document local setup steps
```

## Pull Request Flow

1. Create a branch from `main`.
2. Make a focused change.
3. Run the relevant checks locally.
4. Commit only files related to the change.
5. Push the branch.
6. Open a pull request.
7. Review the diff before merging.

## Local Verification

Backend verification:

```bash
cd <backend>
mvn -q test
mvn -q package
```

Frontend verification:

```bash
cd <frontend>
npm run check:auth
npm run build
```

Full acceptance verification is defined in [../verification/verification-workflow.md](../verification/verification-workflow.md).

Runtime verification:

```text
Backend:  http://localhost:9191
Frontend: http://localhost:9192
```

## Files That Should Not Be Committed

The repository should not commit generated files or machine-specific state:

- `node_modules/`
- `dist/`
- `target/`
- `.idea/`
- `.vscode/`
- `.DS_Store`
- log files

## Database Changes

When the schema or seed data changes, update:

```text
database/electronic_mall.sql
```

Do not create duplicate SQL dumps in project subfolders unless there is a documented deployment requirement.
