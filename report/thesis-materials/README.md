# Thesis Material Index

This folder contains curated project records copied from `docs/` for thesis/report writing.

## Directory Structure

| Folder | Purpose |
|---|---|
| `writing-sources/` | Main source material for background, requirements, system design, methodology, implementation, database, deployment, and UI discussion. |
| `conclusion-materials/` | Separate evidence for final conclusion, project readiness, deployment completion, remaining limitations, and final acceptance claims. |
| `test-results/` | Separate performance and verification evidence, especially Apache JMeter plans, retained result tables, CSV metrics, charts, and execution records. |

## Writing Sources

Use these files when drafting the main thesis chapters:

| Area | Files | Suggested thesis use |
|---|---|---|
| Project definition | `writing-sources/project/project-scope-and-objectives.md`, `implementation-roadmap.md`, `README.md` | Chapter 1 background, problem scope, objectives, project boundary, and development sequence. |
| Engineering structure | `writing-sources/engineering/repository-structure.md`, `frontend-application.md`, `development-workflow.md`, `cloud-deployment-guide.md`, `ui-ux-design-handoff.md` | System architecture, implementation environment, frontend/backend workflow, deployment methodology, and interface design discussion. |
| Database | `writing-sources/database/DATABASE_DESIGN.md`, `DATABASE_IMPROVEMENT_PLAN.md`, `ERD_EXPLANATION.md` | Database design, ERD explanation, table relationships, integrity rules, and future improvement notes. |
| Cloud records | `writing-sources/cloud/README.md`, `phase-4-vm-diagnostics-2026-05-19.md`, `phpmyadmin-admin-setup-2026-06-15.md` | Cloud deployment setup, VM runtime, Nginx/service configuration, and operational evidence. |
| Implementation reports | `writing-sources/implementation-reports/phase-1-2-localization-stabilization-report.md`, `phase-3-email-verification-report.md`, `phase-4-cloud-deployment-report.md` | Implementation chapter evidence for localization, core flow stabilization, email verification, and cloud deployment. |
| Selected records | `writing-sources/selected-records/` | Supporting audit trail for environment setup, database verification, cloud sync, UI improvement, and catalog quality. |

## Conclusion Materials

Use `conclusion-materials/` only when drafting final evaluation, project completion status, limitations, and future work.

Key files:

- `fyp-demo-readiness-audit-2026-06-16.md`: main readiness decision and remaining risks.
- `phase-4-cloud-deployment-report.md`: deployment completion evidence.
- `final-database-verification-cloud-sync-2026-06-15.md`: final database/cloud sync evidence.
- `fyp-readiness-database-audit-2026-06-15.md`: database readiness and audit support.

## Test Results

Use `test-results/` for testing and evaluation sections only.

Key files:

- `reports/phase-6-jmeter-performance-evaluation-report.md`: main performance evaluation report and interpretation.
- `reports/phase-6-jmeter-execution-record-2026-06-16.md`: chronological execution record.
- `reports/phase-6-jmeter-performance-evaluation-plan.md`: test plan, scope, matrix, and data-protection rules.
- `records/phase-6-jmeter-execution-record-2026-06-16.md`: separate copy of chronological execution evidence.
- `results/summary-tables.md`: retained Markdown result table.
- `results/aggregate-results.csv`: machine-readable aggregate metrics.
- `results/charts/p90-response-time-ms.svg`: P90 response-time chart.
- `results/charts/throughput-per-second.svg`: throughput chart.
- `jmeter-plans/*.jmx`: executable JMeter plans used for the eight scenarios.

## Excluded From Copying

The following records were left in `docs/` because they are too narrow for thesis writing or are better treated as internal development notes:

- UI rollback and single-button fix records.
- Homepage-only visual tuning records.
- Generated JMeter HTML report folders and third-party frontend assets under `docs/testing/jmeter/results/phase6-smoke/`.
- `.DS_Store` files and ignored local artifacts.

## Writing Notes

- The current deployed performance evidence is HTTP-based. Do not claim completed HTTPS performance comparison unless new evidence is added.
- Phase 6 official result summary: 3,197 JMeter sampler executions, 0 errors, and 0.00% observed error rate across retained smoke/load/mutation scenarios.
- Treat the system as a controlled academic cloud e-commerce platform, not a commercial-scale marketplace.
