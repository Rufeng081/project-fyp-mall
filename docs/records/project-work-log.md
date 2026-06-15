# Project Work Log

This file consolidates the previous root-level and documentation-level task plans, findings, progress logs, decisions, verification results, and error records. It replaces scattered `task_plan`, `findings`, and `progress` files.

## Consolidation Date

2026-05-19

## FYP Readiness and Database Audit

Date: 2026-06-15

Status: documentation, JMeter preparation, and SQL seed schema optimization complete; changes have not been directly applied to the local or cloud database instance.

Completed outcomes:

- Confirmed the local repository targets GitHub project `Rufeng081/project-fyp-mall`.
- Reviewed `database/electronic_mall.sql` for final FYP database readiness.
- Confirmed the live cloud endpoint `http://34.143.225.11` responds through Nginx and supports product APIs, product detail, variants, image resource retrieval, demo login, authenticated user ID, cart read, and order history read.
- Identified database risks: missing key on `good_standard`, no physical foreign keys, duplicate/legacy `standard` table, orphaned `order_goods` seed rows, mixed money data types, weak MD5 password hashing, missing indexes, and cloud database seed-date drift.
- Added database improvement plan, database design documentation, and ERD explanation under `docs/database/`.
- Added JMeter plan files for homepage, product list, product detail, login, add to cart, place order, simulated payment, and order history under `docs/testing/jmeter/`.
- Added a dedicated audit record under `docs/records/fyp-readiness-database-audit-2026-06-15.md`.

Follow-up implementation in the same session:

- Added `tools/check-database-schema.js` for repeatable schema validation.
- Updated `database/electronic_mall.sql` with composite key on `good_standard`, practical indexes, unique keys for username/order number, decimal money fields, foreign-key constraints, removal of duplicate `standard`, and cleanup of orphaned `order_goods` seed rows.
- Reviewed backend mappings and confirmed no code synchronization was required for these schema changes.
- Kept the existing MD5 password flow after explicit project decision; documented it as a demo limitation instead of migrating to BCrypt.
- Consolidated temporary implementation records into this work log and the dedicated database audit record.

Primary files:

- [../database/DATABASE_IMPROVEMENT_PLAN.md](../database/DATABASE_IMPROVEMENT_PLAN.md)
- [../database/DATABASE_DESIGN.md](../database/DATABASE_DESIGN.md)
- [../database/ERD_EXPLANATION.md](../database/ERD_EXPLANATION.md)
- [fyp-readiness-database-audit-2026-06-15.md](fyp-readiness-database-audit-2026-06-15.md)
- [../testing/jmeter/README.md](../testing/jmeter/README.md)

Verification:

| Check | Result |
| --- | --- |
| Live cloud homepage HEAD request | HTTP 200 from Nginx |
| Live product list/detail/variant/carousel/image/login/cart/order-history API checks | Passed with successful responses |
| JMeter file XML validation | Passed with `xmllint --noout docs/testing/jmeter/*.jmx` |
| Schema validation | Passed with `node tools/check-database-schema.js` after SQL changes |
| Backend tests | Passed with `mvn -q test` |
| Backend package | Passed with `mvn -q package` |
| Frontend auth/deployment checks | Passed with `npm run check:auth` and `npm run check:deployment` |
| Frontend production build | Passed with `npm run build`; only existing Browserslist and asset-size warnings were reported |
| JMeter execution | Not run locally because the `jmeter` command is not installed in this workspace |
| Temporary MySQL import | Blocked because local MySQL is not accepting socket or TCP connections |
| Password hashing decision | MD5 intentionally retained for current FYP demo scope after user confirmation; no BCrypt code changes remain |

Important limitation:

- Schema changes were applied to `database/electronic_mall.sql` only. Before changing the cloud VM database, back up the VM database, import the SQL into a disposable MySQL database, then apply the update during a controlled window.

Follow-up final verification and cloud-sync record:

- [final-database-verification-cloud-sync-2026-06-15.md](final-database-verification-cloud-sync-2026-06-15.md)

## Current Documentation Cleanup

Goal:

- Move scattered explanatory files into `docs/`.
- Organize documentation into a clear project, engineering, verification, report, record, and asset hierarchy.
- Merge duplicate phase records and task logs.
- Align documentation language with the project-owned identity.
- Refresh the root README for the current project stage.

Decisions:

| Decision | Rationale |
| --- | --- |
| Use `docs/project/` for scope and roadmap | Keeps project definition separate from implementation records. |
| Use `docs/engineering/` for structure and workflows | Keeps developer-facing references together. |
| Use `docs/verification/` for repeatable acceptance gates | Makes verification easier to find and reuse. |
| Use `docs/reports/` for completed phase reports | Keeps phase evidence separate from ongoing logs. |
| Use `docs/records/` for historical work logs | Preserves previous progress without leaving duplicate root files. |
| Use role-based frontend/backend wording in docs | Keeps documentation focused on the current project identity. |

## Phase 1 and Phase 2 Summary

Status: complete.

Completed outcomes:

- Standardized visible UI, route titles, API messages, order status labels, seed data, and currency display.
- Stabilized storefront, cart, simulated payment, order history, and administration flows.
- Added a route regression check for history-mode direct access.
- Added a core API golden-path check for product, category, carousel, registration, login, authenticated user, address, cart, order, payment, and order-history flow.
- Confirmed frontend build, <backend-package>, localization audits, and golden-path verification.

Primary report:

- [../reports/phase-1-2-localization-stabilization-report.md](../reports/phase-1-2-localization-stabilization-report.md)

## Phase 3 Summary

Status: complete.

Completed outcomes:

- Added SMTP-backed email-code sending.
- Added email-code registration.
- Added email-code forgot-password reset.
- Stored verification codes in Redis with 5-minute TTL.
- Added resend cooldown and purpose-specific code keys.
- Added unique email handling.
- Updated registration and login views.
- Verified live SMTP delivery without committing secrets.
- Added auto-login after registration and password reset.
- Added account login by username or email.

Primary report:

- [../reports/phase-3-email-verification-report.md](../reports/phase-3-email-verification-report.md)

## Phase 4 Cloud Deployment

Status: image/resource runtime blocker fixed; Google Cloud VM is built and running.

Target outcome:

- Google Cloud VM running Project FYP Mall.
- Nginx serves Vue static files on public HTTP.
- Nginx forwards `/api` to Spring Boot on `127.0.0.1:9191`.
- Spring Boot connects to MySQL and Redis on the VM.
- Public IP supports the core e-commerce demonstration flow.

Current checkpoint as of 2026-05-20:

- VM `fyp-mall-vm` is provisioned in `asia-southeast1-b`.
- Public endpoint recorded during deployment: `http://34.143.225.11`.
- Diagnostics show Nginx, Spring Boot, MySQL, and Redis running.
- User confirmed the public image/resource display issue is fixed and the project is running normally.
- Product images and user avatars now route through `/api` instead of browser-side `localhost:9191`.
- Backend upload storage is documented and configured around `MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads`.
- Email verification service is configured through Brevo SMTP environment variables and the FYP-UKM Rufeng Mall Demo email template.

Primary files:

- [../engineering/cloud-deployment-guide.md](../engineering/cloud-deployment-guide.md)
- [../reports/phase-4-cloud-deployment-report.md](../reports/phase-4-cloud-deployment-report.md)

Current local changes:

- Frontend production API base URL is `/api` through `VUE_APP_API_BASE_URL`.
- Frontend development API base URL remains `http://localhost:9191`.
- Backend port, MySQL, Redis, SMTP, and upload storage settings can be overridden through environment variables.
- Added `npm run check:deployment` to verify the deployment-oriented frontend settings.

## Email Verification Service Template Configuration

Date: 2026-05-20

Status: complete.

Completed outcomes:

