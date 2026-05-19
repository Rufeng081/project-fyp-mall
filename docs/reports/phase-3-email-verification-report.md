# Phase 3 Brevo Email Verification Report

## 1. Objective

Implement Phase 3 account verification for the Spring Boot + Vue e-commerce platform.

Scope completed in this phase:

- Email verification code registration using Brevo SMTP.
- Redis-backed 6-digit verification code storage with 5-minute expiry.
- 60-second resend protection per email and purpose.
- Unique email constraint for `sys_user.email`.
- Forgot-password reset by email verification code.
- Frontend registration and password reset UI updates.
- README setup instructions for Brevo SMTP environment variables.

## 2. Implementation Summary

### Backend

Files changed:

- `<backend-module>/pom.xml`
- `<backend-module>/src/main/resources/application.yml`
- `<backend-module>/src/main/java/<backend-package>/constants/RedisConstants.java`
- `<backend-module>/src/main/java/<backend-package>/config/InterceptorConfig.java`
- `<backend-module>/src/main/java/<backend-package>/controller/AuthController.java`
- `<backend-module>/src/main/java/<backend-package>/service/EmailVerificationService.java`
- `<backend-module>/src/main/java/<backend-package>/service/UserService.java`
- `<backend-module>/src/main/java/<backend-package>/entity/dto/EmailCodeRequest.java`
- `<backend-module>/src/main/java/<backend-package>/entity/dto/EmailRegisterRequest.java`
- `<backend-module>/src/main/java/<backend-package>/entity/dto/EmailPasswordResetRequest.java`

Added Spring Boot Mail support through `spring-boot-starter-mail`.

Configured Brevo SMTP without hardcoded secrets:

```yaml
spring.mail.host: smtp-relay.brevo.com
spring.mail.port: 587
spring.mail.username: ${BREVO_SMTP_USERNAME:}
spring.mail.password: ${BREVO_SMTP_KEY:}
brevo.sender-email: ${BREVO_SENDER_EMAIL:}
```

Added public authentication APIs:

| API | Purpose |
|---|---|
| `POST /api/auth/send-email-code` | Sends a 6-digit code for `register` or `reset`. |
| `POST /api/auth/register-by-email` | Creates a user after email code verification. |
| `POST /api/auth/reset-password-by-email` | Resets forgotten password after email code verification. |

Redis key format:

```text
auth:email:code:{purpose}:{email}
auth:email:cooldown:{purpose}:{email}
```

Business rules:

- Code length: 6 digits.
- Code TTL: 5 minutes.
- Resend cooldown: 60 seconds.
- Registration rejects duplicate username or email.
- Password reset only sends a code if the email belongs to an existing user.
- Verification code is deleted after successful use.
- Redis code and cooldown keys are removed if SMTP delivery fails.

### Database

File changed:

- `database/electronic_mall.sql`

Added unique email index to the seed schema:

```sql
UNIQUE KEY `uk_sys_user_email` (`email`) USING BTREE
```

For existing local databases created before this phase, apply:

```sql
ALTER TABLE sys_user ADD UNIQUE KEY uk_sys_user_email (email);
```

### Frontend

Files changed:

- `<frontend-module>/src/views/Register.vue`
- `<frontend-module>/src/views/Login.vue`

Registration page changes:

- Added email field.
- Added verification code field.
- Added `Send Code` button with 60-second countdown.
- Changed registration submission from `/register` to `/api/auth/register-by-email`.

Login page changes:

- Added `Forgot password?` action.
- Added reset password dialog with email, code, new password, confirm password, and `Send Code` button.
- Added API call to `/api/auth/reset-password-by-email`.

## 3. Testing and Verification

### TDD Red Step

Command:

```bash
cd <backend-module>
mvn -q -Dtest=EmailVerificationServiceTest test
```

Initial expected result:

- Failed because `EmailVerificationService` and mail support were not implemented.

Observed result:

- Maven compilation failed on missing `EmailVerificationService`.
- Maven also reported missing JavaMail classes, confirming the project did not yet include Spring Boot Mail support.

### Backend Unit Tests

Tests added:

- `<backend-module>/src/test/java/<backend-package>/service/EmailVerificationServiceTest.java`
- `<backend-module>/src/test/java/<backend-package>/service/UserServiceEmailAuthTest.java`

Verified behavior:

- Sending code stores a 6-digit code in Redis for 5 minutes.
- Sending code creates a 60-second cooldown key.
- Sending during cooldown is rejected.
- Correct code verification deletes the Redis code.
- Wrong code is rejected.
- Email registration verifies code and saves normalized email.
- Duplicate email registration is rejected before consuming the code.
- Email password reset verifies code and updates the password.

Command:

```bash
cd <backend-module>
mvn -q -Dtest=EmailVerificationServiceTest,UserServiceEmailAuthTest test
```

Result:

- Exit code `0`.

### Full Build Verification

Commands:

