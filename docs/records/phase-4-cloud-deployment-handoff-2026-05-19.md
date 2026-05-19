# Phase 4 Cloud Deployment Handoff - 2026-05-19

## Current Status

Work was stopped by user instruction before final public verification and documentation close-out.

Phase 4 is partially completed:

- Google Cloud project was created.
- Google Cloud VM was created and reachable through Cloud Shell SSH.
- Firewall rule for HTTP port 80 was created.
- Server packages were installed.
- MySQL, Redis, Nginx, and systemd deployment structure were configured.
- Repository was cloned on the VM.
- Frontend production build was deployed to Nginx web root.
- Backend deployment initially failed because the packaged JAR was not executable.
- The backend packaging issue was fixed locally, committed, and pushed to GitHub.
- A clean backend Maven build then succeeded on the VM.
- The final step of copying the newly built JAR into the runtime path, restarting systemd, and verifying public access was not completed.

The known public VM IP at stop time was:

```text
http://34.143.225.11
```

## Google Cloud Resources Created

| Item | Value |
| --- | --- |
| Google account | `a206331@siswa.ukm.edu.my` |
| Google Cloud project name | `project-fyp-mall` |
| Google Cloud project ID | `cobalt-bond-496703-n2` |
| Google Cloud project number | `206025383026` |
| VM name | `fyp-mall-vm` |
| Zone | `asia-southeast1-b` |
| Machine type | `e2-medium` |
| OS | Ubuntu 22.04 LTS / Ubuntu 22.04.5 LTS |
| Boot disk | 40 GB balanced persistent disk |
| Network tag | `fyp-mall-http` |
| Internal IP | `10.148.0.4` |
| External IP | `34.143.225.11` |
| Firewall rule | `allow-fyp-mall-http` |
| Firewall allow rule | `tcp:80` from `0.0.0.0/0` to target tag `fyp-mall-http` |

## Chronological Work Log

### 1. Read Roadmap and Deployment Requirements

I started from the Phase 4 item in:

```text
docs/project/implementation-roadmap.md
```

The Phase 4 goal was interpreted as:

- provision a Google Cloud VM;
- configure network/firewall access;
- deploy MySQL, Redis, Spring Boot backend, Vue frontend, and Nginx reverse proxy;
- make the application accessible through the VM public IP;
- record the industrial deployment process under `docs`.

### 2. Created Local Phase 4 Planning Notes

I created temporary planning files in the repository root through the planning workflow:

```text
task_plan.md
findings.md
progress.md
```

These files are currently untracked and still present. They were not moved or deleted.

Current `git status --short` before this handoff document was created showed:

```text
?? findings.md
?? progress.md
?? task_plan.md
```

### 3. Reviewed Existing Project Structure and Deployment Needs

I inspected the repository layout, backend configuration, frontend configuration, documentation structure, and available scripts.

Representative local commands used during this phase included:

```bash
find docs -maxdepth 3 -type f | sort
git status --short
rg "axios|baseURL|request" ElectronicMallVue/src
rg "spring|datasource|redis|server.port" ElectronicMallApi/src/main/resources
sed -n '1,220p' docs/project/implementation-roadmap.md
sed -n '1,220p' docs/README.md
sed -n '1,220p' ElectronicMallApi/src/main/resources/application.yml
sed -n '1,220p' ElectronicMallVue/src/utils/request.js
```

### 4. Added Production-Friendly Local Configuration

I changed the frontend API base URL so production builds can call the backend through Nginx `/api`, while development can still call the local backend directly.

Files changed:

```text
ElectronicMallVue/src/utils/request.js
ElectronicMallVue/.env.development
ElectronicMallVue/.env.production
ElectronicMallVue/scripts/check-deployment-config.js
ElectronicMallVue/package.json
```

Main frontend behavior after the change:

```javascript
baseURL: process.env.VUE_APP_API_BASE_URL || '/api'
```

I changed the backend Spring Boot configuration so deployment values can be supplied through environment variables instead of editing source files on the VM.

File changed:

```text
ElectronicMallApi/src/main/resources/application.yml
```

Environment-variable controls added:

```text
SERVER_PORT
MYSQL_URL
MYSQL_USERNAME
MYSQL_PASSWORD
REDIS_DATABASE
REDIS_HOST
REDIS_PORT
```

### 5. Added Initial Deployment Documentation

I added and updated documentation for Phase 4 deployment planning.

Files changed:

```text
docs/engineering/cloud-deployment-guide.md
docs/reports/phase-4-cloud-deployment-report.md
docs/README.md
docs/records/project-work-log.md
```

At that point the Phase 4 report still contained pending values for actual VM verification because the cloud deployment had not yet completed.

