# Phase 4 Cloud Deployment Task Plan

## Goal

Deploy Project FYP Mall to Google Cloud on an Ubuntu VM so the Vue frontend is served by Nginx over a public IP, `/api` requests are reverse proxied to the Spring Boot backend, and the backend connects to MySQL and Redis on the server.

## Scope

- Target phase: `docs/project/implementation-roadmap.md` Phase 4.
- Cloud provider: Google Cloud.
- Account: `a206331@siswa.ukm.edu.my`.
- Repository: `https://github.com/Rufeng081/project-fyp-mall/`.
- Deployment model: single VM, Nginx, Spring Boot systemd service, local MySQL, local Redis.
- Exclusions: Kubernetes, Docker deployment, real payment gateway, advanced scaling.

## Plan

| Phase | Status | Notes |
| --- | --- | --- |
| 1. Local discovery and plan setup | in_progress | Inspect roadmap, repository config, build/runtime assumptions, and current docs. |
| 2. Production configuration preparation | complete | Frontend `/api` production base URL, backend environment overrides, deployment guide, and local pre-deployment checks are complete. |
| 3. Google Cloud VM provisioning | pending | Create project/VM/firewall using approved account and record settings. |
| 4. Server dependency setup | pending | Install Java, Maven, Node or build artifacts, MySQL, Redis, Nginx, Git. |
| 5. Application deployment | pending | Clone repo, import database, build frontend/backend, configure systemd and Nginx. |
| 6. Verification and documentation | pending | Verify public IP access, API routing, core golden path, service status, and update docs records/reports. |
| 7. Post-install VM diagnostics review | complete | Analyzed `docs/cloud/fyp-mall-diagnostics.tar.gz`; documented current production issues and repair commands in `docs/cloud/phase-4-vm-diagnostics-2026-05-19.md`. |
| 8. Minimal cloud runtime code fix | complete | Fixed remaining production localhost references, moved upload storage to `MALL_UPLOAD_DIR`, and passed local verification. Commit/push still pending. |

## Decisions

- Use Ubuntu 22.04 LTS unless Google Cloud image availability requires Ubuntu 24.04 LTS.
- Prefer `e2-medium` or equivalent 2 vCPU / 4 GB RAM if free credit allows; minimum accepted is 2 vCPU / 2 GB RAM.
- Keep backend port `9191` bound internally behind Nginx.
- Use `/api` as the frontend production API base so the public app does not expose backend ports.
- Store secrets as VM environment/systemd environment values, not in tracked files.

## Errors Encountered

| Time | Error | Attempt | Resolution |
| --- | --- | --- | --- |
| 2026-05-19 | `npm run check:deployment` failed with missing `.env.production`. | Red test before deployment config implementation. | Expected failure; next step is to add production/development env files and update Axios base URL. |
| 2026-05-19 | VM API curl test returned `{"code":"401","msg":"Session expired. Please log in again"}` for `/api/good/page`. | Reviewed downloaded diagnostics from `docs/cloud/fyp-mall-diagnostics.tar.gz`. | Investigation in progress; evidence shows backend/Nginx are active, so focus moved to route/auth behavior and runtime data/assets. |
