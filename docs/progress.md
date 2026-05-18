# Progress Log

## Session: 2026-05-17

### Phase 1: System Localization and Interface Standardization
- **Status:** complete
- Actions taken:
  - Read `docs/FYP_PROJECT_OPTIMIZATION_PLAN.md`.
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
  - `ElectronicMallVue/src/`
  - `ElectronicMallApi/src/main/java/`
  - `ElectronicMallApi/src/main/resources/mapper/Income.xml`
  - `database/electronic_mall.sql`
  - `README.md`
  - `docs/task_plan.md`
  - `docs/findings.md`
  - `docs/progress.md`

## Test Results
| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| Baseline Chinese text audit | `rg -n "[\p{Han}]" ...` | Findings before localization | Found Chinese UI, backend messages, comments, and seed data | complete |
| Baseline currency audit | `rg -n "¥|￥|RMB|CNY|元|人民币"` | Findings before localization | Found RMB/yuan markers in Vue files and seed data context | complete |
| Front-end build | `npm run build` in `ElectronicMallVue` | Exit 0 | Exit 0; only Browserslist and asset-size warnings | complete |
| Back-end package | `mvn clean package` in `ElectronicMallApi` | Exit 0 | Exit 0; no tests configured | complete |
| Front-end visible Chinese audit | `rg -n "[\p{Han}]" ElectronicMallVue/src --glob '!ElectronicMallVue/src/resource/**' --glob '!ElectronicMallVue/src/views/front/good/index.html'` | No matches | No matches | complete |
| Currency/China payment audit | `rg -n "¥|￥|RMB|CNY|人民币|支付宝|微信|Pay宝|元" ElectronicMallVue/src ElectronicMallApi/src database README.md --glob '!ElectronicMallVue/src/resource/**'` | No matches | No matches | complete |
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
- Screenshot saved: `docs/phase2_order_history_verified.png`.

## Final Phase 1/2 Acceptance Closure: 2026-05-18

### Status
- **Phase 1:** complete and accepted.
- **Phase 2:** complete and accepted.
- **Next phase:** Phase 3 registration email verification code.

### Issue Found and Fixed
- Found that Vue Router history-mode routes such as `/topview`, `/login`, `/register`, `/goodView/3`, and `/orderList` returned `404` for generic GET requests against the Vue dev server.
- Root cause: Vue CLI's default `historyApiFallback.htmlAcceptHeaders` accepted browser-style HTML requests but did not include `*/*`.
- Fix: updated `ElectronicMallVue/vue.config.js` with explicit `historyApiFallback` configuration.
- Regression check: added `ElectronicMallVue/scripts/check-history-routes.js` and `npm run check:routes`.

### Files Changed
- `ElectronicMallVue/vue.config.js`
- `ElectronicMallVue/package.json`
- `ElectronicMallVue/scripts/check-history-routes.js`
- `tools/phase12-api-golden-path.js`
- `docs/PHASE_1_2_FINAL_ACCEPTANCE_REVIEW.md`
- `docs/README.md`
- `docs/task_plan.md`
- `docs/findings.md`
- `docs/progress.md`
- `docs/PHASE_1_2_LOCALIZATION_STABILIZATION_REPORT.md`

### Final Verification Results
| Test | Command | Result | Status |
|---|---|---|---|
| Front-end route fallback red test | `npm run check:routes` before fix | Failed for 11 deep routes with HTTP 404 | complete |
| Front-end route fallback green test | `npm run check:routes` after fix | Passed for 12 routes | complete |
| Front-end build | `npm run build` in `ElectronicMallVue` | Exit 0; Browserslist and asset-size warnings only | complete |
| Back-end package | `mvn clean package` in `ElectronicMallApi` | Exit 0; `BUILD SUCCESS`; no tests configured | complete |
| Front-end visible Chinese audit | `rg -n "[\p{Han}]" ElectronicMallVue/src --glob '!ElectronicMallVue/src/resource/**' --glob '!ElectronicMallVue/src/views/front/good/index.html'` | No matches | complete |
| Currency/China payment audit | `rg -n "¥|￥|RMB|CNY|人民币|支付宝|微信|Pay宝|元" ElectronicMallVue/src ElectronicMallApi/src database README.md --glob '!ElectronicMallVue/src/resource/**'` | No matches | complete |
| Database Chinese audit | `rg -n "[\p{Han}]" database/electronic_mall.sql` | No matches | complete |
| China-context seed/source audit | `rg -n "China|Chinese|Beijing|Shanghai|Guangzhou|¥|RMB|CNY|Alipay|WeChat|Weixin|支付宝|微信" database/electronic_mall.sql ElectronicMallVue/src ElectronicMallApi/src --glob '!ElectronicMallVue/src/resource/**'` | No matches | complete |
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
- Added `docs/PHASE_3_BREVO_EMAIL_VERIFICATION_REPORT.md`.

### Phase 3 Test Results
| Test | Command | Result | Status |
|---|---|---|---|
| TDD red test | `mvn -q -Dtest=EmailVerificationServiceTest test` before implementation | Failed because `EmailVerificationService` and mail dependency did not exist | complete |
| SMTP failure red/green test | `mvn -q -Dtest=EmailVerificationServiceTest test` | First failed with raw `MailSendException`, then exited 0 after cleanup handling | complete |
| Backend unit tests | `mvn -q -Dtest=EmailVerificationServiceTest,UserServiceEmailAuthTest test` | Exit 0 | complete |
| Full backend tests | `mvn -q test` in `ElectronicMallApi` | Exit 0 | complete |
| Backend package | `mvn -q package` in `ElectronicMallApi` | Exit 0 | complete |
| Frontend production build | `npm run build` in `ElectronicMallVue` | Exit 0; existing Browserslist and asset-size warnings only | complete |
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
- Re-read `docs/task_plan.md` as required by the planning-with-files workflow.
- Root cause: the hook script counts every heading beginning with `### Phase`; `### Phase 3 Decisions` and `### Phase 3 Verification Snapshot` were counted as extra phases without `**Status:** complete`.
- Resolution: rename those two informational headings so only actual phase headings start with `### Phase`.
