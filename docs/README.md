# Documentation Index

This directory is the single home for project documentation. The structure separates project definition, engineering references, verification workflows, phase reports, historical records, and evidence assets.

## Start Here

| Need | File |
| --- | --- |
| Understand project goals, scope, and boundaries | [project/project-scope-and-objectives.md](project/project-scope-and-objectives.md) |
| Review the phase roadmap and current status | [project/implementation-roadmap.md](project/implementation-roadmap.md) |
| Understand the repository layout | [engineering/repository-structure.md](engineering/repository-structure.md) |
| Follow the development workflow | [engineering/development-workflow.md](engineering/development-workflow.md) |
| Run acceptance-grade verification | [verification/verification-workflow.md](verification/verification-workflow.md) |
| Review completed phase evidence | [reports/](reports/) |

## Directory Map

| Directory | Purpose |
| --- | --- |
| [project/](project/) | Project definition, scope, objectives, and roadmap. |
| [engineering/](engineering/) | Repository structure, development workflow, frontend notes, and UI/UX handoff. |
| [verification/](verification/) | Repeatable verification gates and acceptance workflow. |
| [reports/](reports/) | Completed implementation, acceptance, and phase reports. |
| [records/](records/) | Setup logs, historical work logs, decisions, and troubleshooting notes. |
| [assets/](assets/) | Screenshots and other verification evidence. |

## Reports

| File | Scope |
| --- | --- |
| [reports/phase-1-2-localization-stabilization-report.md](reports/phase-1-2-localization-stabilization-report.md) | Localization, route fallback, core e-commerce flow stabilization, and final Phase 1/2 acceptance. |
| [reports/phase-3-email-verification-report.md](reports/phase-3-email-verification-report.md) | Email-code registration, forgot-password reset, SMTP/Redis behavior, and authentication follow-up changes. |

## Records

| File | Scope |
| --- | --- |
| [records/environment-setup-log.md](records/environment-setup-log.md) | Local setup fixes, service checks, and environment notes. |
| [records/project-work-log.md](records/project-work-log.md) | Consolidated task plans, findings, decisions, progress, verification results, and error records from prior work sessions. |

## Maintenance Rules

- Keep the root README focused on onboarding and current project status.
- Keep project scope and future direction under `project/`.
- Keep engineering procedures under `engineering/`.
- Keep repeatable verification steps under `verification/`.
- Keep completed phase summaries under `reports/`.
- Keep chronological records under `records/`.
- Store screenshots or binary evidence under `assets/`.
- Avoid duplicated task-plan, findings, and progress files; merge them into `records/project-work-log.md`.
- Do not include origin-history wording or statements that frame the project as derived from another project.
