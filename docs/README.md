# Documentation Index

This directory is the single home for project documentation. The structure separates project definition, engineering references, verification workflows, phase reports, historical records, and evidence assets.

## Current Checkpoint

As of 2026-06-15, the Google Cloud VM has been built and the image/resource display blocker has been resolved. Product images and user avatars now route through the production `/api` base path and backend file storage is documented around `MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads`.

The email verification service is configured through Brevo SMTP environment variables and now uses the FYP-UKM Rufeng Mall Demo verification email template. Runtime deployments must provide `BREVO_SMTP_USERNAME`, `BREVO_SMTP_KEY`, and `BREVO_SENDER_EMAIL`; direct registration without email verification is not enabled.

The cloud runtime has also been checked from the local `gcloud` CLI. The active VM service is `project-fyp-mall.service`, a stale Redis product-cache key was removed after a package-namespace migration, and phpMyAdmin is available behind the existing Nginx public port `80` at `http://34.143.225.11/phpmyadmin/`. Apache is bound only to `127.0.0.1:8081` for phpMyAdmin and MySQL port `3306` remains private.

## Start Here

| Need | File |
| --- | --- |
| Understand project goals, scope, and boundaries | [project/project-scope-and-objectives.md](project/project-scope-and-objectives.md) |
| Review the phase roadmap and current status | [project/implementation-roadmap.md](project/implementation-roadmap.md) |
| Understand the repository layout | [engineering/repository-structure.md](engineering/repository-structure.md) |
| Review database design and ERD | [database/DATABASE_DESIGN.md](database/DATABASE_DESIGN.md) |
| Review database improvement plan | [database/DATABASE_IMPROVEMENT_PLAN.md](database/DATABASE_IMPROVEMENT_PLAN.md) |
| Follow the development workflow | [engineering/development-workflow.md](engineering/development-workflow.md) |
| Deploy to Google Cloud | [engineering/cloud-deployment-guide.md](engineering/cloud-deployment-guide.md) |
| Review cloud runtime fixes | [cloud/README.md](cloud/README.md) |
| Run acceptance-grade verification | [verification/verification-workflow.md](verification/verification-workflow.md) |
| Run JMeter smoke/performance plans | [testing/jmeter/README.md](testing/jmeter/README.md) |
| Review completed phase evidence | [reports/](reports/) |

## Directory Map

| Directory | Purpose |
| --- | --- |
| [project/](project/) | Project definition, scope, objectives, and roadmap. |
| [database/](database/) | Database design, ERD explanation, and improvement plan. |
| [engineering/](engineering/) | Repository structure, development workflow, frontend notes, and UI/UX handoff. |
| [verification/](verification/) | Repeatable verification gates and acceptance workflow. |
| [testing/](testing/) | JMeter plans and test execution notes. |
| [cloud/](cloud/) | Cloud deployment diagnostics, VM evidence bundles, and cloud runtime debugging notes. |
| [reports/](reports/) | Completed implementation, acceptance, and phase reports. |
| [records/](records/) | Setup logs, historical work logs, decisions, and troubleshooting notes. |
| [assets/](assets/) | Screenshots and other verification evidence. |

## Database

| File | Scope |
| --- | --- |
| [database/DATABASE_DESIGN.md](database/DATABASE_DESIGN.md) | Current MySQL table design, logical ERD, flow mapping, and design risks for the FYP report. |
| [database/DATABASE_IMPROVEMENT_PLAN.md](database/DATABASE_IMPROVEMENT_PLAN.md) | Must-fix, recommended, and future database improvements for final presentation readiness. |
| [database/ERD_EXPLANATION.md](database/ERD_EXPLANATION.md) | Short report-ready ERD explanation. |

## Reports

| File | Scope |
| --- | --- |
| [reports/phase-1-2-localization-stabilization-report.md](reports/phase-1-2-localization-stabilization-report.md) | Localization, route fallback, core e-commerce flow stabilization, and final Phase 1/2 acceptance. |
| [reports/phase-3-email-verification-report.md](reports/phase-3-email-verification-report.md) | Email-code registration, forgot-password reset, SMTP/Redis behavior, and authentication follow-up changes. |
| [reports/phase-4-cloud-deployment-report.md](reports/phase-4-cloud-deployment-report.md) | Google Cloud VM deployment, Nginx reverse proxy, backend service, database/cache setup, and current public runtime debugging status. |

## Records

| File | Scope |
| --- | --- |
| [records/environment-setup-log.md](records/environment-setup-log.md) | Local setup fixes, service checks, and environment notes. |
| [records/project-work-log.md](records/project-work-log.md) | Consolidated task plans, findings, decisions, progress, verification results, and error records from prior work sessions. |
| [records/fyp-readiness-database-audit-2026-06-15.md](records/fyp-readiness-database-audit-2026-06-15.md) | Final FYP readiness, database audit, cloud endpoint check, and documentation/JMeter preparation record. |
| [records/final-database-verification-cloud-sync-2026-06-15.md](records/final-database-verification-cloud-sync-2026-06-15.md) | Final database/code compatibility verification and GitHub/GCP synchronization record. |

## Testing

| File | Scope |
| --- | --- |
| [testing/jmeter/README.md](testing/jmeter/README.md) | JMeter variable defaults, execution order, and mutation warnings. |
| [testing/jmeter/01_homepage.jmx](testing/jmeter/01_homepage.jmx) | Homepage and homepage API smoke plan. |
| [testing/jmeter/02_product_list.jmx](testing/jmeter/02_product_list.jmx) | Product list smoke plan. |
| [testing/jmeter/03_product_detail.jmx](testing/jmeter/03_product_detail.jmx) | Product detail and variant smoke plan. |
| [testing/jmeter/04_login.jmx](testing/jmeter/04_login.jmx) | Login smoke plan. |
| [testing/jmeter/05_add_to_cart.jmx](testing/jmeter/05_add_to_cart.jmx) | Add-to-cart mutation plan. |
| [testing/jmeter/06_place_order.jmx](testing/jmeter/06_place_order.jmx) | Place-order mutation plan. |
| [testing/jmeter/07_simulated_payment.jmx](testing/jmeter/07_simulated_payment.jmx) | Simulated-payment mutation plan. |
| [testing/jmeter/08_order_history.jmx](testing/jmeter/08_order_history.jmx) | Order-history smoke plan. |

## Cloud Runtime Notes

| File | Scope |
| --- | --- |
| [cloud/phase-4-vm-diagnostics-2026-05-19.md](cloud/phase-4-vm-diagnostics-2026-05-19.md) | VM diagnostics, image/resource routing fixes, and the 2026-06-15 Redis stale-cache follow-up. |
| [cloud/phpmyadmin-admin-setup-2026-06-15.md](cloud/phpmyadmin-admin-setup-2026-06-15.md) | phpMyAdmin installation and Nginx/Apache integration for MySQL administration. |

## Maintenance Rules

- Keep the root README focused on onboarding and current project status.
- Keep project scope and future direction under `project/`.
- Keep engineering procedures under `engineering/`.
- Keep repeatable verification steps under `verification/`.
- Keep completed phase summaries under `reports/`.
- Keep chronological records under `records/`.
- Store screenshots or binary evidence under `assets/`.
- Store VM diagnostic archives and cloud runtime notes under `cloud/`.
- Avoid duplicated task-plan, findings, and progress files; merge them into `records/project-work-log.md`.
- Use project-owned identity language consistently in project-facing documentation.