```bash
cd <backend-module>
mvn -q test
mvn -q package

cd ../<frontend-module>
npm run build
npm run dev
npm run check:routes
```

Results:

- `mvn -q test`: exit code `0`.
- `mvn -q package`: exit code `0`.
- `npm run build`: exit code `0`; existing Browserslist and asset-size warnings only.
- `npm run check:routes`: passed for 12 routes against the Vue dev server on `http://localhost:9192`.

### Current Verification Limitation

Live Brevo SMTP delivery was verified on 2026-05-18 using runtime environment variables only:

- `BREVO_SMTP_USERNAME`
- `BREVO_SMTP_KEY`
- `BREVO_SENDER_EMAIL`

The actual SMTP key is not committed, not written to documentation, and was only used in the local backend process environment.

Verified live outcomes:

- Registration verification email was sent through Brevo SMTP.
- Brevo Transactional Email Logs showed `Online Mall verification code` events, including `Sent`, `Delivered`, and `First opening`.
- Registration completed through `POST /api/auth/register-by-email`.
- New registered user login succeeded through `POST /login`.
- Forgot-password reset verification email was sent through Brevo SMTP.
- Password reset completed through `POST /api/auth/reset-password-by-email`.
- Login with the reset password succeeded through `POST /login`.
- Redis verification keys were removed after successful code consumption.
- The local `sys_user.email` unique index was present and the live-test user was persisted with role `user`.

During live setup, two generated Brevo SMTP keys failed authentication because the captured values did not match the active full key. The final working key was supplied directly by the user and used only at runtime.

## 4. Industrial Process Log

1. Read the existing backend user controller, user service, user entity, MyBatis mapper, Redis configuration, application configuration, and Maven dependencies.
2. Read the existing Vue registration page, login page, Axios request wrapper, and router.
3. Confirmed that `sys_user.email` existed but was not unique in the database schema.
4. Confirmed that existing registration used `/register` without email verification.
5. Confirmed that existing password reset was an admin-style `/user/resetPassword` endpoint requiring user id, not a forgot-password flow.
6. Wrote failing backend tests before adding the new email verification service.
7. Added Spring Boot Mail dependency and Brevo SMTP environment-variable configuration.
8. Implemented `EmailVerificationService` for code generation, Redis storage, resend cooldown, email validation, and mail sending.
9. Added DTOs and `AuthController` endpoints for email code, email registration, and email password reset.
10. Extended `UserService` with email registration, send-code business checks, password reset by email, and email uniqueness checks for admin user save/update.
11. Excluded `/api/auth/**` from JWT interception because these endpoints must be available before login.
12. Updated the Vue registration page with email code controls and `/api/auth/register-by-email`.
13. Updated the Vue login page with a forgot-password dialog and `/api/auth/reset-password-by-email`.
14. Updated database schema with a unique email index.
15. Updated README with Brevo SMTP setup instructions and endpoint summary.
16. Recorded this report for review traceability.

## 5. Review Notes

- This implementation is intentionally simple for an undergraduate FYP project.
- Password hashing remains consistent with the existing frontend MD5 flow.
- Redis is used only for short-lived verification state.
- No SMTP secret is committed to the repository.
- For production, future improvements could include stronger password hashing, failed-code attempt limits, HTML email templates, audit logs, and a dedicated migration tool such as Flyway or Liquibase.

## 6. Authentication Follow-up: Auto-Login and Account Login

Date: 2026-05-18

Follow-up work aligned registration, forgot-password reset, and login behavior:

- Successful email registration returns the authenticated user DTO.
- Successful email password reset returns the authenticated user DTO.
- The frontend stores the returned user DTO in `localStorage.user` after registration or reset.
- New users receive a default nickname equal to the registered username.
- Login accepts a single `account` value that can be either username or email.
- Missing login account input returns a controlled validation error instead of a null-pointer failure.

Verification evidence:

| Check | Result |
| --- | --- |
| Targeted auth tests | Passed. |
| Full backend tests | Passed. |
| Frontend auth wiring check | Passed with `Auth flow checks passed.` |
| Frontend production build | Passed with existing bundle-size and Browserslist warnings only. |

The follow-up change stayed limited to authentication service/controller behavior, the login and registration views, focused tests, and regression check scripts.

## Appendix A: Authentication Auto-Login Change Detail

### Source Detail: Authentication Auto-Login Change Log

Date: 2026-05-18

## Goal

Implement the smallest practical authentication changes so that:

- A newly registered user is logged in immediately after registration.
- A user who completes email password reset is logged in immediately.
- New users receive a default nickname equal to their registered username.
- Login accepts either username or email with the same password field.

## Operations, Purpose, and Findings

