# Project Structure

This repository uses a monorepo layout. The goal is to keep all parts of the final year project in one Git history while preserving clear boundaries between frontend, backend, database, and documentation assets.

## Root Directory

```text
project-fyp-mall/
  ElectronicMallVue/
  ElectronicMallApi/
  database/
  docs/
  README.md
  .gitignore
  .gitattributes
```

## Frontend

`ElectronicMallVue/` contains the Vue 2 application.

Important paths:

- `src/views/` contains page-level views.
- `src/components/` contains reusable Vue components.
- `src/router/` contains route definitions.
- `src/store/` contains Vuex state management.
- `src/utils/request.js` contains the Axios client configuration.
- `vue.config.js` configures the local development server.

Generated dependencies and build outputs are not committed:

- `node_modules/`
- `dist/`

## Backend

`ElectronicMallApi/` contains the Spring Boot application.

Important paths:

- `src/main/java/` contains controllers, services, entities, mappers, configuration, and utility classes.
- `src/main/resources/application.yml` contains the local service configuration.
- `src/main/resources/mapper/` contains MyBatis XML mapper files.
- `file/` and `avatar/` contain existing sample media used by the application.

Generated Maven output is not committed:

- `target/`

## Database

`database/electronic_mall.sql` is the canonical database initialization script for local setup and project reproduction.

The duplicate SQL copy previously stored under `ElectronicMallApi/` is not needed because the backend does not load it at runtime. Keeping one canonical SQL file avoids drift between copies.

## Documentation

`docs/` contains project notes, planning records, setup logs, and repository workflow documentation. Documentation should be written in English for GitHub-facing materials unless a project requirement states otherwise.