- Configured outgoing verification email subject as `[FYP-UKM] Rufeng Mall Demo Verification Code`.
- Configured outgoing verification email body for the FYP-UKM Rufeng Mall Demo System, including the generated 6-digit code, 5-minute validity notice, automated-email notice, ignore-if-not-requested notice, and `LI RUFENG / A206331` signature.
- Confirmed no additional backend flow changes were needed: Redis stores the code for 5 minutes, resend cooldown remains 60 seconds, and registration/reset flows already use the same email verification service.
- Updated root and `docs/` progress notes so the current state says the email verification service is configured rather than listing email fallback as the next implementation task.

Verification:

| Check | Result |
| --- | --- |
| Targeted email service test | Passed with `mvn -q -Dtest=EmailVerificationServiceTest test`. |

## Verification Results Recorded From Prior Work

| Area | Check | Result |
| --- | --- | --- |
| Backend auth | Targeted email/auth tests | Passed. |
| Backend full suite | Full test run | Passed. |
| Backend package | Maven package build | Passed. |
| Frontend auth | Auth wiring check | Passed. |
| Frontend build | Production build | Passed with existing warnings only. |
| Frontend routes | History fallback route check | Passed after running against the active dev-server port. |
| API flow | Core golden-path script | Passed and created a paid test order. |

## Issues Encountered

| Issue | Resolution |
| --- | --- |
| Missing login account could cause a null-pointer failure. | Added explicit validation and regression coverage. |
| Route check could not connect when no frontend dev server was running. | Started the dev server and reran the check against the selected port. |
| Local SMTP key capture failed for two generated keys. | Used the final active key only in the runtime environment and did not store it in documentation. |
| Shell quoting caused a source-audit command to interpret SQL table-name backticks. | Used safer inspection and static audit commands. |

## Historical Decisions

| Decision | Rationale |
| --- | --- |
| Keep password hashing consistent with the existing frontend MD5 flow during Phase 3. | Avoids broad authentication refactoring during the email-verification phase. |
| Use a single send-code API with a `purpose` field. | Keeps registration and reset flows simple while preserving separate Redis keys. |
| Exclude `/api/auth/**` from JWT interception. | Email registration and password reset must work before login. |
| Keep SMTP credentials in environment variables only. | Prevents secrets from being committed or logged. |
| Keep one canonical database seed script. | Avoids drift between duplicate SQL dumps. |

## Previous Planning Files Replaced

The previous scattered task plans, findings notes, progress logs, duplicate Phase 1/2 acceptance report, and duplicate authentication follow-up change log were consolidated into this record and the relevant phase reports.

## Appendix A: Consolidated Historical Work Records

### Root Task Plan Detail

# Task Plan: Project Function Verification And Docs Cleanup

## Goal
Verify the mall project functions, with emphasis on email verification, registration auto-login, and default nickname behavior, then document the industrialized verification workflow and reorganize `docs` without deleting content.

## Current Phase
Phase 5

## Phases

### Phase 1: Requirements And Discovery
- [x] Capture user requirements and constraints
- [x] Read docs history and authentication-related code
- [x] Document findings in `docs/records/project-work-log.md`
- **Status:** complete

### Phase 2: Verification Plan
- [x] Identify backend and frontend verification commands
- [x] Define feature checklist for email code, registration, login, nickname, and core workflows
- **Status:** complete

### Phase 3: Implementation Fixes If Needed
- [x] Fix any missing or broken behavior found during verification
- [x] Keep edits scoped to existing changes and project patterns
- **Status:** complete

### Phase 4: Test And Functional Verification
- [x] Run backend tests/build
- [x] Run frontend checks/build
- [x] Verify documented feature checklist against code and tests
- **Status:** complete

### Phase 5: Docs Workflow And Organization
- [x] Write standard industrialized verification workflow into `docs`
- [x] Reorganize docs by adding indexes/navigation and consolidating duplicates without deleting files
- [ ] Final review and handoff
- **Status:** in_progress

## Key Questions
1. Does registration via email verification return the same authenticated user/token shape expected by the frontend?
2. Is a newly registered user's `nickname` defaulted to the username?
3. Do email verification controls enforce code TTL, purpose separation, duplicate checks, and reset behavior?
4. Can the current backend/frontend build and targeted checks pass locally?
5. How should `docs` be organized without deleting any existing content?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Treat existing dirty changes as user/provided work | Workspace already contains authentication and docs changes; reverting them would violate the user's constraint. |
| Use additive docs organization | User explicitly forbids deletion without approval, so cleanup will use indexes, summaries, and ordering instead of removing files. |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| Login request missing both `account` and `username` throws `NullPointerException` | 1 | Add explicit validation and rerun targeted tests. |

## Notes
- Do not delete any file under `docs` without explicit approval.
- Prefer existing Maven/NPM scripts and current project conventions.

### Root Findings Detail

# Findings & Decisions

## Requirements
- Verify whether all project functions are normal and implemented.
- Pay special attention to email verification code features.
- Review `docs/` historical change records.
- Verify recent changes: automatic login after new-user registration, and default `nickname` equals username.
- After verification, write a standard industrialized process into `docs/`.
- Organize `docs/` without arbitrary deletion; deletion requires user approval.

## Research Findings
- Initial `git status --short` shows existing authentication and docs changes in both backend and frontend.
- Project structure includes Spring Boot backend under `<backend-module>`, Vue frontend under `<frontend-module>`, and existing docs under `docs`.
- Backend already has email verification service and tests: `EmailVerificationServiceTest` and `UserServiceEmailAuthTest`.
- Frontend already has authentication flow checker script: `<frontend-module>/scripts/check-auth-flows.js`.
- `docs/reports/phase-3-email-verification-report.md` records Brevo SMTP email code implementation, Redis 5-minute code TTL, 60-second resend cooldown, registration/reset purposes, database unique email index, and live SMTP verification notes.
- `docs/reports/phase-3-email-verification-report.md` records today's auto-login change: registration/reset return `UserDTO`, front-end stores `localStorage.user`, login uses `account`, and default nickname becomes username.
- Backend code matches the main documented behavior: `UserService.register`, `registerByEmail`, and `resetPasswordByEmail` return `UserDTO` through `createLoginSession`.
- Backend code sets `nickname` to the username for both `/register` and `/api/auth/register-by-email`.
- Frontend code stores `res.data` in `localStorage.user` after email registration and email password reset.
- Edge risk found: `UserService.login` can call `loginForm.getUsername().trim()` when both `account` and `username` are missing, causing a null-pointer failure instead of a controlled business error.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Verify by combining automated tests/builds with source-level checklist | Full manual UI/business workflow coverage is not fully automatable from local context, but builds/tests plus targeted static checks can prove the requested authentication behavior. |
| Keep docs cleanup non-destructive | User explicitly disallowed arbitrary deletion. |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Login request without `account` or legacy `username` can throw a null pointer | Add validation and regression coverage before final verification. |

## Resources
- `/Users/rufeng/Desktop/project-fyp-mall/<backend-module>`
- `/Users/rufeng/Desktop/project-fyp-mall/<frontend-module>`
- `/Users/rufeng/Desktop/project-fyp-mall/docs`

## Visual/Browser Findings
- No browser findings yet.

### Root Progress Detail

# Progress Log

## Session: 2026-05-18

### Phase 1: Requirements And Discovery
- **Status:** in_progress
- **Started:** 2026-05-18 Asia/Kuala_Lumpur
- Actions taken:
  - Loaded relevant workflow and verification skills.
  - Checked workspace path, file inventory, and dirty git status.
  - Created persistent planning files for this verification task.
  - Read docs index, auth auto-login change log, and Phase 3 email verification report.
  - Read backend auth service/controller/tests and frontend login/register/check scripts.
- Files created/modified:
  - `docs/records/project-work-log.md`
  - `docs/records/project-work-log.md`
  - `docs/records/project-work-log.md`

