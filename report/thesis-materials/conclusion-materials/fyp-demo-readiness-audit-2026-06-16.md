# FYP Demo Readiness Audit - 2026-06-16

## Purpose

This record tracks the full project readiness audit requested on 2026-06-16. The target is to make the FYP electronic mall project demo-ready before thesis writing and Phase 6 JMeter/Jammer testing.

## Scope

- Review local source code and project structure.
- Review backend, frontend, database schema, deployment configuration, and documentation.
- Verify available build/test scripts and public demo endpoint where possible.
- Exclude thesis prose writing and Phase 6 JMeter/Jammer execution.

## Operation Log

| Time (+08) | Action | Result |
|---|---|---|
| 12:35 | Started repository inventory using `rg --files` and docs listing. | Confirmed Spring Boot backend, Vue frontend, SQL/migrations, deployment files, existing docs, and JMeter test plans are present. |
| 12:35 | Created root planning files. | Added `task_plan.md`, `findings.md`, and `progress.md` for persistent audit tracking. |
| 12:36 | Read root README, docs index, implementation roadmap, and repository structure. | Baseline docs say localization/core flow/email verification/cloud deployment are complete; JMeter performance evaluation remains planned. |
| 12:38 | Reviewed backend Maven/config/routes, SQL schema, and auth interceptors. | Backend layering and environment-driven config are suitable for demo. SQL has useful constraints/indexes, but seed data includes future dates after 2026-06-16. |
| 12:41 | Reviewed key backend services and frontend order views. | Registration/login/email verification are implemented. Current ordering path is demo-usable as a single-item flow, but backend multi-item order handling is incomplete. |
| 12:44 | Reviewed frontend router/request/store/env and validation scripts. | Fixed protected-route guard to stop after unauthenticated redirect; added a `check:auth` static assertion for the fix. |
| 12:47 | Checked GitHub/local git state and ran database schema static validation. | GitHub repo `Rufeng081/project-fyp-mall` is reachable; local `main` matched `origin/main` before audit edits; `node tools/check-database-schema.js` passed. |
| 12:50 | Ran local verification commands. | `npm run check:auth`, `npm run check:deployment`, `mvn -q test`, `mvn -q package`, and `npm run build` passed. Build warnings remain for Browserslist and large assets. |
| 12:54 | Checked public endpoint and live read flows. | Homepage loads in browser with title `R Mall | FYP E-Commerce System`; demo login and authenticated read APIs passed. Direct `/api/good` returns 401 due to current Nginx prefix-stripping path map, while `/api/api/good` works. |
| 12:58 | Updated documentation. | Refreshed docs index, verification workflow, cloud notes, deployment docs, and this audit record. |
| 13:04 | Ran read-only `gcloud` VM checks. | VM is running; Nginx, Spring Boot, MySQL, and Redis are active; upload directories exist; live MySQL tables, key indexes, and foreign keys are present; recent backend/Nginx error logs are empty. |
| 13:08 | Ran final lightweight verification. | `git diff --check`, `node tools/check-database-schema.js`, and `npm run check:auth` passed. Only CRLF-to-LF warning reported for `ElectronicMallVue/src/router/index.js`. |

## Current Status

Demo readiness audit complete.

## Readiness Decision

The project is demo-usable for the intended FYP scope, excluding thesis writing and Phase 6 JMeter/Jammer execution. The core storefront, login, public product/category browsing, cart/order history read flows, email verification implementation, deployment configuration, database schema, and documentation structure are in acceptable shape for a controlled demo.

Remaining risks should be handled before final thesis screenshots or performance testing:

- Public API path mapping is confusing and must be followed exactly during manual checks.
- Live cloud data timestamps still differ from repository seed data.
- Current checkout flow should be described as single-item checkout unless backend multi-item order handling is strengthened.
- Password storage remains frontend MD5 and should be documented as a demo limitation.
- Public mutation checks for add-to-cart, place-order, and simulated payment were intentionally not executed in this audit because Phase 6/JMeter mutation testing is deferred.

## Findings

- Documentation is already structured into project, engineering, database, cloud, records, reports, verification, testing, and assets.
- `docs/README.md` should be updated to include this 2026-06-16 audit record and any readiness status changes found during verification.
- Backend API surface covers the required small e-commerce modules.
- Database schema is reasonable for FYP demo scope, with unique keys, indexes, and foreign keys already present.
- Demo-data date consistency needs attention because several seed rows are dated July/August 2026 while this audit date is 2026-06-16.
- The implemented UI places orders one cart/product item at a time. The backend should not be described as supporting full multi-item checkout unless it is strengthened.
- Production frontend API/resource configuration is suitable for Nginx `/api` deployment.
- A frontend auth guard defect was fixed during this audit.
- Canonical SQL passed the existing database schema validation script.
- Local build/test status is currently green.
- Public storefront is reachable and browser-rendered content is visible.
- Public endpoint path mapping must be documented carefully: direct manual API checks for backend `/api/*` routes should use `/api/api/*` under the current Nginx config, while backend root routes such as `/login` are exposed as `/api/login`.
- Live cloud data still has 2023 cart/order timestamps, while repository seed data has 2026 timestamps. This is not a functional blocker but should be explained before thesis screenshots or final demo evidence.

## Verification Evidence

| Check | Result |
|---|---|
| `node tools/check-database-schema.js` | Passed |
| `npm run check:auth` | Passed |
| `npm run check:deployment` | Passed |
| `mvn -q test` | Passed |
| `mvn -q package` | Passed |
| `npm run build` | Passed with existing Browserslist/asset-size warnings |
| `curl -I http://34.143.225.11/` | HTTP 200 from Nginx |
| Browser load `http://34.143.225.11/` | Loaded `/topview`, title `R Mall | FYP E-Commerce System`, storefront content visible, no captured console errors/warnings |
| Public demo login | Passed for `user` |
| Public authenticated `userid`, address, cart, order history reads | Passed |
| `gcloud compute instances list --filter=name=fyp-mall-vm` | VM RUNNING at `34.143.225.11` |
| VM service checks | `nginx`, `project-fyp-mall.service`, `mysql`, and `redis-server` active |
| VM live MySQL schema checks | Expected tables, key indexes, and foreign keys present |
| VM recent error logs | No backend or Nginx error entries in the last 30 minutes |

## Open Items

- Backend code and API review.
- Frontend route/request/user-flow review.
- Database schema/entity/mapper consistency review.
- Build and test verification.
- Public endpoint/cloud readiness check.
- Documentation synchronization.
