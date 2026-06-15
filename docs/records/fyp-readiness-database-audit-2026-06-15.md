# FYP Readiness and Database Audit Record

Date: 2026-06-15

## Purpose

Inspect `Rufeng081/project-fyp-mall` for final FYP readiness, with emphasis on the deployed cloud demo, database schema quality, report-ready database documentation, and JMeter performance-test preparation.

## Operations Performed

| Operation | Purpose | Result |
| --- | --- | --- |
| Confirmed GitHub repository metadata | Verify target project and default branch | `Rufeng081/project-fyp-mall`, default branch `main`, public repository |
| Checked local Git remote | Confirm local workspace matches GitHub project | `origin` points to `https://github.com/Rufeng081/project-fyp-mall.git` |
| Reviewed `database/electronic_mall.sql` | Identify schema risks | Found missing key on `good_standard`, no foreign keys, duplicate `standard` table, money datatype inconsistency, orphan seed data, and missing indexes |
| Reviewed backend entities, mappers, services, and controllers | Link schema findings to actual code paths | Confirmed active variant table is `good_standard`; order, cart, product, and login flows map to current tables |
| Reviewed frontend API calls | Identify JMeter target flows | Mapped homepage, product list, detail, login, cart, order, payment, and order history endpoints |
| Checked live cloud endpoint | Verify current deployed readiness | Nginx, product APIs, image resource, login, cart read, and order history read returned successful responses |
| Created database improvement plan | Separate urgent fixes from future work | Added `docs/database/DATABASE_IMPROVEMENT_PLAN.md` |
| Created database design documentation | Provide FYP report material | Added `docs/database/DATABASE_DESIGN.md` and `docs/database/ERD_EXPLANATION.md` |
| Created JMeter test plans | Prepare repeatable performance and smoke testing | Added eight `.jmx` files under `docs/testing/jmeter/` |
| Added schema validation script | Make database design checks repeatable | Added `tools/check-database-schema.js` |
| Updated SQL seed schema | Apply database must-fix items locally | Added keys, indexes, foreign keys, decimal money fields, removed duplicate `standard`, and cleaned orphaned `order_goods` rows |
| Checked backend/frontend compatibility | Verify no code sync was required for schema changes | Backend tests and frontend auth/deployment checks passed |

## Main Findings

- The cloud demo is reachable and suitable for a non-mutating walkthrough of homepage, product browsing, login, cart display, and order history.
- The live cloud database appears older than the repository seed data because API responses show 2023 dates while the current SQL seed contains 2026 dates.
- The database schema is usable for the current small demo, and the local SQL seed now includes core integrity improvements.
- `good_standard` is the active variant table and now has composite primary key `(good_id, value)`.
- The unused legacy `standard` table has been removed from the SQL seed.
- Orphan `order_goods` seed rows have been removed from the SQL seed.
- Password storage uses MD5 hashes sent from the frontend; per current project decision, this remains unchanged for the FYP demo and is documented as a limitation.
- Local MySQL import verification is still blocked because the local MySQL service is not accepting socket or TCP connections.

## Scope Control

Database schema changes were applied only to the repository SQL seed file, not directly to the local `electronic_mall` database or cloud VM database. No microservices, Kubernetes, real payment gateway, AI recommendation, or enterprise-level architecture changes were introduced.
