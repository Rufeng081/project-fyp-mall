# Development Workflow

This document defines the recommended Git workflow for managing the project on GitHub.

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
Initialize GitHub repository structure
Add product search validation
Fix order status update response
Document local setup steps
```

## Pull Request Flow

1. Create a branch from `main`.
2. Make a focused change.
3. Run the relevant checks locally.
4. Commit only files related to the change.
5. Push the branch to GitHub.
6. Open a pull request.
7. Review the diff before merging.

## Local Verification

Backend verification:

```bash
cd ElectronicMallApi
mvn clean install
```

Frontend verification:

```bash
cd ElectronicMallVue
npm install
npm run build
```

Runtime verification:

```text
Backend:  http://localhost:9191
Frontend: http://localhost:9192
```

## Files That Should Not Be Committed

The repository should not commit generated files or machine-specific state:

- `ElectronicMallVue/node_modules/`
- `ElectronicMallVue/dist/`
- `ElectronicMallApi/target/`
- `.idea/`
- `.vscode/`
- `.DS_Store`
- log files

## Database Changes

When the schema or seed data changes, update:

```text
database/electronic_mall.sql
```

Do not create additional duplicate SQL dumps in project subfolders unless there is a documented deployment requirement.
