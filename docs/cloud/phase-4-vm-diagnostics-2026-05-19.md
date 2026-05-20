# Phase 4 VM Diagnostics - 2026-05-19

## Source Material

- Diagnostic archive: downloaded as `docs/cloud/fyp-mall-diagnostics.tar.gz` for the 2026-05-19 investigation, then summarized here and removed from the tracked repository during cleanup.
- Previous handoff: the temporary Phase 4 deployment handoff was consolidated into this diagnostic report, the Phase 4 report, and the project work log, then removed during cleanup.
- VM diagnostic timestamp: `Tue May 19 13:11:36 UTC 2026`
- VM: `fyp-mall-vm`
- Public HTTP endpoint: `http://34.143.225.11`

## Current Runtime State

Resolution update: the user later confirmed that the public image/resource display issue is fixed and the deployment is running normally. The findings below are retained as diagnostic evidence for the root cause and repair path.

The downloaded diagnostics show that the basic server stack is now running.

| Component | Evidence | Status |
| --- | --- | --- |
| Nginx | Listening on `0.0.0.0:80`; `nginx -t` successful | Running |
| Spring Boot backend | `project-fyp-mall.service` active since `2026-05-19 13:04:48 UTC`; Java listening on `*:9191` | Running |
| MySQL | `mysql.service` active; listening on `127.0.0.1:3306` | Running |
| Redis | `redis-server.service` active; listening on `127.0.0.1:6379` | Running |
| Frontend static files | Local `curl http://127.0.0.1` returned Vue `index.html` | Served by Nginx |

The earlier executable-JAR problem has been fixed on the VM. The backend journal first shows repeated failures:

```text
no main manifest attribute, in /opt/project-fyp-mall/runtime/project-fyp-mall-api.jar
```

Later in the same journal the runtime JAR starts successfully:

```text
Starting ElectronicMallApplication v0.0.1-SNAPSHOT using Java 11.0.30
Tomcat started on port(s): 9191 (http)
Started ElectronicMallApplication
```

## Problems Found

### 1. Some production frontend code still calls `localhost:9191`

This is the main cause of login-status and role-check failures after deployment.

The production bundle extracted in `frontend-deploy-status.txt` still contains direct browser-side calls to:

```text
http://localhost:9191/role
http://localhost:9191/file/upload
http://localhost:9191
```

The corresponding source locations are:

| Source file | Problem |
| --- | --- |
| `ElectronicMallVue/src/router/index.js` | Admin route guard calls `request.post("http://localhost:9191/role")`. |
| `ElectronicMallVue/src/views/front/Front.vue` | Storefront login-status check calls `request.post("http://localhost:9191/role")`. |
| `ElectronicMallVue/src/components/Aside.vue` | Admin sidebar role lookup calls `request.post("http://localhost:9191/role")`. |
| `ElectronicMallVue/src/store/index.js` | `baseApi` is hardcoded as `http://localhost:9191`. |
| `ElectronicMallVue/src/views/manage/file/File.vue` | Upload action is hardcoded as `http://localhost:9191/file/upload`. |

Why this breaks in production:

- In the browser, `localhost` means the user's own computer, not the Google Cloud VM.
- Login can succeed through Nginx because `Login.vue` uses the shared Axios instance.
- Immediately after login, role/login-status checks can fail because they bypass the production `/api` proxy.
- Image display and upload can also fail because `baseApi + "/file/..."` points to the user's local machine.

### 2. The curl verification path used in diagnostics was the wrong external path

The diagnostic curl used:

```bash
curl "http://127.0.0.1/api/good/page?pageNum=1&pageSize=1"
```