## Test Results
| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| Backend auth TDD red test | `mvn -q -Dtest=UserServiceEmailAuthTest test` | New missing-account test fails before production fix | Failed with `NullPointerException` at `UserService.login`, proving the regression test catches the issue | Expected fail |
| Backend auth targeted green test | `mvn -q -Dtest=UserServiceEmailAuthTest test` | Auth regression tests pass after minimal service fix | Exit code 0; 7 tests passed | Passed |
| Backend full tests | `mvn -q test` | All backend tests pass | Exit code 0 | Passed |
| Backend package | `mvn -q package` | Backend package completes | Exit code 0 | Passed |
| Frontend auth static check | `npm run check:auth` | Auth form wiring and login-state storage checks pass | Printed `Auth flow checks passed.` | Passed |
| Frontend production build | `npm run build` | Vue production build completes | Exit code 0; existing Browserslist and asset-size warnings only | Passed |
| Frontend history route check | `npm run check:routes` | Verify history fallback routes | Failed with `connect EPERM 127.0.0.1:9192`, likely sandbox/local server access plus no running dev server | Blocked |
| Frontend history route check | `FRONTEND_PORT=9193 npm run check:routes` after starting Vue dev server | Verify history fallback routes | Passed for 12 routes | Passed |
| Core API golden path | `node tools/phase12-api-golden-path.js` | Verify product, category, carousel, registration, login, authenticated user, address, cart, order, payment, and order history flow | Passed; registered `phase12check_1779107075093`, created paid order `20260518202435039470` | Passed |

## Error Log
| Timestamp | Error | Attempt | Resolution |
|-----------|-------|---------|------------|
| 2026-05-18 | Missing login account caused `NullPointerException` instead of controlled auth validation | 1 | Added service-layer validation and targeted regression test now passes |
| 2026-05-18 | `npm run check:routes` could not connect to local `127.0.0.1:9192` | 1 | Start local Vue dev server with approval and rerun the route checker |
| 2026-05-18 | Vue dev server selected port 9193 because 9192 was unavailable | 1 | Reran route checker with `FRONTEND_PORT=9193`; passed |

## 5-Question Reboot Check
| Question | Answer |
|----------|--------|
| Where am I? | Phase 5 final review and handoff |
| Where am I going? | Final verification summary |
| What's the goal? | Verify core project features and requested auth changes, then document workflow and docs organization |
| What have I learned? | See `docs/records/project-work-log.md` |
| What have I done? | Verified backend, frontend, route fallback, core API golden path, fixed login validation edge case, and organized docs |

### Documentation Task Plan Detail

# Task Plan: Phase 1 System Localization and Interface Standardization

## Goal
Convert the mall project into an English-based, Malaysia-context e-commerce platform for the FYP demonstration.

## Current Phase
Phase 1 and Phase 2 complete; Phase 3 Brevo email verification implementation and Phase 5 live Brevo SMTP verification are complete.

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
| Use the existing Phase 1 plan in `docs/project/implementation-roadmap.md` as approved scope | The user explicitly asked to start Phase 1 from that document. |
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
- Vue dev server uses explicit history fallback so direct deep links under `http://localhost:9192/` return the SPA entry.
- Static audits found no China/RMB currency markers in source, back-end, database, or README after localization.
- Final Phase 1/2 acceptance was completed on 2026-05-18. See `docs/reports/phase-1-2-localization-stabilization-report.md`.

## Phase 2 Final Acceptance Closure
| Item | Status | Evidence |
|---|---|---|
| Front-end deep routes | complete | `npm run check:routes` passed for 12 main routes. |
| Front-end build | complete | `npm run build` exited 0 with warnings only. |
| Back-end build | complete | `mvn clean package` exited 0 with `BUILD SUCCESS`. |
| API golden path | complete | `node tools/phase12-api-golden-path.js` created and paid order `20260518114014173400`. |
| Localization audit | complete | Source/database/static audits returned no visible business Chinese or China/RMB markers. |

## Phase 3: Brevo Email Verification Registration and Password Reset

- [x] Add Spring Boot Mail support for Brevo SMTP.
- [x] Configure SMTP username, SMTP key, and sender email through `BREVO_SMTP_USERNAME`, `BREVO_SMTP_KEY`, and `BREVO_SENDER_EMAIL`.
- [x] Add `POST /api/auth/send-email-code`.
- [x] Add `POST /api/auth/register-by-email`.
- [x] Add `POST /api/auth/reset-password-by-email` for forgot-password flow.
- [x] Generate 6-digit verification codes.
- [x] Store verification codes in Redis for 5 minutes.
- [x] Prevent repeated sending for the same email and purpose within 60 seconds.
- [x] Add unique email index to `sys_user.email` in `database/electronic_mall.sql`.
- [x] Update Vue registration page with email, verification code, and Send Code button.
- [x] Update Vue login page with forgot-password email verification reset dialog.
- [x] Update README setup instructions.
- [x] Add Phase 3 review report at `docs/reports/phase-3-email-verification-report.md`.

### Email Verification Decisions

| Decision | Rationale |
|----------|-----------|
| Use a single send-code API with `purpose` equal to `register` or `reset` | Keeps the API simple while allowing registration and forgot-password flows to share code. |
| Use Redis keys scoped by purpose and email | Prevents registration and reset codes from conflicting for the same address. |
| Keep password hashing in the existing frontend MD5 flow | Avoids broad authentication refactoring during this FYP phase. |
| Add `/api/auth/**` to JWT exclusions | Email registration and forgot-password must work before the user logs in. |

### Email Verification Snapshot

| Test | Result |
|------|--------|
| Backend email verification unit tests | `mvn -q -Dtest=EmailVerificationServiceTest,UserServiceEmailAuthTest test` exited `0`. |
| Full backend tests/package | `mvn -q test` and `mvn -q package` exited `0`. |
| Frontend build/routes | `npm run build` exited `0`; `npm run check:routes` passed for 12 routes. |
| Live Brevo SMTP delivery | Requires local runtime environment variables; secrets are not committed or logged. |

### Phase 5: Live Brevo SMTP Delivery Verification
- [x] Retrieve Brevo SMTP username, SMTP key, and verified sender through the logged-in Brevo console without committing secrets.
- [x] Start or reuse local Redis, MySQL, Spring Boot API, and Vue app with Brevo environment variables available to the backend.
- [x] Apply/verify the local `sys_user.email` unique index needed by Phase 3.
- [x] Send a real registration email code through Brevo SMTP.
- [x] Complete a local registration and password reset flow using the real SMTP-backed code.
- [x] Update README/docs with sanitized operational notes and final verification evidence.
- **Status:** complete

### Documentation Findings Detail

# Findings & Decisions

## Requirements
- Phase 1 objective: English-based and Malaysia-context e-commerce platform.
- Translate visible UI text, route titles, messages, dialog labels, product/category names, order status text, user role names, and admin panel text.
- Standardize currency display to `RM` / `MYR`.
- Use Malaysia-style address and phone examples.
- Update seed/default data to English names, Malaysia addresses, Malaysia phone numbers, MYR prices, and English categories.

