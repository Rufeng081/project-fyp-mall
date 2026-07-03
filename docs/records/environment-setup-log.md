# Environment Setup Change Log

## 2026-05-20

### Google Cloud VM environment checkpoint

- Cloud provider:
  - Google Cloud.
- Account:
  - `a206331@siswa.ukm.edu.my`.
- Project:
  - Project name: `project-fyp-mall`.
  - Project ID: `cobalt-bond-496703-n2`.
  - Project number: `206025383026`.
- VM:
  - Name: `fyp-mall-vm`.
  - Zone: `asia-southeast1-b`.
  - Machine type: `e2-medium`.
  - OS: Ubuntu 22.04 LTS.
  - Boot disk: 40 GB balanced persistent disk.
  - External IP: `34.143.225.11`.
  - Internal IP: `10.148.0.4`.
  - Network tag: `fyp-mall-http`.
- Firewall:
  - Rule: `allow-fyp-mall-http`.
  - Target tag: `fyp-mall-http`.
  - Source range: `0.0.0.0/0`.
  - Allowed protocol/port: `tcp:80`.
- Runtime stack recorded by diagnostics:
  - Nginx listening on port `80`.
  - Spring Boot backend listening on port `9191`.
  - MySQL listening on `127.0.0.1:3306`.
  - Redis listening on `127.0.0.1:6379`.
- Runtime status:
  - Public image/resource display has been fixed after production resource routing and upload storage were corrected.
  - Production upload storage should use `MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads` with writable `file/` and `avatar/` subdirectories.
  - Email verification service is configured through Brevo SMTP environment variables and uses the FYP-UKM R Mall Demo verification email template.
  - Runtime email sending requires `BREVO_SMTP_USERNAME`, `BREVO_SMTP_KEY`, and `BREVO_SENDER_EMAIL`; direct registration without email verification is not enabled.
- Related files:
  - `docs/cloud/phase-4-vm-diagnostics-2026-05-19.md`.
  - `docs/reports/phase-4-cloud-deployment-report.md`.

## 2026-05-17

### Backend compile import fix

- Files changed:
  - `<backend-module>/src/main/java/<backend-package>/controller/OrderController.java`
  - `<backend-module>/src/main/java/<backend-package>/controller/UserController.java`
- Reason:
  - `mvn clean install` failed because both controllers imported `com.sun.xml.internal.fastinfoset.stax.events.Util`, which was unavailable in the current JDK 8 build environment.
  - The project already depends on `com.sun.xml.fastinfoset:FastInfoset`, and `FileService.java` uses the public package path `com.sun.xml.fastinfoset.stax.events.Util`.
- Exact change:
  - Replaced `import com.sun.xml.internal.fastinfoset.stax.events.Util;`
  - With `import com.sun.xml.fastinfoset.stax.events.Util;`
- Scope:
  - Compile-only fix.
  - No business logic changes.
  - No dependency upgrades.
  - No changes to `pom.xml`, `package.json`, `application.yml`, `request.js`, or `vue.config.js`.
- Verification:
  - `mvn clean install -DskipTests` succeeded after the import fix.
  - `mvn clean install` also succeeded after dependencies were cached.

### User shell environment configuration

- File changed:
  - `~/.zshrc`
- Reason:
  - The local shell was still resolving the Codex bundled Node.js runtime instead of the project-required Node.js `16.13.2`.
  - `nvm` installed by Homebrew needs an initialization block in interactive shells so `nvm use 16.13.2` works consistently.
- Exact change:
  - Added the `NVM_DIR` export and Homebrew `nvm.sh` / bash completion initialization block.
- Scope:
  - User-level shell configuration only.
  - No project source files or dependency manifest files changed.
- Verification:
  - `nvm --version` returned `0.40.4`.
  - `node -v` returned `v16.13.2`.
  - `npm -v` returned `8.1.2`.

### Frontend generated dependency permission fix

- Files changed:
  - `<frontend-module>/node_modules/.bin/vue-cli-service`
  - `<frontend-module>/node_modules/@vue/cli-service/bin/vue-cli-service.js`
- Reason:
  - `npm run dev` failed with `Permission denied` when executing `node_modules/.bin/vue-cli-service`.
  - Both generated dependency scripts existed and had valid script content, but their file mode was `-rw-rw-r--`, missing the executable bit required by the shell.
- Exact change:
  - Ran `chmod +x` on the two generated `vue-cli-service` scripts.
- Scope:
  - Generated `node_modules` permission fix only.
  - No changes to `package.json`, `package-lock.json`, `vue.config.js`, or frontend source files.
- Verification:
  - `npm run dev` started successfully after the permission fix.
  - Frontend compiled successfully and listened on `http://localhost:9192/`.

### Local service and database setup verification

- MySQL:
  - Homebrew MySQL `8.0.46` is running on port `3306`.
  - Root login was verified with the project-compatible `root/root` credentials.
  - Database `electronic_mall` was created if missing.
  - SQL imported from `database/electronic_mall.sql`.
  - Verified tables: `address`, `avatar`, `carousel`, `cart`, `category`, `good`, `good_standard`, `icon`, `icon_category`, `order_goods`, `standard`, `sys_file`, `sys_user`, `t_order`.
- Redis:
  - Redis server is running on `127.0.0.1:6379`.
  - `redis-cli ping` returned `PONG`.
- Backend:
  - Built with JDK 8 and Maven.
  - `mvn clean install` succeeded.
  - Spring Boot listens on `http://localhost:9191`.
  - `GET /v2/api-docs` returned HTTP `200`.
  - `GET /api/good/page?pageNum=1&pageSize=1` returned HTTP `200` with imported product data.
- Frontend:
  - Installed with Node.js `v16.13.2` and npm `8.1.2`.
  - `npm install` completed successfully.
  - `npm run dev` compiled successfully and listens on `http://localhost:9192/`.
  - Frontend API configuration points to `http://localhost:9191`.
