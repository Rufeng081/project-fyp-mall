# Verification Workflow

Date: 2026-06-16

This document defines the repeatable verification workflow for the FYP mall project. Use it before accepting authentication, email verification, storefront, order, or documentation changes.

## 1. Scope Gate

Before testing, identify the affected surface:

| Area | Required Evidence |
|---|---|
| Authentication | Backend auth tests, frontend auth static check, login/register source review |
| Email verification | Email service tests, user email-auth tests, Redis key behavior, SMTP runtime configuration check |
| Storefront and orders | Core API golden path, frontend build, route fallback check |
| Documentation | Docs index updated, change log/report updated, no unauthorized deletion |

## 2. Environment Baseline

Required local services:

```bash
lsof -nP -iTCP:3306 -sTCP:LISTEN
lsof -nP -iTCP:6379 -sTCP:LISTEN
lsof -nP -iTCP:9191 -sTCP:LISTEN
```

Expected services:

| Service | Port | Purpose |
|---|---:|---|
| MySQL | 3306 | Mall data, users, carts, orders |
| Redis | 6379 | JWT session and email verification code state |
| Spring Boot API | 9191 | Backend endpoints |
| Vue dev server | 9192 or selected fallback port | Route fallback verification |

## 3. Backend Verification

Run targeted authentication and email verification tests first:

```bash
cd <backend-module>
mvn -q -Dtest=EmailVerificationServiceTest,UserServiceEmailAuthTest test
```

Then run the full backend suite and package:

```bash
cd <backend-module>
mvn -q test
mvn -q package
```

Acceptance criteria:

- Tests exit with code `0`.
- Email code tests prove 6-digit code storage, 5-minute TTL, 60-second cooldown, wrong-code rejection, successful-code deletion, and SMTP failure cleanup.
- User email-auth tests prove email registration, duplicate email protection, password reset, username/email account login, registration auto-login, and default nickname behavior.
- Packaging exits with code `0`.

## 4. Frontend Verification

Run authentication wiring checks:

```bash
cd <frontend-module>
npm run check:auth
```

Build the Vue app:

```bash
cd <frontend-module>
npm run build
```

Start the dev server and verify history fallback routes:

```bash
cd <frontend-module>
npm run serve -- --host 127.0.0.1 --port 9192
```

If Vue selects a fallback port, pass that port to the route checker:

```bash
cd <frontend-module>
FRONTEND_PORT=<actual-port> npm run check:routes
```

Acceptance criteria:

- `npm run check:auth` prints `Auth flow checks passed.`
- `npm run build` exits with code `0`; existing Browserslist and bundle-size warnings are acceptable unless they become errors.
- `npm run check:routes` passes for 12 routes.

## 5. Core API Golden Path

With the backend, MySQL, and Redis running, execute:

```bash
node tools/phase12-api-golden-path.js
```

This script intentionally creates local verification data. It checks:

- Product list and localized seed product.
- Category groups and localized seed category.
- Carousel list.
- Product detail and standard options.
- Product image endpoint.
- Plain registration and login.
- Default demo user login.
- Authenticated user id.
- Malaysia-style address data.
- Cart creation and lookup.
- Order creation.
- Simulated payment.
- Paid order history.
- No visible Chinese characters in checked business payloads.

Acceptance criteria:

- Script exits with code `0`.
- Output includes `registeredUser`, `cartItemId`, `orderNo`, `orderState: "Paid"`, and Malaysia-style delivery phone.

## 5.1 Public Endpoint Path Mapping

The current public deployment uses `VUE_APP_API_BASE_URL=/api` and an Nginx `/api/` proxy that strips the first `/api/` segment before forwarding to Spring Boot.

Use these public URL patterns for manual checks:

| Backend route type | Backend path | Public path |
|---|---|---|
| Backend root route | `/login` | `/api/login` |
| Backend root route | `/userid` | `/api/userid` |
| Backend `/api/*` route | `/api/good` | `/api/api/good` |
| Backend `/api/*` route | `/api/carousel` | `/api/api/carousel` |
| Uploaded file | `/file/<name>` | `/api/file/<name>` |
| Avatar file | `/avatar/<name>` | `/api/avatar/<name>` |

Do not use `http://34.143.225.11/api/good` as a public manual check for product list under the current Nginx template. It forwards to backend `/good` and returns `401`.

## 6. Email Verification Runtime Checklist

For live SMTP verification, use runtime environment variables only:

```text
BREVO_SMTP_USERNAME
BREVO_SMTP_KEY
BREVO_SENDER_EMAIL
```

Never commit, print, or document the real SMTP key.

Live verification checklist:

1. Start Spring Boot with the Brevo environment variables.
2. Send registration code through `POST /api/auth/send-email-code` with `purpose=register`.
3. Complete `POST /api/auth/register-by-email`.
4. Confirm response `data` is a login session DTO with token.
5. Confirm the new user's `nickname` equals the registered username.
6. Confirm the Redis registration code key is deleted after use.
7. Send reset code through `POST /api/auth/send-email-code` with `purpose=reset`.
8. Complete `POST /api/auth/reset-password-by-email`.
9. Confirm response `data` is a login session DTO with token.
10. Confirm login succeeds with the reset password.
11. Confirm the Redis reset code key is deleted after use.
12. Confirm Brevo Transactional Email Logs show the expected verification-code events.

## 7. Documentation Gate

Before handoff:

- Update `docs/README.md` when adding or reclassifying documents.
- Add current verification evidence to `docs/records/project-work-log.md` or a dedicated report.
- Add important technical findings to `docs/records/project-work-log.md`.
- Keep historical phase reports as immutable evidence unless correcting a documented factual error.
- Consolidate duplicate records into the relevant report or `docs/records/project-work-log.md`.
- Update `docs/README.md` when files are moved, renamed, or merged.

## 8. Current Acceptance Snapshot

Latest local and public verification on 2026-06-16:

| Check | Result |
|---|---|
| `mvn -q test` | Passed |
| `mvn -q package` | Passed |
| `npm run check:auth` | Passed |
| `npm run check:deployment` | Passed |
| `npm run build` | Passed with existing Browserslist and asset-size warnings |
| `node tools/check-database-schema.js` | Passed |
| Public homepage `http://34.143.225.11/` | HTTP 200; browser loaded `/topview` with title `Online Mall` |
| Public demo login and authenticated read APIs | Passed for user ID, addresses, cart, and order history |

Not executed in this 2026-06-16 audit:

- Local `node tools/phase12-api-golden-path.js`, because it requires running local MySQL/Redis/backend services and mutates data.
- Public add-to-cart, place-order, and simulated-payment mutations, because Phase 6/JMeter mutation testing is intentionally deferred.
