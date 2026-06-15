# Live Database phpMyAdmin Check

Date: 2026-06-16

## Purpose

Explain why phpMyAdmin did not show the database optimization changes after the repository and VM code sync, and verify the current live MySQL schema used by the deployed Project FYP Mall system.

## Method

Used read-only MySQL structure queries on the Google Cloud VM through `gcloud compute ssh` and `sudo mysql`. No database schema or data changes were applied during this check.

Target:

- VM: `fyp-mall-vm`
- Zone: `asia-southeast1-b`
- Database: `electronic_mall`
- Public phpMyAdmin page observed by user: `http://34.143.225.11/phpmyadmin/`

## Main Finding

phpMyAdmin did not show the optimized database structure because the previous work changed the repository SQL seed file, not the live MySQL database.

The optimized schema exists in:

- `database/electronic_mall.sql`

The live VM database was intentionally not overwritten during the previous sync because importing the full seed script would drop/recreate tables and could reset current demo data.

## Live Database Structure Findings

| Area | Live DB Result | Assessment |
| --- | --- | --- |
| Tables | `standard` table still exists | Not aligned with optimized SQL seed; backend uses `good_standard`, so `standard` is legacy/unused. |
| `good_standard` primary key | No primary key found | Weak design; duplicate variants can be inserted. |
| Foreign keys | No physical foreign keys found | Weak integrity enforcement; relationships are only enforced by application logic. |
| Money fields | `good.discount` and `good.sale_money` are still `double(10,2)` | Not ideal for money/ratio values; optimized SQL uses `decimal`. |
| `order_goods` integrity | 14 orphaned `order_goods` rows found | Weak demo data consistency; foreign keys cannot be added until these rows are cleaned. |
| User email uniqueness | `sys_user.uk_sys_user_email` exists | Reasonable. |
| Username uniqueness | No username unique key found | Weak account integrity; optimized SQL adds it. |
| Order number uniqueness | No `t_order.order_no` unique key found | Weak order integrity; optimized SQL adds it. |
| Practical indexes | Only primary keys and user email unique index are present for the checked tables | Missing useful indexes for cart/order/product lookup paths. |

## What Was Actually Changed Previously

Repository and server code sync changes:

- Updated `database/electronic_mall.sql` with optimized table definitions.
- Added database design documentation, ERD explanation, improvement plan, and JMeter plans under `/docs`.
- Added `tools/check-database-schema.js`.
- Pushed changes to GitHub.
- Pulled the repository on the VM and rebuilt/restarted the application.
- Did not import or alter the live MySQL database.

## Current Reasonableness Assessment

The live database is acceptable for a short FYP demonstration because the deployed application currently runs and the public smoke checks return successful responses.

However, the live database is not yet fully reasonable from a database design/report-review perspective. It still has avoidable design weaknesses:

- Missing primary key on `good_standard`.
- Missing foreign key constraints.
- Legacy `standard` table still present.
- `double` used for `good.sale_money`.
- Orphaned `order_goods` data.
- Missing uniqueness/indexes for common lookup paths.

## Recommended Next Step

Do not import the full `database/electronic_mall.sql` directly into the live VM database unless the current demo data can be reset.

Safer next step:

1. Back up the live database.
2. Create a migration SQL file that changes the existing live database in place.
3. Clean orphaned data first.
4. Add missing keys, indexes, and foreign keys.
5. Re-run smoke tests after migration.

This keeps the live demo data while bringing phpMyAdmin into alignment with the optimized schema.
