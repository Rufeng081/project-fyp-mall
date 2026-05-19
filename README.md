# Project FYP Mall

Project FYP Mall is a full-stack small e-commerce platform for a Network Technology Final Year Project. It includes a Vue 2 customer/admin frontend, a Spring Boot REST API, MySQL seed data, Redis-backed email verification state, SMTP-based account verification, and documentation for local verification and later cloud deployment.

## Current Project Status

| Area | Status |
| --- | --- |
| System localization and demo data | Complete |
| Core storefront, cart, order, and admin flow stabilization | Complete |
| Email-code registration and forgot-password reset | Complete |
| Auth auto-login after registration/reset | Complete |
| Documentation consolidation | In progress |
| Cloud deployment and JMeter performance evaluation | Planned |

## Repository Layout

```text
project-fyp-mall/
  docs/          Project documentation, reports, workflows, and evidence
  database/      MySQL initialization script
  tools/         Verification and utility scripts
  <backend>/     Spring Boot REST API module
  <frontend>/    Vue 2 frontend module
```

The actual backend and frontend directory names are kept as repository implementation details. Project documentation uses role-based names so the project identity remains consistent.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | Vue 2, Vue Router, Vuex, Element UI, Axios, ECharts |
| Backend | Java 8, Spring Boot 2.5.6, MyBatis, MyBatis-Plus |
| Data | MySQL 8, Redis |
| Email | Spring Boot Mail, Brevo SMTP |
| Build tools | npm, Maven |

## Prerequisites

- Java 8
- Maven
- Node.js 16.13.2
- npm 8.x
- MySQL 8.x
- Redis
- Brevo SMTP account for email verification

## Database Setup

Create the MySQL database and import the seed script:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS electronic_mall DEFAULT CHARACTER SET utf8mb4;"
mysql -u root -p electronic_mall < database/electronic_mall.sql
```

Default local values:

```text
Database: electronic_mall
Host: localhost:3306
Username: root
Password: root
Redis: 127.0.0.1:6379
```

The seed data is prepared for the FYP demo:

- Product, category, user, address, and order sample values are in English.
- Address and phone examples use Malaysia-style values.
- Prices are displayed by the frontend with the `RM` prefix.

Default demo accounts:

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `123456` |
| User | `user` | `123456` |

The `sys_user.email` column is unique. If an existing local database was created before the email-verification phase, add the unique index manually or re-import `database/electronic_mall.sql` after backing up local data:

```sql
ALTER TABLE sys_user ADD UNIQUE KEY uk_sys_user_email (email);
```

## Email Verification Setup

Registration and forgot-password reset use SMTP through Spring Boot Mail. Do not place SMTP credentials in tracked configuration files; set these environment variables before starting the backend:

```bash
export BREVO_SMTP_USERNAME="your-brevo-smtp-login"
export BREVO_SMTP_KEY="your-brevo-smtp-key"
export BREVO_SENDER_EMAIL="verified-sender@example.com"
```

Auth endpoints:

| Purpose | Endpoint |
| --- | --- |
| Send registration/reset code | `POST /api/auth/send-email-code` |
| Register with email code | `POST /api/auth/register-by-email` |
| Reset forgotten password with email code | `POST /api/auth/reset-password-by-email` |

Email verification codes are 6 digits, stored in Redis for 5 minutes, and the same email cannot request another code for 60 seconds.

## Run Locally

Backend:

```bash
cd <backend>
mvn clean install
mvn spring-boot:run
```

Frontend:

```bash
cd <frontend>
npm install
npm run dev
```

Default local URLs:

| Service | URL |
| --- | --- |
| Backend API | `http://localhost:9191` |
| Frontend app | `http://localhost:9192` |
| OpenAPI JSON | `http://localhost:9191/v2/api-docs` |

## Verification

Use the repeatable workflow in [docs/verification/verification-workflow.md](docs/verification/verification-workflow.md). Current verification coverage includes:

- Backend unit tests and package build.
- Frontend production build.
- Frontend auth wiring check.
- Frontend history-route regression check.
- Core API golden-path check for storefront, cart, order, payment simulation, and order history.

## Documentation

Start from [docs/README.md](docs/README.md). Key areas:

- [Project scope and objectives](docs/project/project-scope-and-objectives.md)
- [Implementation roadmap](docs/project/implementation-roadmap.md)
- [Repository structure](docs/engineering/repository-structure.md)
- [Development workflow](docs/engineering/development-workflow.md)
- [Verification workflow](docs/verification/verification-workflow.md)
- [Phase reports](docs/reports/)

## Version Control Policy

The repository tracks source code, configuration templates, database seed data, verification scripts, and project documentation. Generated files and local machine state are excluded through `.gitignore`, including:

- `node_modules/`
- Maven `target/`
- IDE metadata
- OS metadata such as `.DS_Store`
- log files

## License

No open-source license has been selected yet. Until a license is added, all rights are reserved by the project owner.