With the current Nginx configuration:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:9191/;
}
```

Nginx strips the first `/api/` before forwarding. Therefore:

| Browser/public URL | Backend receives | Result |
| --- | --- | --- |
| `/api/good/page` | `/good/page` | Wrong path; JWT interceptor returns session-expired JSON |
| `/api/api/good/page` | `/api/good/page` | Correct backend route |

This explains the diagnostic response:

```json
{"code":"401","msg":"Session expired. Please log in again","data":null}
```

The Nginx access log confirms that the deployed frontend's real API requests use `/api/api/...` and succeed after the backend starts:

```text
GET /api/api/good HTTP/1.1 200
GET /api/api/icon HTTP/1.1 200
GET /api/api/carousel HTTP/1.1 200
GET /api/api/good/page?pageNum=1&pageSize=9 HTTP/1.1 200
POST /api/login HTTP/1.1 200
```

### 3. Uploaded files use an unsafe runtime path inside the executable JAR URL

The backend currently derives upload folders from the Java classloader path:

```java
public static final String fileFolderPath = PathUtils.getClassLoadRootPath() + "/file/";
public static final String avatarFolderPath = PathUtils.getClassLoadRootPath() + "/avatar/";
```

On the VM, the backend printed:

```text
Project Path: file:/opt/project-fyp-mall/runtime/project-fyp-mall-api.jar!/BOOT-INF/classes!
```

That is a JAR URL, not a stable writable filesystem directory. This is risky for production because uploads may be attempted under a path derived from:

```text
file:/opt/project-fyp-mall/runtime/project-fyp-mall-api.jar!/BOOT-INF/classes!
```

Even if Java creates a directory from that string, it is not the intended persistent upload location and may fail because the service runs as `www-data`.

The correct production pattern is to use a real external upload directory, for example:

```text
/opt/project-fyp-mall/uploads/file
/opt/project-fyp-mall/uploads/avatar
```

and configure it through an environment variable.

### 4. Brevo SMTP is still not configured

`backend-config-masked.txt` shows:

```text
BREVO_SMTP_USERNAME=
BREVO_SMTP_KEY=<redacted>
BREVO_SENDER_EMAIL=
```

If email verification is tested, it may fail unless all three Brevo values are set in `/etc/project-fyp-mall.env`.

## Recommended Code Fix

## Code Fix Applied Locally

These fixes were applied after the diagnostic review, before VM redeployment.

| Area | Files | Purpose |
| --- | --- | --- |
| Frontend production role checks | `ElectronicMallVue/src/router/index.js`, `ElectronicMallVue/src/views/front/Front.vue`, `ElectronicMallVue/src/components/Aside.vue` | Replace browser-side `http://localhost:9191/role` calls with `request.post("/role")`, so role/login-status checks go through the configured Axios base URL and Nginx proxy. |
| Frontend uploaded resource base URL | `ElectronicMallVue/src/store/index.js`, `.env.development`, `.env.production` | Keep local development resources on `http://localhost:9191`, but use `/api` in production so product images, avatars, and downloads resolve from the VM. |
| Frontend file upload action | `ElectronicMallVue/src/views/manage/file/File.vue` | Replace hardcoded upload endpoint with `baseApi + "/file/upload"`, so production uploads post to the VM. |
| Frontend deployment regression check | `ElectronicMallVue/scripts/check-deployment-config.js` | Fail the deployment check if production-facing source files reintroduce `http://localhost:9191`. |
| Backend upload storage | `ElectronicMallApi/src/main/java/com/rufeng/em/config/UploadStorageProperties.java`, `FileService.java`, `AvatarService.java`, `application.yml` | Add `MALL_UPLOAD_DIR` / `mall.upload-dir` and store uploaded files under a real external directory instead of a path derived from the executable JAR. |
| Backend regression test | `ElectronicMallApi/src/test/java/com/rufeng/em/config/UploadStoragePropertiesTest.java` | Verify configured upload root resolves to separate `file/` and `avatar/` folders. |

Red/green verification performed:

```text
npm run check:deployment
```

- Red result before fix: failed because production resource base URL and hardcoded localhost checks were not satisfied.
- Green result after fix: `Deployment config checks passed.`

```text
mvn -q -Dtest=UploadStoragePropertiesTest test
```

- Red result before fix: failed to compile because `UploadStorageProperties` did not exist.
- Green result after fix: exit code `0`; the test passed.

Full local verification after the code fix:

```text
npm run check:deployment
npm run check:auth
npm run build
mvn -q test
mvn -q package
```

All commands exited successfully. The frontend production build still reports the existing Browserslist and asset-size warnings.

### Frontend

Use relative production URLs everywhere.

1. Replace full `http://localhost:9191/role` calls with:

```javascript
request.post("/role")
```

2. Change Vuex resource base URL from:

```javascript
baseApi: "http://localhost:9191"
```

to:

```javascript
baseApi: process.env.VUE_APP_RESOURCE_BASE_URL || "/api"
```

3. Add this to `ElectronicMallVue/.env.development`:

