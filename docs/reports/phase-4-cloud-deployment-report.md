# Phase 4 Cloud Deployment Report

## Objective

Deploy Project FYP Mall to Google Cloud so it is accessible through a public IP address and follows the planned Nginx, Spring Boot, MySQL, and Redis architecture.

## Implementation Scope

- Configure frontend production API routing through `/api`.
- Configure backend deployment values through environment variables.
- Provision a Google Cloud VM.
- Install and configure Nginx, Java/Maven, Node.js, MySQL, Redis, and Git.
- Clone the GitHub repository to the VM.
- Build and run the backend as a systemd service.
- Build and serve the Vue frontend through Nginx.
- Verify public access and core e-commerce functions.

## Local Configuration Changes

| Area | Change |
| --- | --- |
| Frontend Axios | `VUE_APP_API_BASE_URL` controls the API base URL. |
| Frontend development | `.env.development` points to `http://localhost:9191`. |
| Frontend production | `.env.production` points to `/api`. |
| Frontend uploaded resources | `VUE_APP_RESOURCE_BASE_URL` keeps local resources on `http://localhost:9191` and production resources on `/api`. |
| Backend server | `SERVER_PORT` can override the default `9191`. |
| Backend MySQL | `MYSQL_URL`, `MYSQL_USERNAME`, and `MYSQL_PASSWORD` can override local defaults. |
| Backend Redis | `REDIS_DATABASE`, `REDIS_HOST`, and `REDIS_PORT` can override local defaults. |
| Backend upload storage | `MALL_UPLOAD_DIR` can move uploaded files and avatars to a persistent VM directory outside the executable JAR. |

## Google Cloud VM Record

| Item | Value |
| --- | --- |
| Google account | `a206331@siswa.ukm.edu.my` |
| Project ID | `cobalt-bond-496703-n2` |
| Project number | `206025383026` |
| VM name | `fyp-mall-vm` |
| Region / zone | `asia-southeast1-b` |
| Machine type | `e2-medium` |
| OS image | Ubuntu 22.04 LTS |
| Boot disk | 40 GB balanced persistent disk |
| External IP | `34.143.225.11` |
| Internal IP | `10.148.0.4` |
| Firewall rules | `allow-fyp-mall-http`; target tag `fyp-mall-http`; allows `tcp:80` from `0.0.0.0/0` |

## Current Cloud Runtime Status

As of 2026-05-20, the production image/resource display issue has been fixed. The deployed frontend no longer depends on browser-side `localhost:9191` for product images, user avatars, uploads, or role checks. Production requests use `/api`, Nginx proxies them to the Spring Boot service on `127.0.0.1:9191`, and backend file storage is configured through `MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads`.

The next runtime blocker is email-code registration on environments without complete SMTP sender settings. The backend currently reports `Email sender is not configured` when SMTP variables are missing. The next planned implementation will improve that path and add a controlled direct-registration fallback for deployments that intentionally skip email verification.

## Deployment Verification

| Check | Result |
| --- | --- |
| Frontend deployment config check | Passed locally with `npm run check:deployment`. |
| Frontend auth wiring check | Passed locally with `npm run check:auth`. |
| Frontend production build | Passed locally with `npm run build`; existing Browserslist and asset-size warnings only. |
| Backend package build | Passed locally with `mvn -q package`. |
| MySQL service | Running in VM diagnostics. |
| Redis service | Running in VM diagnostics. |
| Spring Boot systemd service | Running in VM diagnostics. |
| Nginx config test | Passed in VM diagnostics. |
| Public frontend access | Verified by user after image/resource fix. |
| Public image/avatar/resource access | Fixed; product and avatar images display correctly after `/api` resource routing and upload-directory migration. |
| Public API access through Nginx | Route pattern verified; backend `/api/...` controllers resolve externally as `/api/api/...`, while `/file`, `/avatar`, and `/role` resolve externally as `/api/file`, `/api/avatar`, and `/api/role`. |
| Golden-path functional check | Image/resource flow verified by user; full post-email-fallback browser regression remains a future check. |

## Operation Log

| Time | Action | Result |
| --- | --- | --- |
| 2026-05-19 | Started Phase 4 from `docs/project/implementation-roadmap.md`. | Phase scope confirmed. |
| 2026-05-19 | Added frontend deployment configuration check. | Red test failed before implementation because production env config was missing. |
| 2026-05-19 | Updated frontend API base URL and backend environment override settings. | `npm run check:deployment` passed. |
| 2026-05-19 | Ran local pre-deployment verification. | `npm run check:auth`, `npm run check:deployment`, `mvn -q package`, and `npm run build` passed. |
| 2026-05-19 | Reviewed downloaded VM diagnostics after backend installation. | Root causes documented in `docs/cloud/phase-4-vm-diagnostics-2026-05-19.md`. |
| 2026-05-19 | Added regression checks for production `localhost:9191` references and configurable upload storage. | Frontend check and backend test failed before the fix, then passed after the code change. |
| 2026-05-19 | Replaced remaining production-facing frontend localhost URLs and moved backend upload storage behind `MALL_UPLOAD_DIR`. | Ready for VM rebuild/redeploy by user. |
| 2026-05-19 | Ran full local verification for the cloud fix. | `npm run check:deployment`, `npm run check:auth`, `npm run build`, `mvn -q test`, and `mvn -q package` passed. |
| 2026-05-20 | Synchronized documentation after confirming the VM was built and image display was the active blocker at that time. | Root README, docs index, roadmap, cloud notes, setup log, and work log updated. |
| 2026-05-20 | User confirmed the image display issue is fixed and the project is running normally. | Documentation updated to close the image/resource blocker and identify email verification fallback as the next task. |

## Notes

- Secrets are not stored in repository files or documentation.
- SMTP email verification requires Brevo credentials in the VM environment file before live registration email testing can pass; missing sender configuration currently produces `Email sender is not configured`.
- VM production uploads require `MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads` and writable `file/` and `avatar/` subdirectories owned by `www-data`.
- The public image/resource issue has been resolved. Keep the deployment helper files as the canonical instructions for rebuilding and verifying the VM.
- HTTPS is optional for Phase 4 and can be added later through a domain and Certbot.
