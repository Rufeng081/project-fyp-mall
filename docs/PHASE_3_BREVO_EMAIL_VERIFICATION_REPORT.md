# Phase 3 Brevo Email Verification Report

## 1. Objective

Implement Phase 3 account verification for the Spring Boot + Vue electronic mall project.

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

- `ElectronicMallApi/pom.xml`
- `ElectronicMallApi/src/main/resources/application.yml`
- `ElectronicMallApi/src/main/java/com/rabbiter/em/constants/RedisConstants.java`
- `ElectronicMallApi/src/main/java/com/rabbiter/em/config/InterceptorConfig.java`
- `ElectronicMallApi/src/main/java/com/rabbiter/em/controller/AuthController.java`
- `ElectronicMallApi/src/main/java/com/rabbiter/em/service/EmailVerificationService.java`
- `ElectronicMallApi/src/main/java/com/rabbiter/em/service/UserService.java`
- `ElectronicMallApi/src/main/java/com/rabbiter/em/entity/dto/EmailCodeRequest.java`
- `ElectronicMallApi/src/main/java/com/rabbiter/em/entity/dto/EmailRegisterRequest.java`
- `ElectronicMallApi/src/main/java/com/rabbiter/em/entity/dto/EmailPasswordResetRequest.java`

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

- `ElectronicMallVue/src/views/Register.vue`
- `ElectronicMallVue/src/views/Login.vue`

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
cd ElectronicMallApi
mvn -q -Dtest=EmailVerificationServiceTest test
```

Initial expected result:

- Failed because `EmailVerificationService` and mail support were not implemented.

Observed result:

- Maven compilation failed on missing `EmailVerificationService`.
- Maven also reported missing JavaMail classes, confirming the project did not yet include Spring Boot Mail support.

### Backend Unit Tests

Tests added:

- `ElectronicMallApi/src/test/java/com/rabbiter/em/service/EmailVerificationServiceTest.java`
- `ElectronicMallApi/src/test/java/com/rabbiter/em/service/UserServiceEmailAuthTest.java`

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
cd ElectronicMallApi
mvn -q -Dtest=EmailVerificationServiceTest,UserServiceEmailAuthTest test
```

Result:

- Exit code `0`.

### Full Build Verification

Commands:

```bash
cd ElectronicMallApi
mvn -q test
mvn -q package

cd ../ElectronicMallVue
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
