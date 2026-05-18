# Task Plan: Phase 1 System Localization and Interface Standardization

## Goal
Convert the mall project into an English-based, Malaysia-context e-commerce platform for the FYP demonstration.

## Current Phase
Phase 1 and Phase 2 complete; Phase 3 Brevo email verification implementation complete and locally verified. Live SMTP delivery still requires runtime Brevo environment variables.

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
- Vue dev server uses explicit history fallback so direct deep links under `http://localhost:9192/` return the SPA entry.
- Static audits found no China/RMB currency markers in source, back-end, database, or README after localization.
- Final Phase 1/2 acceptance was completed on 2026-05-18. See `docs/PHASE_1_2_FINAL_ACCEPTANCE_REVIEW.md`.

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
- [x] Add Phase 3 review report at `docs/PHASE_3_BREVO_EMAIL_VERIFICATION_REPORT.md`.

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
