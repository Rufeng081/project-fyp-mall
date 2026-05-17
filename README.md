# Project FYP Mall

Project FYP Mall is a full-stack electronic mall system built with a Vue 2 frontend and a Spring Boot backend. The repository is organized as a monorepo so the frontend, backend, database seed script, and project documentation can be versioned together.

## Repository Layout

```text
project-fyp-mall/
  ElectronicMallVue/   Vue 2 frontend application
  ElectronicMallApi/   Spring Boot REST API
  database/            Database initialization script
  docs/                Project notes, setup records, and workflow documentation
```

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | Vue 2, Vue Router, Vuex, Element UI, Axios, ECharts |
| Backend | Java 8, Spring Boot 2.5.6, MyBatis, MyBatis-Plus |
| Data | MySQL 8, Redis |
| Build tools | npm, Maven |

## Prerequisites

- Java 8
- Maven
- Node.js 16.13.2
- npm 8.x
- MySQL 8.x
- Redis

## Database Setup

Create the MySQL database and import the seed script:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS electronic_mall DEFAULT CHARACTER SET utf8mb4;"
mysql -u root -p electronic_mall < database/electronic_mall.sql
```

The backend currently expects the local database connection configured in:

```text
ElectronicMallApi/src/main/resources/application.yml
```

Default local values:

```text
Database: electronic_mall
Host: localhost:3306
Username: root
Password: root
Redis: 127.0.0.1:6379
```

The seed data is localized for the FYP demo:

- Product, category, user, address, and order sample values are in English.
- Address and phone examples use Malaysia-style values.
- Prices are displayed by the frontend with the `RM` prefix.

Default demo accounts:

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `123456` |
| User | `user` | `123456` |

## Run the Backend

```bash
cd ElectronicMallApi
mvn clean install
mvn spring-boot:run
```

The backend listens on:

```text
http://localhost:9191
```

Swagger/OpenAPI output is available at:

```text
http://localhost:9191/v2/api-docs
```

## Run the Frontend

```bash
cd ElectronicMallVue
npm install
npm run dev
```

The frontend listens on:

```text
http://localhost:9192
```

The frontend API client points to:

```text
http://localhost:9191
```

## Version Control Policy

The repository tracks source code, configuration, database seed data, and project documentation. Generated files and local machine state are excluded through `.gitignore`, including:

- `node_modules/`
- Maven `target/`
- IDE metadata
- OS metadata such as `.DS_Store`
- log files

## Documentation

Additional documentation is stored in `docs/`:

- `docs/PROJECT_STRUCTURE.md` explains the repository structure.
- `docs/DEVELOPMENT_WORKFLOW.md` describes the recommended Git workflow.
- `docs/environment_setup_change_log.md` records local setup and verification notes.

## License

No open-source license has been selected yet. Until a license is added, all rights are reserved by the project owner.