| Operation | Purpose | Finding |
| --- | --- | --- |
| Listed repository files with `rg --files` and checked `git status --short`. | Identify project layout and avoid overwriting unrelated work. | Workspace was clean. The project has `<backend-module>` for Spring Boot APIs and `<frontend-module>` for Vue UI. |
| Read `AuthController`, `UserController`, `UserService`, `LoginForm`, `UserDTO`, and existing email auth tests. | Locate registration, login, reset, token, and test behavior. | Login only queried `username`; email register returned `User`; reset returned a success string; registration nickname defaulted to `"New User"`. |
| Read `Register.vue`, `Login.vue`, `request.js`, and router configuration. | Locate client-side post-auth navigation and token storage. | Login stored `res.data` in `localStorage`, but registration pushed users back to `/login`; reset only closed the dialog. |
| Added failing tests in `UserServiceEmailAuthTest`. | Prove the requested behaviors before changing production code. | Initial run failed because `registerByEmail` returned `User`, `resetPasswordByEmail` returned `void`, and login SQL did not include `email`. |
| Updated `UserService`. | Centralize token creation and keep backend behavior consistent. | Added a shared `createLoginSession(User)` helper, changed login lookup to `username OR email`, returned `UserDTO` from registration/reset, and set default nickname to username. |
| Updated `AuthController` and `UserController`. | Return the logged-in DTO to clients after registration/reset. | Existing `Result.success(...)` envelope stayed unchanged. Only the payload changed from `User`/message to `UserDTO`. |
| Updated `Register.vue` and `Login.vue`. | Store returned login state and avoid forcing manual login. | Registration now writes `localStorage.user` and routes to `/`; reset writes `localStorage.user`, closes the dialog, and routes to the requested target. Login label now says `Account`. |
| Ran `mvn test -Dtest=UserServiceEmailAuthTest`. | Verify targeted backend behavior. | The targeted test class passed: 4 tests, 0 failures, 0 errors. |
| Ran `mvn test`. | Verify all backend tests after the targeted fix. | Backend test suite passed: 9 tests, 0 failures, 0 errors. |
| Ran `npm run build`. | Verify the Vue app still compiles. | Build completed successfully. Existing warnings remain for outdated browserslist data and large bundle/assets. |
| Checked `git status --short`, `git diff --stat`, and reviewed the changed files. | Confirm scope stayed minimal and no generated build output was included. | Tracked changes are limited to auth service/controllers, auth views, tests, and this documentation file. |
| Re-opened the issue after user verification feedback. | Re-check whether the implementation matched the requested behavior rather than only passing narrow tests. | Found the login UI label said `Account`, but the request DTO and Vue model still used `username`, so the Account contract was incomplete. |
| Read `LoginForm`, `Login.vue`, `Front.vue`, `Navagation.vue`, and `RoleController`. | Trace how login state is passed from auth response to front-end login display. | Front-end login status depends on `localStorage.user.token` and `/role`; registration/reset must store the returned `UserDTO`, not only navigate. |
| Added a failing test for `LoginForm.account`. | Prove `/login` can accept a real `account` field. | Initial run failed because `LoginForm` had no `setAccount(...)` method. |
| Added `account` to `LoginForm` and updated `UserService.login`. | Make the API contract match the UI and support username or email login. | `login()` now prefers `account`, falls back to `username`, and checks username plus exact/case-normalized email. |
| Updated `Login.vue` to bind and submit `user.account`. | Ensure the browser sends the actual `account` field. | Login no longer binds the Account input to `user.username`. |
| Added `npm run check:auth`. | Add a frontend regression check for auth form wiring and login-state storage. | The script verifies Account binding and verifies registration/reset store `res.data` into `localStorage.user`. |
| Added a regression test for plain `/register`. | Ensure non-email registration also returns login state and default nickname equals username. | Test passed after the service returned `UserDTO` and set nickname from username. |

## Minimal Change Review Notes

- The main logic change is limited to authentication service/controller methods and the two auth views.
- No database schema, route guard, interceptor, or request wrapper changes were required.
- Existing token generation and Redis session storage remain the single source of login session behavior.
- The API response envelope remains `Result`; only successful registration/reset data now matches login success data.

## Verification Log

- `mvn test -Dtest=UserServiceEmailAuthTest` from `<backend-module>`: passed with 4 tests, 0 failures, 0 errors.
- `mvn test` from `<backend-module>`: passed with 9 tests, 0 failures, 0 errors.
- `npm run build` from `<frontend-module>`: completed successfully with existing browserslist and asset-size warnings.
- Final diff review: scope is limited to authentication behavior, focused tests, and this record.

## Follow-up Verification After User Feedback

- `mvn test -Dtest=UserServiceEmailAuthTest` from `<backend-module>`: passed with 6 tests, 0 failures, 0 errors.
- `npm run check:auth` from `<frontend-module>`: passed and printed `Auth flow checks passed.`
- `mvn test` from `<backend-module>`: passed with 11 tests, 0 failures, 0 errors.
- `npm run build` from `<frontend-module>`: completed successfully with the existing browserslist and asset-size warnings.
- `git diff --check`: passed with only CRLF/LF normalization warnings.