## Research Findings
- Frontend: Vue 2 with Element UI. Visible text is mostly hard-coded in `.vue` files and route metadata.
- Backend: Spring Boot returns user-facing messages from services/controllers and stores order state strings in the database.
- Database: `database/electronic_mall.sql` contained Chinese sample names, China addresses, China phone numbers, Chinese categories, product descriptions, standards, user nicknames, and order statuses.
- Existing planning files are intentionally stored in `docs/` via `.planning/.active_plan`.
- 2026-05-18 auth verification found registration and email registration now return login DTOs, and both default nickname values to the username.
- 2026-05-18 auth verification found a login edge case where missing `account` and legacy `username` caused a null pointer; it was fixed with service-layer validation and a regression test.
- 2026-05-18 full local verification passed backend tests/package, frontend auth/build/routes, and the core API golden path.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Preserve existing database schema | Phase 1 is localization, not schema redesign. |
| Encode Malaysia-style address as a single formatted string where schema only has `link_address` / `address` | Avoids risky schema changes before Phase 2 stabilization. |
| Use `Pending Payment`, `Paid`, `Shipped`, and `Received` consistently across Vue, Java, MyBatis, and seed SQL | Prevents status-filter mismatch after localization. |
| Use `RM` prefix in UI labels and price displays | Matches Phase 1 requirement and Malaysia currency convention. |
| Replace WeChat/Alipay UI with a simulated payment button | Aligns Phase 1 localization and keeps payment suitable for FYP scope. |
| Keep docs cleanup additive and index-driven | The user explicitly disallowed deleting `docs/` contents without approval. |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Vue dev server cannot bind to `0.0.0.0:9192` inside the default sandbox | Started it with approved escalation. |
| `npm run build` reports Browserslist and bundle-size warnings | Build still exits 0; warnings are dependency/asset-size concerns, not localization failures. |
| Vue Router history-mode deep links returned 404 for generic GET checks | Added explicit `devServer.historyApiFallback.htmlAcceptHeaders` including `*/*`, then added `npm run check:routes` to prevent regression. |
| `/login` without `account` or `username` could throw `NullPointerException` | Added explicit validation and regression coverage in `UserServiceEmailAuthTest`. |

## Final Phase 1/2 Acceptance Findings: 2026-05-18
- The remaining Phase 2 gap was not a Vue route table problem. It was a dev-server fallback configuration issue for history-mode deep links.
- Browser-style `Accept: text/html` requests already worked, but generic GET checks failed before the fix.
- `<frontend-module>/scripts/check-history-routes.js` now covers direct access to 12 main routes.
- `tools/phase12-api-golden-path.js` now provides a repeatable API-level golden path covering registration, login, products, image endpoint, cart, order creation, simulated payment, and order history.
- Final API verification created local test user `phase12check_1779075614723` and paid order `20260518114014173400`.

## Resources
- `docs/project/implementation-roadmap.md`
- `<frontend-module>/src/`
- `<backend-module>/src/main/java/`
- `<backend-module>/src/main/resources/mapper/Income.xml`
- `database/electronic_mall.sql`
- `README.md`
- `docs/reports/phase-1-2-localization-stabilization-report.md`
- `docs/verification/verification-workflow.md`

### Documentation Progress Detail

# Progress Log

## Session: 2026-05-17

### Phase 1: System Localization and Interface Standardization
- **Status:** complete
- Actions taken:
  - Read `docs/project/implementation-roadmap.md`.
  - Audited frontend, backend, and database files for Chinese text and China/RMB currency markers.
  - Translated visible Vue UI text, route titles, admin menus, form labels, validation messages, dialogs, and order/payment labels to English.
  - Replaced RMB/yuan displays with `RM` prefixes.
  - Replaced the WeChat/Alipay payment UI with a simulated payment button.
  - Standardized order states as `Pending Payment`, `Paid`, `Shipped`, and `Received`.
  - Translated backend user-facing messages and aligned order status persistence.
  - Localized database seed data to English/Malaysia sample names, addresses, phone numbers, categories, products, variants, users, and orders.
  - Updated `README.md` with Phase 1 seed data notes and default demo accounts.
  - Started the Vue dev server at `http://localhost:9192/`.
- Files created/modified:
  - `<frontend-module>/src/`
  - `<backend-module>/src/main/java/`
  - `<backend-module>/src/main/resources/mapper/Income.xml`
  - `database/electronic_mall.sql`
  - `README.md`
  - `docs/records/project-work-log.md`
  - `docs/records/project-work-log.md`
  - `docs/records/project-work-log.md`

## Test Results
| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| Baseline Chinese text audit | `rg -n "[\p{Han}]" ...` | Findings before localization | Found Chinese UI, backend messages, comments, and seed data | complete |
| Baseline currency audit | `rg -n "¥|￥|RMB|CNY|元|人民币"` | Findings before localization | Found RMB/yuan markers in Vue files and seed data context | complete |
| Front-end build | `npm run build` in `<frontend-module>` | Exit 0 | Exit 0; only Browserslist and asset-size warnings | complete |
| Back-end package | `mvn clean package` in `<backend-module>` | Exit 0 | Exit 0; no tests configured | complete |
| Front-end visible Chinese audit | `rg -n "[\p{Han}]" <frontend-module>/src --glob '!<frontend-module>/src/resource/**' --glob '!<frontend-module>/src/views/front/good/index.html'` | No matches | No matches | complete |
| Currency/China payment audit | `rg -n "¥|￥|RMB|CNY|人民币|支付宝|微信|Pay宝|元" <frontend-module>/src <backend-module>/src database README.md --glob '!<frontend-module>/src/resource/**'` | No matches | No matches | complete |
| Database Chinese audit | `rg -n "[\p{Han}]" database/electronic_mall.sql` | No matches | No matches | complete |

## Error Log
| Timestamp | Error | Attempt | Resolution |
|-----------|-------|---------|------------|
| 2026-05-18 00:03 MYT | `npm run dev` failed with `listen EPERM: operation not permitted 0.0.0.0:9192` in sandbox | 1 | Re-ran with approved escalation and server started. |
| 2026-05-17 | SQL `rg` pattern with backticks triggered shell command substitution | 1 | Switched to direct SQL reads and later static audits. |

## 5-Question Reboot Check
| Question | Answer |
|----------|--------|
| Where am I? | Phase 1 is complete and verified. |
| Where am I going? | Phase 2 core e-commerce function stabilization. |
| What's the goal? | English UI with Malaysia address, phone, and RM/MYR currency context. |
| What have I learned? | Order status values must be aligned across Vue, Java, MyBatis, and SQL seed data. |
| What have I done? | Localized front end, backend messages/statuses, database seed data, README, and verified builds. |

## Session: 2026-05-18

### Phase 2: Core E-Commerce Function Stabilization
- **Status:** in progress
- Actions taken:
  - Reproduced the reported home/product/login symptoms against the running Vue app.
  - Confirmed the first root cause was that the Spring Boot API on `http://localhost:9191` was not running while the Vue app on `http://localhost:9192` was running.
  - Started the Spring Boot backend and verified `/api/good`, `/api/carousel`, `/api/icon`, and `/login`.
  - Verified browser login with `user / 123456`.
  - Fixed storefront links to use canonical `/goodView`, `/goodList`, and `/orderList` paths.
  - Removed invalid nested anchors from product/category links.
  - Fixed login/register empty-field defaults and register form submission so failed retries do not hash the live form state.
  - Fixed simulated payment redirect to the actual order history route.
  - Normalized legacy Chinese order states from the database to the English states expected by the front end.
  - Fixed confirm-order unit price display to two decimals.
- Notes:
  - The local MySQL database still contains old Chinese test data. The project SQL file is localized, but re-importing it would overwrite local data and requires explicit approval.

## Phase 2 Verification Results
| Test | Result |
|------|--------|
| Frontend build | `npm run build` completed with exit 0; only existing Browserslist and asset-size warnings. |
| Backend package | `mvn clean package` completed with `BUILD SUCCESS`; no tests configured. |
| Product API | `GET /api/good` returned HTTP 200 and product data. |
| Carousel API | `GET /api/carousel` returned HTTP 200 and carousel data. |
| Login API | `POST /login` with `user / 123456` MD5 payload returned code `200`. |
| Browser home smoke test | Home page loaded at `http://localhost:9192/topview`; 12/12 images loaded and no `/undefined/file/...` image paths remained. |
| Browser login/order flow | Login worked, cart checkout reached simulated payment, payment redirected to `/orderList`, and old Chinese order states displayed as `Paid` / `Received`. |