### 6. Ran Local Pre-Deployment Verification

I ran local verification before deploying to Google Cloud.

Commands:

```bash
cd ElectronicMallVue
npm run check:auth
npm run check:deployment
npm run build
```

```bash
cd ElectronicMallApi
mvn -q package
```

Observed result:

- `npm run check:auth` passed.
- `npm run check:deployment` passed after the production API configuration was added.
- `npm run build` passed with existing Browserslist and asset-size warnings.
- `mvn -q package` passed, with existing test/debug warning output.

### 7. Committed and Pushed Initial Phase 4 Preparation

I committed and pushed the local deployment-preparation changes.

Commands:

```bash
git add ElectronicMallVue/src/utils/request.js \
  ElectronicMallVue/.env.development \
  ElectronicMallVue/.env.production \
  ElectronicMallVue/scripts/check-deployment-config.js \
  ElectronicMallVue/package.json \
  ElectronicMallApi/src/main/resources/application.yml \
  docs/engineering/cloud-deployment-guide.md \
  docs/reports/phase-4-cloud-deployment-report.md \
  docs/README.md \
  docs/records/project-work-log.md \
  .gitignore
git commit -m "Prepare Phase 4 cloud deployment"
git push
```

Result:

```text
d0bbc0d Prepare Phase 4 cloud deployment
```

### 8. Opened Google Cloud Console in Chrome

I used Chrome to access:

```text
https://console.cloud.google.com/
```

The active Google account was:

```text
a206331@siswa.ukm.edu.my
```

The console showed free-trial credit of roughly RM1,185 to RM1,186, expiring on 2026-08-17.

### 9. Created Google Cloud Project

Through the Google Cloud Console UI, I created/select the project:

```text
project-fyp-mall
```

The resulting project identifiers were:

```text
Project ID: cobalt-bond-496703-n2
Project number: 206025383026
```

### 10. Created Google Cloud VM

Through the Google Cloud Console UI, I created the VM:

```text
fyp-mall-vm
```

Configuration recorded:

```text
Zone: asia-southeast1-b
Machine type: e2-medium
OS: Ubuntu 22.04 LTS
Boot disk: 40 GB balanced persistent disk
Network tag: fyp-mall-http
External IP: 34.143.225.11
Internal IP: 10.148.0.4
```

### 11. Created HTTP Firewall Rule

Through the Google Cloud Console UI, I created the firewall rule:

```text
allow-fyp-mall-http
```

Rule behavior:

```text
Target tag: fyp-mall-http
Source range: 0.0.0.0/0
Allowed protocol/port: tcp:80
```

This was intended to allow public HTTP access to Nginx on the VM.

### 12. Opened Cloud Shell and SSH Session to VM

I used Google Cloud Shell in Chrome, then opened an SSH session to the VM.

The active VM shell prompt at stop time was:

```text
a206331@fyp-mall-vm:/opt/project-fyp-mall/ElectronicMallApi$
```

### 13. Installed Server Packages on the VM

I installed required runtime/build packages on the VM.

Commands used or equivalent commands entered in Cloud Shell/VM:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl git nginx mysql-server redis-server openjdk-11-jdk maven openssl rsync
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Purpose:

- `nginx`: public web server and reverse proxy;
- `mysql-server`: project database;
- `redis-server`: verification-code/cache dependency;
- `openjdk-11-jdk`: Spring Boot runtime;
- `maven`: backend build;
- `nodejs`: frontend build;
- `git`: repository clone;
- `openssl`: credential generation;
- `rsync`: frontend artifact deployment.

### 14. Configured MySQL and Redis on the VM

I configured a MySQL database and application user.

Sensitive values were generated on the server and were not written into repository files or this document.

Representative commands:

```bash
sudo systemctl enable --now mysql
sudo systemctl enable --now redis-server
sudo mysql
```

SQL operations performed conceptually:

```sql
CREATE DATABASE electronic_mall DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mall_app'@'localhost' IDENTIFIED BY '<redacted>';
GRANT ALL PRIVILEGES ON electronic_mall.* TO 'mall_app'@'localhost';
FLUSH PRIVILEGES;
```

Then I imported the project database seed:

```bash
mysql -u mall_app -p electronic_mall < database/electronic_mall.sql
```

### 15. Cloned the GitHub Repository on the VM

I cloned the project repository to the VM.

Command:

```bash
git clone https://github.com/Rufeng081/project-fyp-mall.git /opt/project-fyp-mall
```

The deployment directory became:

```text
/opt/project-fyp-mall
```

### 16. Created Runtime Environment File on the VM

I created a VM-local environment file:

```text
/etc/project-fyp-mall.env
```

The file contains deployment-specific values such as:

```text
SERVER_PORT=9191
MYSQL_URL=jdbc:mysql://127.0.0.1:3306/electronic_mall?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Kuala_Lumpur
MYSQL_USERNAME=mall_app
MYSQL_PASSWORD=<redacted>
REDIS_DATABASE=0
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

I did not store the database password in repository files or docs.

### 17. Built and Deployed the Frontend on the VM

I built the Vue frontend and deployed the compiled static files to Nginx web root.

Representative commands:

```bash
cd /opt/project-fyp-mall/ElectronicMallVue
npm install
npm run build
sudo mkdir -p /var/www/project-fyp-mall
sudo rsync -a --delete dist/ /var/www/project-fyp-mall/
sudo chown -R www-data:www-data /var/www/project-fyp-mall
```

Nginx web root:

```text
/var/www/project-fyp-mall
```

### 18. Configured Nginx Reverse Proxy

I configured Nginx to:

- serve the Vue production build;
- fallback to `index.html` for SPA routes;
- proxy `/api/` requests to the backend on `127.0.0.1:9191`.

Representative Nginx behavior:

```nginx
root /var/www/project-fyp-mall;
index index.html;

location / {
    try_files $uri $uri/ /index.html;
}

location /api/ {
    proxy_pass http://127.0.0.1:9191/;
}
```

Representative commands:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 19. Configured Backend Runtime Directory and systemd Service

I created the backend runtime location:

```text
/opt/project-fyp-mall/runtime/project-fyp-mall-api.jar
```

I configured a systemd service:

```text
project-fyp-mall.service
```

The service was configured to:

- run as `www-data`;
- load environment variables from `/etc/project-fyp-mall.env`;
- start the JAR with Java.

Representative systemd command sequence:

```bash
sudo systemctl daemon-reload
sudo systemctl enable project-fyp-mall
sudo systemctl restart project-fyp-mall
```

### 20. First Public Access Attempt Failed

Before Nginx/backend were fully healthy, public access returned connection failure.

Observed local verification command:

```bash
curl -I --max-time 10 http://34.143.225.11
```

Observed result:

```text
connection refused
```

This showed that the server stack was not yet correctly serving HTTP.

### 21. Diagnosed Backend systemd Failure

I checked the backend service logs.

Commands:

```bash
systemctl status project-fyp-mall --no-pager
journalctl -u project-fyp-mall -n 80 --no-pager
```

Root cause found:

```text
no main manifest attribute, in /opt/project-fyp-mall/runtime/project-fyp-mall-api.jar
```

Meaning:

- Maven had produced a plain library-style JAR;
- systemd could not run it with `java -jar`;
- the backend needed a Spring Boot executable JAR.

### 22. Fixed Backend JAR Packaging Locally

I updated:

```text
ElectronicMallApi/pom.xml
```

Change added:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

### 23. Verified the Backend JAR Manifest Locally

After adding the Spring Boot Maven plugin, I rebuilt the backend locally and inspected the generated manifest.

Commands:

```bash
cd ElectronicMallApi
mvn -q package
jar xf target/ElectronicMallApi-0.0.1-SNAPSHOT.jar META-INF/MANIFEST.MF
sed -n '1,80p' META-INF/MANIFEST.MF
```

Expected/observed manifest entries:

```text
Main-Class: org.springframework.boot.loader.JarLauncher
Start-Class: com.rabbiter.em.ElectronicMallApplication
```

### 24. Committed and Pushed Backend Packaging Fix

Commands:

```bash
git add ElectronicMallApi/pom.xml
git commit -m "Fix backend executable jar packaging"
git push
```

Result:

```text
b4b976e Fix backend executable jar packaging
```

### 25. Pulled/Rebuilt the Backend on the VM

I returned to the VM and attempted to build the backend again.

Commands used around this phase included:

```bash
cd /opt/project-fyp-mall
git pull
cd /opt/project-fyp-mall/ElectronicMallApi
sudo mvn -q -DskipTests package
```

### 26. Encountered Corrupted Maven Build Output on the VM

During repeated/overlapping remote build attempts, Maven produced a corrupted target JAR error.

Observed error:

```text
zip END header not found
```

Working diagnosis:

- more than one Maven build had likely touched the same `target` directory;
- the generated JAR in `target` was corrupted;
- the fix was to remove `target` and run a single clean Maven build.

### 27. Checked for Running Maven Processes on the VM

I attempted a process check. One command was typed incorrectly due terminal quoting/paste behavior:

```bash
ps -ef  grep 'mvn'
```

It returned a `ps` usage/error and was not useful.

Then I ran:

```bash
pgrep -fa mvn
```

Observed result:

```text
<no output>
```

Meaning no Maven process was still running.

### 28. Cleaned Remote Backend Target and Rebuilt Successfully

From the active VM SSH session:

```bash
cd /opt/project-fyp-mall/ElectronicMallApi
sudo rm -rf target
sudo mvn -q -DskipTests package
```

The build returned to the shell prompt without error.

I then listed the target directory:

```bash
ls -lh target
```

Observed output:

```text
total 51M
-rw-r--r-- 1 root root 51M May 19 02:47 ElectronicMallApi-0.0.1-SNAPSHOT.jar
-rw-r--r-- 1 root root 100K May 19 02:47 ElectronicMallApi-0.0.1-SNAPSHOT.jar.original
drwxr-xr-x 8 root root 4.0K May 19 02:47 classes
drwxr-xr-x 3 root root 4.0K May 19 02:47 generated-sources
drwxr-xr-x 3 root root 4.0K May 19 02:47 generated-test-sources
drwxr-xr-x 2 root root 4.0K May 19 02:47 maven-archiver
drwxr-xr-x 3 root root 4.0K May 19 02:47 maven-status
drwxr-xr-x 3 root root 4.0K May 19 02:47 test-classes
```

This is the exact point where deployment work stopped.

## Commands That Still Need To Be Run

The next intended commands on the VM were:

```bash
cd /opt/project-fyp-mall/ElectronicMallApi
sudo cp target/ElectronicMallApi-0.0.1-SNAPSHOT.jar /opt/project-fyp-mall/runtime/project-fyp-mall-api.jar
sudo chown www-data:www-data /opt/project-fyp-mall/runtime/project-fyp-mall-api.jar
sudo systemctl restart project-fyp-mall
```

After waiting about 10 to 20 seconds, these checks should be run on the VM:

```bash
systemctl is-active project-fyp-mall
systemctl is-active mysql
systemctl is-active redis-server
systemctl is-active nginx
curl -I http://127.0.0.1
curl "http://127.0.0.1/api/good/page?pageNum=1&pageSize=1"
```

If the backend service is not active:

```bash
systemctl status project-fyp-mall --no-pager
journalctl -u project-fyp-mall -n 80 --no-pager
```

Public checks from the local machine should then be:

```bash
curl -I --max-time 10 http://34.143.225.11
curl --max-time 15 "http://34.143.225.11/api/good/page?pageNum=1&pageSize=1"
```

Browser verification should then open:

```text
http://34.143.225.11
```

## Unfinished Work

The following tasks are not complete:

1. Copy the successfully rebuilt backend JAR to `/opt/project-fyp-mall/runtime/project-fyp-mall-api.jar`.
2. Restart `project-fyp-mall.service`.
3. Confirm `project-fyp-mall.service` is active.
4. Confirm MySQL, Redis, and Nginx are active.
5. Confirm Nginx serves the Vue app locally on the VM.
6. Confirm `/api` proxy reaches the backend locally on the VM.
7. Confirm public frontend access at `http://34.143.225.11`.
8. Confirm public API access through `http://34.143.225.11/api/...`.
9. Perform core browser-level functional checks.
10. Update `docs/reports/phase-4-cloud-deployment-report.md` from pending to final verified values.
11. Update `docs/records/environment-setup-log.md` with the Google Cloud VM environment setup.
12. Update `docs/records/project-work-log.md` to mark Phase 4 complete only if verification passes.
13. Commit and push the final documentation updates.