```text
VUE_APP_RESOURCE_BASE_URL=http://localhost:9191
```

4. Add this to `ElectronicMallVue/.env.production`:

```text
VUE_APP_RESOURCE_BASE_URL=/api
```

5. Replace the hardcoded upload action in `ElectronicMallVue/src/views/manage/file/File.vue`:

```vue
<el-upload :action="baseApi + '/file/upload'" ...>
```

After this, these production URLs will route correctly through Nginx:

```text
/api/role            -> backend /role
/api/file/upload     -> backend /file/upload
/api/file/<name>     -> backend /file/<name>
/api/avatar/<name>   -> backend /avatar/<name>
```

The existing API calls such as `request.get("/api/good")` can remain unchanged with the current Nginx config because they become `/api/api/good` externally and `/api/good` at the backend.

### Backend

Move upload storage out of the executable JAR path.

Recommended implementation:

1. Add an environment override in `application.yml`:

```yaml
mall:
  upload-dir: ${MALL_UPLOAD_DIR:/opt/project-fyp-mall/uploads}
```

2. Replace `Constants.fileFolderPath` and `Constants.avatarFolderPath` with a Spring-managed configuration/service that resolves:

```text
${mall.upload-dir}/file/
${mall.upload-dir}/avatar/
```

3. On the VM, create the upload directories:

```bash
sudo mkdir -p /opt/project-fyp-mall/uploads/file /opt/project-fyp-mall/uploads/avatar
sudo chown -R www-data:www-data /opt/project-fyp-mall/uploads
```

4. Add this to `/etc/project-fyp-mall.env`:

```text
MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads
```

## VM Commands After Code Fix Is Pushed

Run these in the VM SSH session after the frontend/backend fixes are committed and pushed. The current canonical deployment templates are in `deploy/`.

```bash
cd /opt/project-fyp-mall
git pull
```

```bash
cd /opt/project-fyp-mall/ElectronicMallVue
npm install
npm run build
sudo rsync -a --delete dist/ /var/www/project-fyp-mall/
sudo chown -R www-data:www-data /var/www/project-fyp-mall
```

```bash
cd /opt/project-fyp-mall/ElectronicMallApi
mvn -q -DskipTests clean package
sudo systemctl restart project-fyp-mall-api.service
```

If the backend upload-dir change is included, also run:

```bash
sudo mkdir -p /opt/project-fyp-mall/uploads/file /opt/project-fyp-mall/uploads/avatar
sudo chown -R www-data:www-data /opt/project-fyp-mall/uploads
```

Edit `/etc/project-fyp-mall.env` and add:

```text
MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads
```

Then restart again:

```bash
sudo systemctl restart project-fyp-mall-api.service
```

After the local fix is pushed, `MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads` is required on the VM for production uploads to persist outside the JAR/runtime artifact.

## Verification Commands

Use the correct external API paths:

```bash
curl -I http://127.0.0.1
curl "http://127.0.0.1/api/api/good/page?pageNum=1&pageSize=1"
curl "http://127.0.0.1/api/api/icon"
curl "http://127.0.0.1/api/api/carousel"
```

Public checks:

```bash
curl -I --max-time 10 http://34.143.225.11
curl --max-time 15 "http://34.143.225.11/api/api/good/page?pageNum=1&pageSize=1"
```

After logging in through the browser, verify authenticated endpoints:

```text
/api/role
/api/userid
/api/api/cart/userid/1
/api/api/order/userid/1
```

Expected browser-level result after the frontend fix:

- Login remains successful.
- Storefront no longer loses login status immediately after refresh.
- Admin route guard can query role through the VM.
- Product/avatar images resolve from the VM instead of `localhost`.
- File and avatar uploads post to the VM instead of the user's local computer.

## Optional Hardening

The access log shows public internet scanners probing the VM. This is expected once port 80 is open, but the current SPA fallback returns `index.html` for arbitrary unknown paths such as `/vendor/phpunit/...`.

Optional Nginx improvement:

- Keep SPA fallback for normal frontend routes.
- Return `404` for obviously unwanted paths such as `/vendor/`, `/cgi-bin/`, `/phpunit/`, `/solr/`, `/containers/`, and `*.php`.

This is not the current functional blocker, but it will make logs cleaner and reduce misleading scanner responses.