## Database Reset Verification: 2026-05-18
- Re-imported `database/electronic_mall.sql` into the local `electronic_mall` database after explicit user approval.
- Verified database seed data:
  - Users: `Administrator`, `Demo User`.
  - Categories: `Clothing`, `Men Clothing`, `Stationery`, `Books`, `Food and Beverages`, `Daily Essentials`, and related English subcategories.
  - Products: `Study Desk and Chair Set`, `Men Casual Sneakers`, `Women Cotton T-Shirt`, `Premium Malt Beverage`, and related English products.
  - Addresses and phones use Malaysia-style values, including `+60` phone numbers and Malaysia addresses.
  - Orders use English states: `Paid`, `Received`.
- Verified browser golden path after import:
  - Login with `user / 123456`.
  - Home page displayed English categories/products and RM prices with 12/12 images loaded.
  - Product detail displayed English content and RM prices.
  - Add to cart, checkout, simulated payment, and order history worked.
  - Browser text checks for home, product detail, cart, checkout, payment, and order history found no visible Chinese characters.
- Screenshot saved: `docs/assets/phase-2-order-history-verified.png`.

## Final Phase 1/2 Acceptance Closure: 2026-05-18

### Status
- **Phase 1:** complete and accepted.
- **Phase 2:** complete and accepted.
- **Next phase:** Phase 3 registration email verification code.

### Issue Found and Fixed
- Found that Vue Router history-mode routes such as `/topview`, `/login`, `/register`, `/goodView/3`, and `/orderList` returned `404` for generic GET requests against the Vue dev server.
- Root cause: Vue CLI's default `historyApiFallback.htmlAcceptHeaders` accepted browser-style HTML requests but did not include `*/*`.
- Fix: updated `<frontend-module>/vue.config.js` with explicit `historyApiFallback` configuration.
- Regression check: added `<frontend-module>/scripts/check-history-routes.js` and `npm run check:routes`.

### Files Changed
- `<frontend-module>/vue.config.js`
- `<frontend-module>/package.json`
- `<frontend-module>/scripts/check-history-routes.js`
- `tools/phase12-api-golden-path.js`
- `docs/reports/phase-1-2-localization-stabilization-report.md`
- `docs/README.md`
- `docs/records/project-work-log.md`
- `docs/records/project-work-log.md`
- `docs/records/project-work-log.md`
- `docs/reports/phase-1-2-localization-stabilization-report.md`

### Final Verification Results
| Test | Command | Result | Status |
|---|---|---|---|
| Front-end route fallback red test | `npm run check:routes` before fix | Failed for 11 deep routes with HTTP 404 | complete |
| Front-end route fallback green test | `npm run check:routes` after fix | Passed for 12 routes | complete |
| Front-end build | `npm run build` in `<frontend-module>` | Exit 0; Browserslist and asset-size warnings only | complete |
| Back-end package | `mvn clean package` in `<backend-module>` | Exit 0; `BUILD SUCCESS`; no tests configured | complete |
| Front-end visible Chinese audit | `rg -n "[\p{Han}]" <frontend-module>/src --glob '!<frontend-module>/src/resource/**' --glob '!<frontend-module>/src/views/front/good/index.html'` | No matches | complete |
| Currency/China payment audit | `rg -n "¥|￥|RMB|CNY|人民币|支付宝|微信|Pay宝|元" <frontend-module>/src <backend-module>/src database README.md --glob '!<frontend-module>/src/resource/**'` | No matches | complete |
| Database Chinese audit | `rg -n "[\p{Han}]" database/electronic_mall.sql` | No matches | complete |
| China-context seed/source audit | `rg -n "China|Chinese|Beijing|Shanghai|Guangzhou|¥|RMB|CNY|Alipay|WeChat|Weixin|支付宝|微信" database/electronic_mall.sql <frontend-module>/src <backend-module>/src --glob '!<frontend-module>/src/resource/**'` | No matches | complete |
| API golden path | `node tools/phase12-api-golden-path.js` | Registered `phase12check_1779075614723`, created and paid order `20260518114014173400` | complete |

### Notes
- The final API golden-path script intentionally creates local verification data in MySQL.
- Generated resource metadata and Java comments may still contain non-demo Chinese text in excluded/generated areas, but visible business UI, seed data, and checked API payloads are localized.

## Phase 3: Brevo Email Verification Registration

### Status
- **Phase 3:** implementation complete and locally verified, except live Brevo SMTP delivery which requires runtime SMTP environment variables.

### Actions Taken
- Read the existing `UserController`, `UserService`, `User`, `User.xml`, Redis configuration, interceptor configuration, `application.yml`, Maven `pom.xml`, Vue `Register.vue`, Vue `Login.vue`, Axios request wrapper, router, and SQL user table.
- Confirmed root findings:
  - Existing registration used `/register` with username/password only.
  - Existing `sys_user.email` column existed but did not have a unique index.
  - Existing password reset used `/user/resetPassword?id=...`, which is not suitable for unauthenticated forgot-password users.
  - Existing Redis integration could support short-lived verification state.
- Added backend tests for email verification code Redis behavior and user email registration/reset logic.
- Added Spring Boot Mail support and Brevo SMTP configuration through environment variables only.
- Added `EmailVerificationService` for 6-digit code generation, Redis 5-minute TTL storage, Redis 60-second resend cooldown, email validation, and SMTP sending.
- Added SMTP failure handling so Redis verification code and cooldown keys are removed if email delivery fails.
- Added `AuthController` APIs:
  - `POST /api/auth/send-email-code`
  - `POST /api/auth/register-by-email`
  - `POST /api/auth/reset-password-by-email`
- Updated `UserService` to validate duplicate email, verify registration code, create email-verified users, send reset codes only for existing emails, and reset password after code verification.
- Updated JWT interceptor exclusions so `/api/auth/**` is publicly accessible before login.
- Updated Vue registration page with email, code, Send Code button, countdown, and email-code registration submission.
- Updated Vue login page with forgot-password dialog, email reset code sending, and password reset submission.
- Updated `database/electronic_mall.sql` with `uk_sys_user_email`.
- Updated `README.md` with Brevo SMTP environment variable setup and Phase 3 endpoints.
- Added `docs/reports/phase-3-email-verification-report.md`.

### Phase 3 Test Results
| Test | Command | Result | Status |
|---|---|---|---|
| TDD red test | `mvn -q -Dtest=EmailVerificationServiceTest test` before implementation | Failed because `EmailVerificationService` and mail dependency did not exist | complete |
| SMTP failure red/green test | `mvn -q -Dtest=EmailVerificationServiceTest test` | First failed with raw `MailSendException`, then exited 0 after cleanup handling | complete |
| Backend unit tests | `mvn -q -Dtest=EmailVerificationServiceTest,UserServiceEmailAuthTest test` | Exit 0 | complete |
| Full backend tests | `mvn -q test` in `<backend-module>` | Exit 0 | complete |
| Backend package | `mvn -q package` in `<backend-module>` | Exit 0 | complete |
| Frontend production build | `npm run build` in `<frontend-module>` | Exit 0; existing Browserslist and asset-size warnings only | complete |
| Frontend route fallback | `npm run check:routes` against Vue dev server on `http://localhost:9192` | Passed for 12 routes | complete |

### Phase 3 Error Log
| Timestamp | Error | Attempt | Resolution |
|---|---|---|---|
| 2026-05-18 11:58 MYT | Maven test failed in sandbox with `Operation not permitted` accessing `~/.m2/repository` | 1 | Re-ran Maven test with approved escalation for local Maven repository access. |
| 2026-05-18 12:04 MYT | `npm run check:routes` failed in sandbox with `connect EPERM 127.0.0.1:9192` | 1 | Re-ran route check with approved local network escalation. |
| 2026-05-18 12:05 MYT | Stopping the Vue dev server failed in sandbox with `operation not permitted` | 1 | Stopped the verification server process with approved escalation. |