## Known Risks and Notes

- The current VM database password exists only in the VM environment file and is intentionally not recorded here.
- Live registration email verification still depends on valid SMTP/Brevo credentials in the VM environment. If those credentials are not present, email-sending flows may fail even if the rest of the application works.
- HTTPS was not configured. Phase 4 was targeting public IP HTTP access. A domain and Certbot can be added later.
- The latest successful remote Maven build produced a 51 MB Spring Boot JAR, but that JAR had not yet been copied into the systemd runtime path when work stopped.
- The root planning files `task_plan.md`, `findings.md`, and `progress.md` were temporary planning notes. They were later merged into `docs/records/project-work-log.md` and removed from the tracked repository during documentation cleanup.

## Recommended Resume Point

Resume from the active VM SSH session if it is still open:

```text
a206331@fyp-mall-vm:/opt/project-fyp-mall/ElectronicMallApi$
```

Run:

```bash
sudo cp target/ElectronicMallApi-0.0.1-SNAPSHOT.jar /opt/project-fyp-mall/runtime/project-fyp-mall-api.jar
sudo chown www-data:www-data /opt/project-fyp-mall/runtime/project-fyp-mall-api.jar
sudo systemctl restart project-fyp-mall
```

Then verify services and public access before marking Phase 4 complete.
