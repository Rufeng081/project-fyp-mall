# Repository Structure

This repository uses a monorepo layout so the frontend, backend, database seed script, verification tools, and documentation stay in one Git history.

## Root Directory

```text
project-fyp-mall/
  docs/          Project documentation and evidence
  database/      Database initialization script
  tools/         Verification and utility scripts
  <backend>/     Spring Boot REST API module
  <frontend>/    Vue 2 frontend module
  README.md      Project entry point
```

## Frontend Module

The frontend module contains the Vue 2 application.

Important paths inside the module:

- `src/views/` contains page-level views.
- `src/components/` contains reusable Vue components.
- `src/router/` contains route definitions.
- `src/store/` contains Vuex state management.
- `src/utils/request.js` contains the Axios client configuration.
- `vue.config.js` configures the local development server and history fallback.
- `scripts/` contains frontend regression check scripts.

Generated dependencies and build outputs are not committed:

- `node_modules/`
- `dist/`

## Backend Module

The backend module contains the Spring Boot application.

Important paths inside the module:

- `src/main/java/` contains controllers, services, entities, mappers, configuration, and utility classes.
- `src/main/resources/application.yml` contains local service configuration.
- `src/main/resources/mapper/` contains MyBatis XML mapper files.
- `src/test/java/` contains backend regression tests.
- `file/` and `avatar/` contain sample media used by the application.

Generated Maven output is not committed:

- `target/`

## Database

`database/electronic_mall.sql` is the canonical database initialization script for local setup and project reproduction.

Keep one canonical seed script unless a deployment phase creates a documented migration process.

## Documentation

`docs/` contains all project documentation beyond the root README:

- `project/` for scope and roadmap.
- `engineering/` for structure, development workflow, frontend notes, and UI/UX handoff.
- `verification/` for repeatable verification workflows.
- `cloud/` for VM diagnostics, cloud runtime debugging notes, and deployment evidence archives.
- `reports/` for completed phase reports.
- `records/` for setup logs, decisions, and historical progress records.
- `assets/` for screenshots and other evidence.

Documentation should avoid duplicate planning files and should use project-owned identity language consistently.