### Phase 3 Notes
- Brevo SMTP secrets are intentionally not committed, logged, or documented with real values.
- Live SMTP delivery requires starting the backend with `BREVO_SMTP_USERNAME`, `BREVO_SMTP_KEY`, and `BREVO_SENDER_EMAIL` exported in the runtime environment.

## Planning Hook Follow-up: 2026-05-18

- Stop hook reported `Task incomplete (4/6 phases done)` after Phase 3 completion.
- Re-read `docs/records/project-work-log.md` as required by the planning-with-files workflow.
- Root cause: the hook script counts every heading beginning with `### Phase`; `### Phase 3 Decisions` and `### Phase 3 Verification Snapshot` were counted as extra phases without `**Status:** complete`.
- Resolution: rename those two informational headings so only actual phase headings start with `### Phase`.

## Phase 5: Live Brevo SMTP Delivery Verification

### Status
- **Phase 5:** in progress.

### Actions Taken
- Re-read `docs/records/project-work-log.md` and `docs/records/project-work-log.md`.
- Added a dedicated Phase 5 checklist for live Brevo SMTP delivery verification.
- Confirmed policy for handling SMTP credentials: use Brevo console and runtime environment only; do not commit, print, or document secret values.
- Opened the logged-in Brevo console at `https://app.brevo.com/settings/keys/smtp`.
- Found SMTP server `smtp-relay.brevo.com`, port `587`, and the account SMTP login in the Brevo UI.
- Found no existing SMTP key listed; the UI requires `Generate SMTP key`.
- Received explicit user confirmation to create a new Brevo SMTP key.
- Generated a new Brevo SMTP key in the Brevo UI. The key was used only in runtime/local temporary process environment and was not written to repository files or documentation.
- Opened Brevo sender settings and confirmed one Gmail-domain sender exists and is `Verified`.
- Verified local Redis and MySQL are running.
- Verified the local database did not yet have `uk_sys_user_email`, then applied `ALTER TABLE sys_user ADD UNIQUE KEY uk_sys_user_email (email);`.
- Started the Spring Boot backend with Brevo environment variables and `java.io.tmpdir=/private/tmp`.
- Deleted the temporary backend launch script after the backend started.
- Triggered `POST /api/auth/send-email-code` against the local backend using a plus-alias test email. The backend reached the SMTP path but returned `Failed to send verification email`.
- Normalized the captured SMTP key value and restarted the backend, then retried the send-code API. The same SMTP failure remained.
- Added sanitized backend warning logging in `EmailVerificationService` so the next run can expose the JavaMail/Brevo cause without logging the SMTP key.
- Removed the temporary send-code payload file from `/private/tmp`.
- Finalized the Chrome automation session.

### Historical Blocker
- This temporary restart blocker was resolved later in the same Phase 5 work. Live Brevo SMTP delivery was eventually verified and recorded in the later completion notes.

### Phase 5 Error Log
| Timestamp | Error | Attempt | Resolution |
|---|---|---|---|
| 2026-05-18 12:34 MYT | Spring Boot failed to create Tomcat temp dir under `/var/tmp` | 1 | Restarted with `JAVA_TOOL_OPTIONS=-Djava.io.tmpdir=/private/tmp`. |
| 2026-05-18 12:35 MYT | Spring Boot failed to bind 9191 due to sandbox `Operation not permitted` | 1 | Started backend through an escalated local process using a temporary launcher. |
| 2026-05-18 12:37 MYT | First real Brevo send-code attempt returned `Failed to send verification email` | 1 | Normalized the SMTP key and restarted backend. |
| 2026-05-18 12:39 MYT | Second real Brevo send-code attempt returned `Failed to send verification email` | 2 | Added sanitized backend warning logging for the next restart. |
| 2026-05-18 12:40 MYT | Escalated local process action rejected due Codex usage limit | 1 | Blocked until escalation quota resets or the user manually restarts/stops the backend. |

### Resume: 2026-05-18 19:27 MYT
- User requested continuing the live Brevo SMTP test until all local components work.
- Re-read `docs/records/project-work-log.md` and `docs/records/project-work-log.md`.
- Next action: restart the local backend with the already-generated Brevo SMTP key still held in runtime memory, then trigger the send-code API again to capture the sanitized JavaMail/Brevo failure reason.
- Restarted the backend with updated sanitized SMTP diagnostic logging.
- Retried `POST /api/auth/send-email-code`; the backend logged Brevo/JavaMail root cause `535 5.7.8 Authentication failed`.
- Re-opened Brevo SMTP settings and confirmed the created SMTP key is active but only visible as a masked value after creation.
- Finding: the runtime key captured during first generation was not the usable full key. Because Brevo does not reveal it again, completing live SMTP requires generating a fresh SMTP key and capturing it immediately from the creation dialog.
- Stop hook re-triggered while Phase 5 remains incomplete. Re-read `docs/records/project-work-log.md`; remaining items are real Brevo send-code delivery, registration/password reset completion, and final sanitized documentation.
- Current user confirmation needed: permission to generate a second fresh Brevo SMTP key because the first key can no longer be fully viewed and the captured value failed SMTP authentication.
- Received user permission and generated a fresh Brevo SMTP key named `project-fyp-mall-live-1779103915342`.
- Restarted the backend with the newly captured runtime key, but Brevo still returned `535 5.7.8 Authentication failed`.
- Compared the runtime key suffix against Brevo's masked active key rows. The runtime-captured suffix did not match the latest masked Brevo SMTP key suffix.
- Finding: DOM text extraction is unreliable on the Brevo modal because it can capture a stale/hidden key candidate. The next attempt must use the modal's copy button/clipboard immediately after generation and verify the runtime key suffix against the masked row suffix before restarting the backend.

### Final Live Verification: 2026-05-18 19:45 MYT
- User supplied the final Brevo SMTP key value directly and authorized its use for local testing.
- Loaded the supplied SMTP key into runtime environment only. It was not written to repository files or documentation.
- Restarted Spring Boot on `http://localhost:9191` with:
  - Brevo SMTP server `smtp-relay.brevo.com`
  - port `587`
  - SMTP login from Brevo
  - verified Gmail-domain sender
  - supplied SMTP key in process environment
- Deleted the temporary backend launcher script after startup.
- Sent a real registration code through `POST /api/auth/send-email-code`; response was `{"code":"200","data":"Verification code sent"}`.
- Read the test verification code from Redis and completed `POST /api/auth/register-by-email`; response code was `200`.
- Verified the newly registered user could log in through `POST /login`; response code was `200`.
- Sent a real forgot-password reset code through `POST /api/auth/send-email-code` with `purpose=reset`; response code was `200`.
- Read the reset verification code from Redis and completed `POST /api/auth/reset-password-by-email`; response code was `200`.
- Verified the same user could log in with the reset password; response code was `200`.
- Confirmed both Redis verification keys were deleted after successful registration/reset consumption.
- Confirmed the local MySQL `sys_user` table contains the new live-test user with role `user`.
- Confirmed Brevo Transactional Email Logs show `Online Mall verification code` entries with `Sent`, `Delivered`, and `First opening` events.
- Ran backend tests with `mvn -q test`; exit code `0`.
- Ran frontend production build with `npm run build`; exit code `0` with existing Browserslist and asset-size warnings only.
- Started Vue dev server on `http://localhost:9192` and verified `npm run check:routes`; 12 routes passed.
- Removed temporary JSON payload and Redis key files from `/private/tmp`.
- Final state: Spring Boot API remains running on `http://localhost:9191`; Vue dev server remains running on `http://localhost:9192` for continued manual testing.

## Auth Auto-Login And Full Verification Follow-up: 2026-05-18

### Status
- **Authentication follow-up:** complete.
- **Project verification:** complete for automated local checks and core API golden path.
- **Documentation organization:** complete without deleting any `docs/` content.

