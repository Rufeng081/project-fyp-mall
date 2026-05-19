# Phase 4 Progress Log

## 2026-05-19

- Started Phase 4 Cloud Deployment and Network Configuration.
- Read `docs/project/implementation-roadmap.md` Phase 4 scope and deliverables.
- Inspected local backend/frontend configuration and top-level README.
- Confirmed working tree was clean before starting.
- Created persistent planning files for this deployment session.
- Added `npm run check:deployment` as a frontend deployment configuration check.
- Verified the new check fails before implementation because `.env.production` is missing and Axios still has a local backend base URL.
- Updated frontend API configuration to use `VUE_APP_API_BASE_URL`, with local development using `http://localhost:9191` and production using `/api`.
- Updated backend YAML so server port, MySQL connection, and Redis connection can be overridden by deployment environment variables.
- `npm run check:deployment` passed after the deployment configuration changes.
- Local verification before cloud provisioning:
  - `npm run check:auth` passed.
  - `npm run check:deployment` passed.
  - `mvn -q package` passed.
  - `npm run build` passed with existing Browserslist and asset-size warnings.
- Committed Phase 4 deployment code/docs as `d0bbc0d` and pushed `main` to `origin` so the VM can clone the updated repository.

## 2026-05-19 VM Diagnostics Follow-Up

- Started post-install diagnosis from `docs/cloud/fyp-mall-diagnostics.tar.gz`.
- Re-read the Phase 4 handoff and confirmed the previous stop point was before copying/restarting the executable backend JAR.
- Extracted the diagnostic bundle to `/private/tmp/fyp-mall-diagnostics-current`.
- Confirmed current VM diagnostics show all core services active and ports listening.
- Recorded first evidence: frontend is served by Nginx, but `/api/good/page` returns the application's unauthenticated/session-expired response.
- Inspected backend journal, Nginx config, access/error logs, frontend deployed bundle, and local source.
- Identified current root causes: deployed frontend still has hardcoded `localhost:9191` in role checks/resource URLs/upload actions, and backend upload path is derived from the executable JAR classloader URL.
- Created `docs/cloud/phase-4-vm-diagnostics-2026-05-19.md` with evidence, repair plan, VM commands, and verification commands.
- Added red regression coverage for the cloud fixes:
  - Frontend `npm run check:deployment` failed before implementation.
  - Backend `mvn -q -Dtest=UploadStoragePropertiesTest test` failed before implementation.
- Implemented minimal frontend cloud fix for role checks, resource base URLs, and upload action.
- Implemented minimal backend upload storage fix with `MALL_UPLOAD_DIR` and `UploadStorageProperties`.
- Targeted green checks passed:
  - `npm run check:deployment`
  - `mvn -q -Dtest=UploadStoragePropertiesTest test`
- Full verification passed:
  - `npm run check:deployment`
  - `npm run check:auth`
  - `npm run build`
  - `mvn -q test`
  - `mvn -q package`
