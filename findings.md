# Phase 4 Findings

## Repository Context

- The roadmap defines Phase 4 as a single-server cloud deployment with Nginx reverse proxy, Vue static files, Spring Boot backend, MySQL, Redis, and firewall-limited public access.
- Backend config currently uses port `9191`, MySQL `localhost:3306/electronic_mall`, user `root`, password `root`, Redis `127.0.0.1:6379`, and Brevo SMTP credentials from environment variables.
- Frontend Axios base URL currently hardcodes `http://localhost:9191`, which is unsuitable for production behind Nginx.
- Frontend deployment fix: `VUE_APP_API_BASE_URL` now controls Axios base URL. `.env.development` keeps local backend access and `.env.production` routes through `/api`.
- Backend deployment fix: `SERVER_PORT`, `MYSQL_URL`, `MYSQL_USERNAME`, `MYSQL_PASSWORD`, `REDIS_DATABASE`, `REDIS_HOST`, and `REDIS_PORT` can now override YAML defaults.
- Existing docs include project/work logs and phase reports under `docs/records` and `docs/reports`.
- No `AGENTS.md`, `CLAUDE.md`, or `GEMINI.md` files were found in the repository tree.
- Working tree was clean at the start of Phase 4.

## Deployment Assumptions

- Google Cloud access may require user-assisted login, two-factor confirmation, billing/project confirmation, or terms acceptance.
- SMTP credentials are not available in tracked files; email verification can only be fully tested if the VM has valid Brevo environment variables.

## Commands and Verification To Record

- Local backend build: `mvn clean package`.
- Local frontend build: `npm run build`.
- Server service checks: `systemctl status project-fyp-mall`, `systemctl status nginx`, `systemctl status mysql`, `systemctl status redis-server`.
- Public checks: frontend route, `/api/good`, login/register flow, cart/order/payment/order history.

## 2026-05-19 VM Diagnostics Review

- Downloaded diagnostic package: `docs/cloud/fyp-mall-diagnostics.tar.gz`.
- Extracted contents under `/private/tmp/fyp-mall-diagnostics-current/fyp-mall-diagnostics`.
- VM timestamp in diagnostics: `Tue May 19 13:11:36 UTC 2026`.
- Runtime services are active: `project-fyp-mall`, `nginx`, `mysql`, and `redis-server`.
- Listening ports show Nginx on `0.0.0.0:80`, Java on `*:9191`, MySQL on `127.0.0.1:3306`, Redis on `127.0.0.1:6379`.
- Local frontend curl through Nginx returns `200 OK` and serves the Vue `index.html`.
- Local `/api/good/page?pageNum=1&pageSize=1` through Nginx and direct backend both return JSON `{"code":"401","msg":"Session expired. Please log in again","data":null}` with HTTP status line `404`.
- Environment file has Brevo SMTP values blank (`BREVO_SMTP_USERNAME=`, `BREVO_SENDER_EMAIL=`), so email verification remains unconfigured.
- Backend journal confirms the earlier non-executable JAR problem is now resolved on the VM; Spring Boot starts from `/opt/project-fyp-mall/runtime/project-fyp-mall-api.jar` and listens on port `9191`.
- Nginx access logs after backend startup show real frontend requests succeeding at `/api/api/good`, `/api/api/icon`, `/api/api/carousel`, `/api/login`, `/api/userid`, `/api/api/cart/userid/1`, and `/api/api/order/userid/1`.
- The correct public path for backend controllers with `/api/...` mappings is currently `/api/api/...` because Nginx strips the first `/api/` prefix.
- The deployed frontend bundle still contains `http://localhost:9191/role`, `http://localhost:9191/file/upload`, and Vuex `baseApi: "http://localhost:9191"`, which explains browser-side login-status and image/upload failures on the public VM.
- Backend upload storage is currently derived from classloader path. On the executable JAR this is `file:/opt/project-fyp-mall/runtime/project-fyp-mall-api.jar!/BOOT-INF/classes!`, which is not a proper persistent upload directory.
- Minimal fix applied locally: frontend role/resource/upload paths now route through relative `/api` production settings, and backend upload storage now supports `MALL_UPLOAD_DIR`.