### Actions Taken
- Re-read `docs/README.md`, `docs/reports/phase-3-email-verification-report.md`, and `docs/reports/phase-3-email-verification-report.md`.
- Reviewed backend authentication implementation in `UserService`, `AuthController`, `UserController`, `LoginForm`, and email-auth tests.
- Reviewed frontend authentication implementation in `Register.vue`, `Login.vue`, and `scripts/check-auth-flows.js`.
- Confirmed email registration and plain registration return login-state DTOs with token.
- Confirmed new-user nickname defaults to the username for both plain and email registration.
- Confirmed frontend email registration and password reset store `res.data` into `localStorage.user`.
- Added regression coverage for a missing-account login edge case.
- Fixed `UserService.login` so requests without `account` or legacy `username` return `Account and password are required` instead of a null pointer.
- Added `docs/verification/verification-workflow.md`.
- Updated `docs/README.md`, `docs/engineering/development-workflow.md`, and `docs/records/project-work-log.md` to consolidate navigation and current verification evidence.

### Verification Results
| Test | Command | Result | Status |
|---|---|---|---|
| Auth TDD red test | `mvn -q -Dtest=UserServiceEmailAuthTest test` before fix | Failed with `NullPointerException` for missing account | complete |
| Auth targeted tests | `mvn -q -Dtest=UserServiceEmailAuthTest test` | Exit 0; 7 tests passed | complete |
| Backend full tests | `mvn -q test` | Exit 0 | complete |
| Backend package | `mvn -q package` | Exit 0 | complete |
| Frontend auth check | `npm run check:auth` | Printed `Auth flow checks passed.` | complete |
| Frontend build | `npm run build` | Exit 0; existing Browserslist and asset-size warnings only | complete |
| Frontend route fallback | `FRONTEND_PORT=9193 npm run check:routes` | Passed for 12 routes | complete |
| Core API golden path | `node tools/phase12-api-golden-path.js` | Registered `phase12check_1779107075093`, created paid order `20260518202435039470` | complete |

### Notes
- The route checker initially failed with `connect EPERM 127.0.0.1:9192` in the sandbox. It passed after starting Vue locally and using the actual fallback port `9193`.
- The Vue dev server used for this verification was stopped after route checks.
- No files under `docs/` were deleted.

## Cloud Deployment Diagnostics And Code Fix: 2026-05-19

### Status
- **VM diagnostics review:** complete.
- **Minimal cloud runtime code fix:** complete locally; pending VM redeploy by user.

### Actions Taken
- Reviewed the temporary Phase 4 deployment handoff to recover the cloud deployment state and stop point.
- Extracted and analyzed `docs/cloud/fyp-mall-diagnostics.tar.gz`.
- Confirmed VM services are running in the diagnostic snapshot: Nginx on port 80, Spring Boot on port 9191, MySQL on 3306, and Redis on 6379.
- Confirmed the previous non-executable backend JAR problem is no longer current because the backend now starts successfully from `/opt/project-fyp-mall/runtime/project-fyp-mall-api.jar`.
- Identified the remaining production blocker: deployed frontend code still contained browser-side `http://localhost:9191` calls for role checks, uploaded resources, and file uploads.
- Identified the backend upload-storage risk: file/avatar storage was derived from the executable JAR classloader path instead of a stable writable VM directory.
- Added `docs/cloud/phase-4-vm-diagnostics-2026-05-19.md` with evidence, root causes, repair steps, VM commands, and verification commands.
- Added frontend deployment regression checks so production-facing source files cannot reintroduce `http://localhost:9191`.
- Added backend regression test `UploadStoragePropertiesTest` for configured upload directory resolution.
- Verified red tests before implementation:
  - `npm run check:deployment` failed because production resource routing was not configured.
  - `mvn -q -Dtest=UploadStoragePropertiesTest test` failed because `UploadStorageProperties` did not exist.
- Applied minimal frontend fix:
  - Role checks now use `request.post("/role")`.
  - `VUE_APP_RESOURCE_BASE_URL` controls resource/download/upload base URL.
  - Production resource base URL is `/api`; development remains `http://localhost:9191`.
  - File upload action uses `baseApi + "/file/upload"`.
- Applied minimal backend fix:
  - Added `mall.upload-dir` with `MALL_UPLOAD_DIR` environment override.
  - Added `UploadStorageProperties`.
  - Updated `FileService` and `AvatarService` to use configured file/avatar folders and create missing folders with `mkdirs()`.
- Verified targeted green tests:
  - `npm run check:deployment` passed.
  - `mvn -q -Dtest=UploadStoragePropertiesTest test` passed.
- Ran full local verification before commit/push:
  - `npm run check:deployment` passed.
  - `npm run check:auth` passed.
  - `npm run build` passed with existing Browserslist and asset-size warnings.
  - `mvn -q test` passed.
  - `mvn -q package` passed.

### VM Follow-Up Required
- After this code is pushed and pulled on the VM, create persistent upload folders:

```bash
sudo mkdir -p /opt/project-fyp-mall/uploads/file /opt/project-fyp-mall/uploads/avatar
sudo chown -R www-data:www-data /opt/project-fyp-mall/uploads
```

- Add this to `/etc/project-fyp-mall.env`:

```text
MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads
```

- Rebuild and redeploy the frontend/backend as documented in `docs/cloud/phase-4-vm-diagnostics-2026-05-19.md`.

## Cloud Deployment Follow-Up Code Hardening: 2026-05-19

### Status
- **Code-side hardening for VM path/session issues:** complete locally; pending full verification and redeploy by user.

### Changes And Purpose
| Area | Files | Change | Purpose |
|---|---|---|---|
| Backend upload path fallback | `ElectronicMallApi/src/main/java/com/rufeng/em/config/UploadStorageProperties.java`, `ElectronicMallApi/src/test/java/com/rufeng/em/config/UploadStoragePropertiesTest.java` | Empty `mall.upload-dir` now resolves to `${user.dir}/uploads/{file,avatar}` instead of the classloader/JAR path. | Prevent uploads from falling back to `target/classes`, `target/test-classes`, or executable-JAR-derived paths when `MALL_UPLOAD_DIR` is missing. |
| Backend stale constants | `ElectronicMallApi/src/main/java/com/rufeng/em/constants/Constants.java` | Removed unused `fileFolderPath` and `avatarFolderPath` constants that still referenced `PathUtils.getClassLoadRootPath()`. | Avoid future maintenance accidentally reintroducing classloader-based upload storage. |
| Frontend expired session handling | `ElectronicMallVue/src/utils/request.js`, `ElectronicMallVue/scripts/check-auth-flows.js` | Axios response interceptor now handles backend `401` token/session expiry in addition to legacy `402`, clears `localStorage.user`, and redirects to `/login`. | Make role/login-status failures deterministic after Redis memory loss, backend restart, or stale browser token. |

### Red-Green Evidence
- `npm run check:auth` failed before the frontend change because `request.js` did not handle backend `401` responses.
- `mvn -q -Dtest=UploadStoragePropertiesTest test` failed before the backend change because empty upload config resolved to `target/test-classes/file/`.
- After the code changes, both targeted checks passed.

### Review Notes
- Production should still set `MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads` on the VM. The new fallback is a safer last resort, not a replacement for explicit production configuration.
- The current Nginx pattern strips the first external `/api`; legacy frontend calls that already include `/api/...` therefore still intentionally become `/api/api/...` externally so Spring controllers mapped under `/api/...` continue to match.

## Documentation Sync During Cloud Runtime Debugging: 2026-05-20

### Status
- Documentation synchronized for the Phase 4 runtime-debugging state at that time.
- This section is retained as historical context; later notes in this work log mark image/resource display as fixed.

