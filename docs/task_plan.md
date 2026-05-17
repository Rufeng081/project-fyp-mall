# Task Plan: Phase 1 System Localization and Interface Standardization

## Goal
Convert the mall project into an English-based, Malaysia-context e-commerce platform for the FYP demonstration.

## Current Phase
Phase 1 complete

## Phases

### Phase 1: Front-End UI Localization
- [x] Translate visible Vue page, component, menu, title, button, placeholder, validation, dialog, success, and error text to English.
- [x] Replace RMB/yuan display with RM/MYR formatting.
- [x] Replace China-specific payment labels with a simulated payment flow.
- **Status:** complete

### Phase 2: Back-End Message and Status Standardization
- [x] Translate user-facing Java response messages to English.
- [x] Standardize persisted order state text to English values used by the front end.
- **Status:** complete

### Phase 3: Database Seed Localization
- [x] Replace Chinese sample names, addresses, phone numbers, categories, product names, descriptions, standards, user nicknames, and order states.
- [x] Keep schema compatibility while using Malaysia-style sample values.
- **Status:** complete

### Phase 4: Documentation and Verification
- [x] Update run/setup documentation where Phase 1 requires clearer default data notes.
- [x] Run front-end build and back-end build or tests where available.
- [x] Run static audits for visible Chinese text and China/RMB currency markers.
- **Status:** complete

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Use the existing Phase 1 plan in `docs/FYP_PROJECT_OPTIMIZATION_PLAN.md` as approved scope | The user explicitly asked to start Phase 1 from that document. |
| Keep planning files under `docs/` | The project already has `.planning/.active_plan` configured to use `docs/`. |
| Prioritize visible UI, API messages, route titles, order states, and seed data over code comments | Phase 1 deliverables are user/demo-facing localization outcomes. |
| Use `Pending Payment`, `Paid`, `Shipped`, and `Received` consistently | Prevents front-end, back-end, and seed-data order status mismatches. |
| Keep generated iconfont resource metadata unchanged | It is not business UI text and changing generated font metadata risks icon regressions. |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| `npm run dev` failed in sandbox with `listen EPERM` on `0.0.0.0:9192` | 1 | Re-ran with user-approved escalation and started the Vue dev server successfully. |
| Backtick-heavy `rg` command for SQL table names was interpreted by the shell | 1 | Used direct SQL inspection and later static audits instead. |

## Notes
- Front-end production build and back-end Maven package succeeded on 2026-05-18 00:02 MYT.
- Vue dev server is running at `http://localhost:9192/`.
- Static audits found no China/RMB currency markers in source, back-end, database, or README after localization.
