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
- Project structure includes Spring Boot backend under `ElectronicMallApi`, Vue frontend under `ElectronicMallVue`, and existing docs under `docs`.
- Backend already has email verification service and tests: `EmailVerificationServiceTest` and `UserServiceEmailAuthTest`.
- Frontend already has authentication flow checker script: `ElectronicMallVue/scripts/check-auth-flows.js`.
- `docs/PHASE_3_BREVO_EMAIL_VERIFICATION_REPORT.md` records Brevo SMTP email code implementation, Redis 5-minute code TTL, 60-second resend cooldown, registration/reset purposes, database unique email index, and live SMTP verification notes.
- `docs/auth_auto_login_change_log.md` records today's auto-login change: registration/reset return `UserDTO`, front-end stores `localStorage.user`, login uses `account`, and default nickname becomes username.
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
- `/Users/rufeng/Desktop/project-fyp-mall/ElectronicMallApi`
- `/Users/rufeng/Desktop/project-fyp-mall/ElectronicMallVue`
- `/Users/rufeng/Desktop/project-fyp-mall/docs`

## Visual/Browser Findings
- No browser findings yet.