### Updates
- Root `README.md` recorded that the Google Cloud server build was complete and cloud runtime debugging was active at that time.
- `docs/README.md` now includes a current checkpoint and points cloud debugging readers to `docs/cloud/README.md`.
- Added `docs/cloud/README.md` as the cloud deployment diagnostics index.
- Updated `docs/project/implementation-roadmap.md` with a Phase 4 implementation checkpoint.
- Updated `docs/reports/phase-4-cloud-deployment-report.md` with VM identifiers, service status from diagnostics, and the then-active image/resource blocker.
- Updated `docs/records/environment-setup-log.md` with the Google Cloud VM environment checkpoint.
- Updated `docs/engineering/repository-structure.md` to include the `docs/cloud/` directory purpose.

### Historical Blocker
- This image/resource blocker was fixed later on 2026-05-20. Continue to use `docs/cloud/phase-4-vm-diagnostics-2026-05-19.md` as diagnostic evidence, not as the current blocker list.

## Temporary Documentation Cleanup: 2026-05-20

### Status
- Temporary and already-integrated files were removed from the tracked repository.
- No project source code, canonical documentation, database seed, or deployment guide content was deleted.

### Removed From Tracking
- Root planning files:
  - `task_plan.md`
  - `findings.md`
  - `progress.md`
- Raw VM diagnostic archive:
  - `docs/cloud/fyp-mall-diagnostics.tar.gz`

### Reason
- The root planning files had been synchronized into this work log and the Phase 4 documentation.
- The diagnostic archive had been summarized into `docs/cloud/phase-4-vm-diagnostics-2026-05-19.md`.
- `.gitignore` now excludes root planning files and local cloud diagnostic archives so they are not accidentally pushed again.

## Project Metadata And Namespace Optimization: 2026-05-20

### Status
- Project metadata and namespace conventions were standardized across source files and documentation.
- Backend Java package and Maven group identifier now use the project-owned `com.rufeng` namespace.
- Database seed timestamps were normalized to the current project timeline while preserving table structure and sample data relationships.

### Verification
- Backend clean package verification passed.
- Frontend auth/deployment checks passed.
- Frontend production build passed with existing Browserslist and asset-size warnings.
- Project-wide metadata search confirmed the standardized namespace and file headers are applied consistently.

## Image Display Fix Documentation Sync: 2026-05-20

### Status
- Public product image and user avatar display is fixed.
- Documentation now treats the image/resource issue as resolved instead of an active blocker.
- Temporary Phase 4 handoff content has been consolidated into the cloud diagnostics report, Phase 4 report, and this work log.

### Findings
- Database path values were already correct: active `good.imgs` values use `/file/...` and active `sys_user.avatar_url` values use `/avatar/...`.
- The previous production failure was caused by deployed frontend bundles using browser-side `localhost:9191` and backend file storage expecting files under `uploads/file` and `uploads/avatar`.
- The durable production pattern is:
  - Vue production API/resource base: `/api`.
  - Nginx proxy: `/api/` to `http://127.0.0.1:9191/`.
  - Backend upload root: `MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads`.

### Documentation Updates
- Updated root `README.md`, `docs/README.md`, `docs/project/implementation-roadmap.md`, `docs/reports/phase-4-cloud-deployment-report.md`, `docs/cloud/README.md`, `docs/cloud/phase-4-vm-diagnostics-2026-05-19.md`, `docs/records/environment-setup-log.md`, `docs/engineering/cloud-deployment-guide.md`, and this work log.
- Updated `docs/reports/phase-3-email-verification-report.md` to record the email verification service configuration status.

### Current Email Verification State
- Email verification remains enabled for registration and forgot-password reset.
- Brevo SMTP credentials must stay in runtime environment variables only.
- Direct registration without email verification is not enabled.

## VM Runtime Follow-Up: 2026-06-15

### Status
- Google Cloud CLI connectivity from the local machine was confirmed.
- VM runtime health check completed.
- Stale Redis product cache was cleaned up and product detail API recovered.

### Findings
- `gcloud` is configured for account `a206331@siswa.ukm.edu.my`, project `cobalt-bond-496703-n2`, and zone `asia-southeast1-b`.
- VM `fyp-mall-vm` is running with public IP `34.143.225.11`.
- Nginx, MySQL, Redis, and Spring Boot are running.
- The actual active Spring Boot service is `project-fyp-mall.service`; the older documented `project-fyp-mall-api.service` name is not present on the VM.
- `/etc/project-fyp-mall.env` exists and has the expected MySQL, Redis, Brevo SMTP, and upload-directory keys set. Secret values were not printed.
- Frontend history routes returned the Vue app through Nginx.
- Product detail route `/api/api/good/3` initially failed with HTTP 500 and response body `{"code":"401","msg":"Session expired. Please log in again","data":null}`.
- Backend logs showed Redis deserialization failure for stale cached product data referencing old package `com.rabbiter.em.entity.Good`.
- Redis key `good:id:3` had no TTL, so it would not expire automatically.

### Fix Applied
- Deleted only the stale Redis product cache key:

```bash
redis-cli DEL good:id:3
```

### Verification
| Check | Result |
| --- | --- |
| `curl -i http://127.0.0.1/api/api/good/3` | HTTP 200 with product `Study Desk and Chair Set`. |
| `curl -i http://127.0.0.1/api/api/good/standard/3` | HTTP 200 with product standards. |

### Follow-Up
- Align repository deployment docs or VM service naming around `project-fyp-mall.service`.
- Clear Redis application cache after namespace/entity serialization changes.
- Consider a backend hardening change so stale product-cache deserialization falls back to database reload.

## phpMyAdmin Admin Setup: 2026-06-15

### Status
- phpMyAdmin was installed on the Google Cloud VM for browser-based administration of the `electronic_mall` database.
- The final access path is `http://34.143.225.11/phpmyadmin/`.
- No database tables or records were deleted.
- MySQL port `3306` was not opened to the public internet.

### Findings
- Apache and phpMyAdmin were not installed before this task.
- MySQL `8.0.46` was active on the VM.
- Nginx was already active on public TCP `80` for the production Vue frontend and `/api/` backend proxy.
- Existing firewall rule `allow-fyp-mall-http` already allowed TCP `80` for VM tag `fyp-mall-http`; no duplicate firewall rule was created.
- Apache initially failed to start after installation because Nginx already owned public TCP `80`.

### Fix Applied
- Installed Apache, PHP, required PHP extensions, and phpMyAdmin.
- Kept Nginx as the public web server.
- Changed Apache to listen only on `127.0.0.1:8081`.
- Enabled `/etc/phpmyadmin/apache.conf` under Apache.
- Added an Nginx `/phpmyadmin/` reverse proxy to local Apache.
- Created/updated `mall_admin@localhost` and granted privileges only on `electronic_mall.*`.
- Stored the generated MySQL password outside Git and documentation.

### Verification
| Check | Result |
| --- | --- |
| `apache2.service` | Active/running. |
| `nginx.service` | Active/running. |
| Public port `80` | Nginx on `0.0.0.0:80`. |
| Local Apache port | Apache on `127.0.0.1:8081`. |
| Public phpMyAdmin URL | HTTP 200 from `http://34.143.225.11/phpmyadmin/`. |
| MySQL login | `mall_admin@localhost` login succeeded. |
| MySQL grants | `ALL PRIVILEGES` on `electronic_mall.*`; global scope remains `USAGE`. |

### Documentation
- Added `docs/cloud/phpmyadmin-admin-setup-2026-06-15.md`.
- Updated `docs/cloud/README.md`.
- Updated `docs/README.md`.
- Consolidated root planning-file details into this work log and the new cloud note.

### Follow-Up
- Restrict `/phpmyadmin/` by source IP or disable the Nginx location block when not actively needed.
- Add HTTPS before treating phpMyAdmin as a long-term public administration endpoint.
- Keep phpMyAdmin and MySQL credentials out of Git.
