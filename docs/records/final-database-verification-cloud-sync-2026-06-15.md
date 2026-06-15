# Final Database Verification and Cloud Sync Record

Date: 2026-06-15

## Purpose

Confirm that the database optimization is complete, verify that the backend/frontend code remains compatible with the optimized SQL seed, push the verified project state to GitHub, and synchronize the Google Cloud VM through `gcloud` CLI.

## Scope

- Small cloud-based e-commerce platform for Network Technology FYP.
- No microservices, Kubernetes, real payment gateway, AI recommendation, or enterprise features.
- Existing MD5 password flow remains unchanged by project decision.
- Cloud database mutation must be controlled: back up before applying the optimized SQL to the VM database.

## Local Verification

| Check | Working Directory | Result | Finding |
| --- | --- | --- | --- |
| Schema validation | repository root | Passed with `node tools/check-database-schema.js` | SQL seed includes required keys, indexes, FK declarations, decimal money fields, no duplicate `standard` table, and no orphaned `order_goods` seed rows. |
| JMeter XML validation | repository root | Passed with `xmllint --noout docs/testing/jmeter/*.jmx` | All prepared JMeter files are valid XML. |
| Backend tests | `ElectronicMallApi` | Passed with `mvn -q test` | Backend tests still pass after SQL seed optimization. |
| Backend package | `ElectronicMallApi` | Passed with `mvn -q package` | Spring Boot package builds successfully. |
| Frontend auth check | `ElectronicMallVue` | Passed with `npm run check:auth` | Login/session behavior checks still pass. |
| Frontend deployment check | `ElectronicMallVue` | Passed with `npm run check:deployment` | Production-facing API/resource routing checks still pass. |
| Frontend production build | `ElectronicMallVue` | Passed with `npm run build` | Build completed; only existing Browserslist and bundle-size warnings were reported. |
| Whitespace check | repository root | Passed with `git diff --check` | No trailing whitespace or conflict marker issues found. |

## Database and Code Compatibility Findings

- Backend active product variant entity `Standard` maps to `good_standard`, so removing the unused SQL `standard` table does not conflict with current Java mappings.
- Cart, order, product detail, and simulated payment logic query `good_standard` by `good_id` and `value`, matching the new composite primary key.
- `good.sale_money` maps to Java `BigDecimal`, matching the optimized `decimal(10,2)` SQL type.
- `good.discount` remains Java `Double`; MySQL can return the optimized `decimal(4,2)` value through the existing mapper without requiring code changes for the current FYP demo scope.
- Existing login flow still uses MD5 password hashes and was intentionally left unchanged.

## Local Environment Notes

- Initial root-level `mvn -q test` and `npm run check:auth` failed because the repository root does not contain `pom.xml` or `package.json`; the commands passed after rerunning from the correct module directories.
- Local MySQL import validation remains blocked because the local MySQL server is not accepting connections on `127.0.0.1:3306`.
- Local JMeter execution remains unavailable because the `jmeter` command is not installed.

## GitHub Push

Status: completed.

| Item | Result |
| --- | --- |
| Branch | `main` |
| Commit | `eab14af Prepare final FYP database readiness` |
| Remote | `https://github.com/Rufeng081/project-fyp-mall.git` |
| Push result | `85e1047..eab14af main -> main` |

## Google Cloud VM Sync

Target:

- VM: `fyp-mall-vm`
- Zone: `asia-southeast1-b`
- Public endpoint: `http://34.143.225.11`
- Expected repository path: `/opt/project-fyp-mall`
- Expected backend service: `project-fyp-mall.service` or `project-fyp-mall-api.service` depending on the VM's active unit.

Planned low-risk sync:

1. Pull the pushed GitHub commit on the VM.
2. Rebuild the backend package on the VM.
3. Rebuild the frontend and sync `dist/` to `/var/www/project-fyp-mall`.
4. Restart the active Spring Boot systemd service.
5. Reload or verify Nginx.
6. Run public smoke checks.

Database note:

- The optimized SQL seed is ready in the repository, but the cloud VM database should not be overwritten without first backing up the current demo database and confirming that replacing the live seed data is desired.

## Google Cloud VM Sync Result

Status: completed for repository code and application runtime. The cloud database was not overwritten.

Operations performed:

| Operation | Purpose | Result |
| --- | --- | --- |
| Confirmed gcloud target | Verify correct GCP account, project, zone, and VM | Account `a206331@siswa.ukm.edu.my`, project `cobalt-bond-496703-n2`, zone `asia-southeast1-b`, VM `fyp-mall-vm` |
| Checked VM status | Confirm server is reachable before sync | VM `RUNNING`, public IP `34.143.225.11` |
| Checked VM repository | Confirm current server commit | Initial VM checkout was behind GitHub and had runtime `uploads/` as untracked data |
| Fixed Git safety/permission blocker | Allow Git sync without using root-owned repository state | Added Git safe-directory entry and corrected repository code ownership to `a206331:a206331`, excluding `uploads` and `runtime` |
| Pulled GitHub changes | Sync server repository with pushed commit | Fast-forwarded VM repository to `eab14af` |
| Built backend on VM | Confirm backend still packages on server | `mvn -q -DskipTests clean package` completed |
| Checked frontend deployment config on VM | Confirm production routing settings on server | `npm run check:deployment` passed |
| Built frontend on VM | Generate production static files | `npm run build` completed with existing Browserslist and asset-size warnings |
| Synced frontend static files | Deploy Vue `dist/` to Nginx web root | `rsync` copied `dist/` to `/var/www/project-fyp-mall/` |
| Restarted backend service | Apply rebuilt backend artifact | `project-fyp-mall.service` restarted and reported `active` |
| Verified Nginx | Confirm reverse proxy config remains valid | `nginx -t` passed and Nginx reported `active` |

Post-sync smoke checks:

| Check | Result |
| --- | --- |
| Public homepage | `curl -I http://34.143.225.11` returned HTTP `200 OK` |
| Public product API | `curl http://34.143.225.11/api/api/good/page?pageNum=1&pageSize=1` returned JSON with `"code":"200"` |
| VM local product API | `curl http://127.0.0.1/api/api/good/page?pageNum=1&pageSize=1` returned JSON with `"code":"200"` |
| VM repository status | `main...origin/main`; untracked `uploads/` remains as runtime data |

Important database deployment finding:

- The VM application has been synchronized with the repository, but the live MySQL database was not replaced with `database/electronic_mall.sql`. This is intentional because applying the optimized SQL seed would reset live demo data unless a backup and controlled import/migration step is performed first.

Final documentation sync:

- After recording the application sync result, documentation-only commit `30d2afa Record final FYP cloud sync` was pushed to GitHub and pulled on the VM.
- Final VM checks after that pull showed commit `30d2afa`, `project-fyp-mall.service` active, Nginx active, public homepage HTTP `200`, and public product API JSON `"code":"200"`.
