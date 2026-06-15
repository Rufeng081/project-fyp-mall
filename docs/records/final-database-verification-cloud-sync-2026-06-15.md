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

Status: pending at the time this record was created.

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
