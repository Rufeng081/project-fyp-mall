# phpMyAdmin Admin Setup: 2026-06-15

This note records the phpMyAdmin installation and Nginx integration performed on the Google Cloud VM for browser-based administration of the `electronic_mall` MySQL database.

## Scope

| Item | Value |
| --- | --- |
| Google Cloud project | `cobalt-bond-496703-n2` |
| VM | `fyp-mall-vm` |
| Zone | `asia-southeast1-b` |
| Public endpoint | `http://34.143.225.11` |
| Database service | MySQL `8.0.46-0ubuntu0.22.04.2` |
| Target database | `electronic_mall` |
| phpMyAdmin URL | `http://34.143.225.11/phpmyadmin/` |

No database tables or records were deleted. MySQL port `3306` was not exposed publicly.

## Initial Environment Check

The VM was reachable through `gcloud compute ssh`.

```bash
gcloud compute ssh fyp-mall-vm --zone asia-southeast1-b
```

Observed runtime state:

| Check | Result |
| --- | --- |
| VM user | `rufeng` |
| Hostname | `fyp-mall-vm` |
| MySQL | Active/running |
| Apache | Not installed before this task |
| Nginx | Active/running and already listening on public TCP `80` |
| Existing HTTP firewall | `allow-fyp-mall-http` allows TCP `80` for VM tag `fyp-mall-http` |

The requested firewall rule name `allow-http-fyp-mall` did not exist, but no duplicate rule was created because the current VM tag was already covered by `allow-fyp-mall-http`.

## Packages Installed

```bash
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
  apache2 \
  php \
  libapache2-mod-php \
  php-mysql \
  php-mbstring \
  php-zip \
  php-gd \
  php-json \
  php-curl \
  phpmyadmin
```

The phpMyAdmin package initialized its internal `phpmyadmin` metadata database through `dbconfig-common`.

## Port Conflict Root Cause

After package installation, Apache failed to start because Nginx was already bound to public TCP `80`.

Evidence:

```bash
sudo ss -ltnp 'sport = :80'
sudo systemctl status nginx --no-pager
```

The VM already uses Nginx as the public web server for:

- Vue frontend files under `/var/www/project-fyp-mall`
- backend API proxying from `/api/` to `http://127.0.0.1:9191/`

Replacing Nginx with Apache would risk breaking the deployed application. The chosen integration keeps Nginx as the public entry point and runs Apache only on localhost for phpMyAdmin.

## Apache Configuration

Backups were created before editing:

```bash
sudo cp -n /etc/apache2/ports.conf /etc/apache2/ports.conf.bak-phpmyadmin
sudo cp -n /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/000-default.conf.bak-phpmyadmin
```

Apache was changed from public `80` to localhost-only `8081`:

```bash
sudo sed -i 's/^Listen 80$/Listen 127.0.0.1:8081/' /etc/apache2/ports.conf
sudo sed -i 's/<VirtualHost \*:80>/<VirtualHost 127.0.0.1:8081>/' /etc/apache2/sites-available/000-default.conf
```

phpMyAdmin's Apache configuration was enabled:

```bash
sudo test -e /etc/apache2/conf-enabled/phpmyadmin.conf || \
  sudo ln -s /etc/phpmyadmin/apache.conf /etc/apache2/conf-enabled/phpmyadmin.conf

sudo apache2ctl configtest
sudo systemctl restart apache2
```

## Nginx Configuration

Backup:

```bash
sudo cp -n /etc/nginx/sites-available/project-fyp-mall \
  /etc/nginx/sites-available/project-fyp-mall.bak-phpmyadmin
```

The active Nginx site `/etc/nginx/sites-available/project-fyp-mall` received this block inside the existing `server { ... }`:

```nginx
location = /phpmyadmin {
    return 301 /phpmyadmin/;
}

location /phpmyadmin/ {
    proxy_pass http://127.0.0.1:8081/phpmyadmin/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Validation and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## MySQL Admin User

A local-only MySQL user was created for phpMyAdmin login. The generated password was delivered to the operator during the session and is intentionally not stored in the repository.

```sql
CREATE USER IF NOT EXISTS 'mall_admin'@'localhost' IDENTIFIED BY '<generated-password>';
ALTER USER 'mall_admin'@'localhost' IDENTIFIED BY '<generated-password>';
GRANT ALL PRIVILEGES ON electronic_mall.* TO 'mall_admin'@'localhost';
FLUSH PRIVILEGES;
SHOW GRANTS FOR 'mall_admin'@'localhost';
```

Observed grants:

```text
GRANT USAGE ON *.* TO `mall_admin`@`localhost`
GRANT ALL PRIVILEGES ON `electronic_mall`.* TO `mall_admin`@`localhost`
```

## Verification

| Check | Result |
| --- | --- |
| `apache2.service` | Active/running |
| `nginx.service` | Active/running |
| Public port `80` | Nginx on `0.0.0.0:80` |
| Local port `8081` | Apache on `127.0.0.1:8081` |
| `http://127.0.0.1:8081/phpmyadmin/` from VM | HTTP `200` |
| `http://127.0.0.1/phpmyadmin/` from VM through Nginx | HTTP `200` |
| `http://34.143.225.11/phpmyadmin/` from local Mac | HTTP `200` |
| `mall_admin` login to MySQL | Successful |
| `electronic_mall` table visibility | Successful |

Tables visible to `mall_admin` included:

```text
address
avatar
carousel
cart
category
good
good_standard
icon
icon_category
order_goods
standard
sys_file
sys_user
t_order
```

## Operational Notes

- Nginx remains the only public HTTP server.
- Apache is local-only and exists to serve phpMyAdmin behind Nginx.
- MySQL remains private; do not open TCP `3306` to the public internet.
- The phpMyAdmin URL is public over HTTP, so it should not remain unrestricted long term.
- For safer long-term operation, restrict `/phpmyadmin/` by source IP, add HTTPS, or disable the Nginx location block when not needed.
- Keep phpMyAdmin credentials out of Git and documentation.

## Rollback Notes

To remove the phpMyAdmin web entry while keeping packages installed:

```bash
sudo cp /etc/nginx/sites-available/project-fyp-mall.bak-phpmyadmin \
  /etc/nginx/sites-available/project-fyp-mall
sudo nginx -t
sudo systemctl reload nginx
```

To restore Apache's previous default port configuration:

```bash
sudo cp /etc/apache2/ports.conf.bak-phpmyadmin /etc/apache2/ports.conf
sudo cp /etc/apache2/sites-available/000-default.conf.bak-phpmyadmin \
  /etc/apache2/sites-available/000-default.conf
```

Do not restore Apache to public port `80` while Nginx is still the production web server.
