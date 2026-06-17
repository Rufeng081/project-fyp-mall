# Project FYP Mall Deployment

This guide deploys the Vue frontend behind Nginx and runs the Spring Boot API as a systemd service on a Google Cloud VM.

## 1. Build the Vue frontend

Run this from the repository root:

```bash
cd ElectronicMallVue && npm ci && npm run build
```

The production environment file sets both `VUE_APP_API_BASE_URL` and `VUE_APP_RESOURCE_BASE_URL` to `/api`, so API calls, product images, avatar images, uploads, and downloads go through the Nginx reverse proxy.

## 2. Copy Vue dist files to Nginx web root

```bash
sudo mkdir -p /var/www/project-fyp-mall
sudo rsync -a --delete ElectronicMallVue/dist/ /var/www/project-fyp-mall/
sudo chown -R www-data:www-data /var/www/project-fyp-mall
```

## 3. Build the Spring Boot backend

```bash
cd ElectronicMallApi && mvn clean package
```

The service template expects the jar at:

```text
/opt/project-fyp-mall/ElectronicMallApi/target/ElectronicMallApi-0.0.1-SNAPSHOT.jar
```

## 4. Create upload directories

The backend reads uploaded files from `MALL_UPLOAD_DIR`, with product files under `uploads/file` and avatar files under `uploads/avatar`.

```bash
sudo mkdir -p /opt/project-fyp-mall/uploads/file
sudo mkdir -p /opt/project-fyp-mall/uploads/avatar
sudo chown -R www-data:www-data /opt/project-fyp-mall/uploads
```

Set the environment value in `/etc/project-fyp-mall.env`:

```bash
sudo cp deploy/env/project-fyp-mall.env.example /etc/project-fyp-mall.env
sudo nano /etc/project-fyp-mall.env
```

At minimum, keep:

```text
MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads
```

Fill in real database, Redis, and SMTP values on the VM only. The email verification service sends the FYP-UKM Rufeng Mall Demo template through Brevo SMTP, so registration and forgot-password email codes require all three `BREVO_*` values. Do not commit real secrets.

## 5. Migrate old uploaded files

If older files are still under `ElectronicMallApi/file` and `ElectronicMallApi/avatar`, copy them into the configured upload root:

```bash
sudo mkdir -p /opt/project-fyp-mall/uploads/file /opt/project-fyp-mall/uploads/avatar
sudo rsync -a ElectronicMallApi/file/ /opt/project-fyp-mall/uploads/file/
sudo rsync -a ElectronicMallApi/avatar/ /opt/project-fyp-mall/uploads/avatar/
sudo chown -R www-data:www-data /opt/project-fyp-mall/uploads
```

Database values such as `/file/xxxx.png` and `/avatar/xxxx.jpg` should not be changed. In production the browser requests `/api/file/xxxx.png` or `/api/avatar/xxxx.jpg`, and Nginx proxies those requests to the backend.

## 6. Install the systemd backend service

```bash
sudo cp deploy/systemd/project-fyp-mall-api.service /etc/systemd/system/project-fyp-mall-api.service
sudo systemctl daemon-reload
sudo systemctl enable project-fyp-mall-api.service
sudo systemctl restart project-fyp-mall-api.service
sudo systemctl status project-fyp-mall-api.service
```

Check logs with:

```bash
sudo journalctl -u project-fyp-mall-api.service -n 100 --no-pager
```

## 7. Install the Nginx config

```bash
sudo cp deploy/nginx/project-fyp-mall.conf /etc/nginx/sites-available/project-fyp-mall
sudo ln -sf /etc/nginx/sites-available/project-fyp-mall /etc/nginx/sites-enabled/project-fyp-mall
sudo nginx -t
sudo systemctl reload nginx
```

The template serves Vue files from `/var/www/project-fyp-mall`, falls back to `index.html` for Vue history routes, and proxies `/api/` to `http://127.0.0.1:9191/`.

Because the production Axios base URL is `/api` and many existing frontend calls already include `/api/...`, manual public checks for backend `/api/*` routes use a doubled public prefix:

| Backend path | Public path |
|---|---|
| `/api/good` | `/api/api/good` |
| `/api/carousel` | `/api/api/carousel` |
| `/api/good/standard/3` | `/api/api/good/standard/3` |
| `/login` | `/api/login` |
| `/userid` | `/api/userid` |
| `/file/<name>` | `/api/file/<name>` |
| `/avatar/<name>` | `/api/avatar/<name>` |

## 8. Verify production assets

After building the Vue frontend, verify no production dist file contains `localhost:9191`:

```bash
grep -R "localhost:9191" ElectronicMallVue/dist || true
```

Expected result: no matching JavaScript, CSS, or HTML output. You can also run the repository check:

```bash
cd ElectronicMallVue
npm run check:deployment
```
