# Cloud Deployment Guide

This guide documents the Phase 4 production deployment process for Project FYP Mall on a single Google Cloud VM.

## Target Architecture

```text
User Browser
  -> HTTP port 80
  -> Nginx reverse proxy
  -> Vue static files under /var/www/project-fyp-mall
  -> /api reverse proxy to Spring Boot on 127.0.0.1:9191
  -> MySQL local database electronic_mall
  -> Redis local cache and email verification code storage
```

## Google Cloud VM Baseline

Recommended VM:

| Item | Value |
| --- | --- |
| OS | Ubuntu 22.04 LTS |
| Machine type | 2 vCPU, at least 2 GB RAM |
| Boot disk | At least 40 GB |
| Public ports | 22, 80, 443 if HTTPS is added |
| Internal-only ports | 9191, 3306, 6379 |

## Server Packages

```bash
sudo apt update
sudo apt install -y git nginx mysql-server redis-server openjdk-8-jdk maven curl
```

If Ubuntu package repositories do not provide Java 8 on the selected image, install Java 11 and verify the Spring Boot build before continuing:

```bash
java -version
mvn -version
```

Node.js should match the local project baseline as closely as possible:

```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## Repository Setup

```bash
sudo mkdir -p /opt/project-fyp-mall
sudo chown "$USER":"$USER" /opt/project-fyp-mall
git clone https://github.com/Rufeng081/project-fyp-mall.git /opt/project-fyp-mall
cd /opt/project-fyp-mall
```

## MySQL Setup

Create the application database and user. Replace the password with the actual server password and record only that a password was set, not the secret value.

```bash
sudo mysql <<'SQL'
CREATE DATABASE IF NOT EXISTS electronic_mall DEFAULT CHARACTER SET utf8mb4;
CREATE USER IF NOT EXISTS 'mall_app'@'localhost' IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON electronic_mall.* TO 'mall_app'@'localhost';
FLUSH PRIVILEGES;
SQL

mysql -u mall_app -p electronic_mall < /opt/project-fyp-mall/database/electronic_mall.sql
```

## Redis Setup

```bash
sudo systemctl enable redis-server
sudo systemctl restart redis-server
redis-cli ping
```

Expected output:

```text
PONG
```

## Backend Build

```bash
cd /opt/project-fyp-mall/ElectronicMallApi
mvn clean package
```

## Backend Environment

Create `/etc/project-fyp-mall.env`:

```bash
SERVER_PORT=9191
MYSQL_URL=jdbc:mysql://localhost:3306/electronic_mall?serverTimezone=GMT%2b8
MYSQL_USERNAME=mall_app
MYSQL_PASSWORD=CHANGE_ME_STRONG_PASSWORD
REDIS_DATABASE=0
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
BREVO_SMTP_USERNAME=CHANGE_ME_IF_EMAIL_TESTING_IS_REQUIRED
BREVO_SMTP_KEY=CHANGE_ME_IF_EMAIL_TESTING_IS_REQUIRED
BREVO_SENDER_EMAIL=CHANGE_ME_IF_EMAIL_TESTING_IS_REQUIRED
MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads
```

The email verification service is configured for Brevo SMTP and sends the FYP-UKM Rufeng Mall Demo verification email template. Fill in all three `BREVO_*` values on the VM before testing registration or forgot-password email codes.

Protect the file:

```bash
sudo chown root:root /etc/project-fyp-mall.env
sudo chmod 600 /etc/project-fyp-mall.env
```

## systemd Service

Create `/etc/systemd/system/project-fyp-mall-api.service` or copy the repository template from `deploy/systemd/project-fyp-mall-api.service`:

```ini
[Unit]
Description=Project FYP Mall Spring Boot API
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/project-fyp-mall/ElectronicMallApi
EnvironmentFile=/etc/project-fyp-mall.env
ExecStart=/usr/bin/java -jar /opt/project-fyp-mall/ElectronicMallApi/target/ElectronicMallApi-0.0.1-SNAPSHOT.jar
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable project-fyp-mall-api.service
sudo systemctl restart project-fyp-mall-api.service
sudo systemctl status project-fyp-mall-api.service --no-pager
```

Create persistent upload directories before starting the backend:

```bash
sudo mkdir -p /opt/project-fyp-mall/uploads/file /opt/project-fyp-mall/uploads/avatar
sudo chown -R www-data:www-data /opt/project-fyp-mall/uploads
```

## Frontend Build

```bash
cd /opt/project-fyp-mall/ElectronicMallVue
npm install
npm run check:deployment
npm run build
sudo mkdir -p /var/www/project-fyp-mall
sudo rsync -a --delete dist/ /var/www/project-fyp-mall/
sudo chown -R www-data:www-data /var/www/project-fyp-mall
```

## Nginx Configuration

Create `/etc/nginx/sites-available/project-fyp-mall`:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/project-fyp-mall;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:9191/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -sf /etc/nginx/sites-available/project-fyp-mall /etc/nginx/sites-enabled/project-fyp-mall
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## Firewall

Google Cloud firewall should allow:

| Port | Purpose |
| --- | --- |
| 22 | SSH administration |
| 80 | Public HTTP access |
| 443 | Optional HTTPS later |

The VM operating-system firewall can stay disabled if Google Cloud firewall rules are correctly scoped, or use UFW:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## Acceptance Checks

Run these on the VM:

```bash
systemctl is-active mysql
systemctl is-active redis-server
systemctl is-active project-fyp-mall-api.service
systemctl is-active nginx
curl -I http://127.0.0.1
curl "http://127.0.0.1/api/api/good/page?pageNum=1&pageSize=1"
```

Run from outside the VM:

```bash
curl -I http://SERVER_PUBLIC_IP
curl "http://SERVER_PUBLIC_IP/api/api/good/page?pageNum=1&pageSize=1"
```

With the current Nginx `location /api/` and `proxy_pass http://127.0.0.1:9191/` pattern, the first external `/api/` prefix is stripped before requests reach Spring Boot. Backend controllers already mapped as `/api/...` therefore need external verification paths such as `/api/api/good/page`. Shared frontend calls without a backend `/api` prefix, such as `/role` and `/file/...`, should resolve externally as `/api/role` and `/api/file/...`.

Browser checks:

- Home page loads through the public IP.
- Login and registration pages load.
- Product list and product detail load.
- User can log in with the seed account.
- Cart, order placement, simulated payment, and order history work.
