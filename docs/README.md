# Documentation Index

Use this file as the entry point for project documentation. The documents are kept flat in `docs/` so links remain simple, but they are grouped here by purpose.

## Start Here

| Need | File | Purpose |
|---|---|---|
| Understand the FYP goal and boundaries | [FYP_Project_Boundary_and_Objectives.md](FYP_Project_Boundary_and_Objectives.md) | Defines project title, included/excluded scope, objectives, architecture boundary, testing boundary, and final positioning. |
| Understand the implementation roadmap | [FYP_PROJECT_OPTIMIZATION_PLAN.md](FYP_PROJECT_OPTIMIZATION_PLAN.md) | Lists the phase-by-phase optimization plan from localization through deployment, documentation, and performance testing. |
| Understand what was already changed | [PHASE_1_2_LOCALIZATION_STABILIZATION_REPORT.md](PHASE_1_2_LOCALIZATION_STABILIZATION_REPORT.md) | Summarizes completed Phase 1 localization and Phase 2 core flow stabilization work, including verification results. |
| Review final Phase 1/2 acceptance evidence | [PHASE_1_2_FINAL_ACCEPTANCE_REVIEW.md](PHASE_1_2_FINAL_ACCEPTANCE_REVIEW.md) | Records the final route fix, repeatable verification commands, API golden-path result, and final acceptance decision before Phase 3. |
| Review Phase 3 email verification | [PHASE_3_BREVO_EMAIL_VERIFICATION_REPORT.md](PHASE_3_BREVO_EMAIL_VERIFICATION_REPORT.md) | Records Brevo SMTP registration verification, forgot-password reset, Redis code handling, files changed, and verification evidence. |
| Prepare a UI/UX redesign | [UI_UX_DESIGN_HANDOFF.md](UI_UX_DESIGN_HANDOFF.md) | Maps current routes, screens, components, content, states, assets, and design considerations for a UI designer. |

## Progress and Decisions

| File | Use When |
|---|---|
| [task_plan.md](task_plan.md) | You need the active/previous task checklist and completion status. |
| [findings.md](findings.md) | You need technical decisions, rationale, and important findings from prior work. |
| [progress.md](progress.md) | You need a chronological log of code changes, test results, errors, and verification notes. |

## Project Operation

| File | Use When |
|---|---|
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | You need to know where frontend, backend, database, and documentation assets live. |
| [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md) | You need the recommended Git workflow, local verification commands, and commit hygiene rules. |
| [environment_setup_change_log.md](environment_setup_change_log.md) | You need historical local setup changes, environment fixes, or service verification notes. |

## Evidence

| File | Purpose |
|---|---|
| [phase2_order_history_verified.png](phase2_order_history_verified.png) | Browser verification evidence for the Phase 2 order history flow. |

## Maintenance Rules

- Keep target/scope information in the boundary document.
- Keep future plans and phase breakdowns in the optimization plan.
- Keep completed implementation summaries in report files.
- Keep chronological work history in `progress.md`.
- Keep technical rationale and decisions in `findings.md`.
- Do not create duplicate `task_plan`, `findings`, or `progress` copies with numeric suffixes; merge new information into the canonical files instead.
