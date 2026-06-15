# Live Database Optimization Record

Date: 2026-06-16

## Purpose

Apply the previously prepared database optimization to the live Google Cloud MySQL database while preserving demo data, then verify that the deployed website and API still run correctly.

## Scope

- Database: `electronic_mall`
- VM: `fyp-mall-vm`
- Zone: `asia-southeast1-b`
- Public endpoint: `http://34.143.225.11`
- Password hashing remains MD5 by project decision.
- No microservices, Kubernetes, real payment gateway, AI recommendation, or enterprise features were added.

## Migration File

Repository migration:

- `database/migrations/2026-06-16-live-db-optimization.sql`

This is an in-place migration. It does not use the full seed script and does not reset demo tables.

## Pre-Migration Findings

Read-only checks found:

| Area | Finding |
| --- | --- |
| MySQL version | `8.0.46-0ubuntu0.22.04.2` |
| `good_standard` duplicates | No duplicate `(good_id, value)` rows |
| `good_standard` NULL key values | None |
| `order_goods` orphan rows | 14 rows referencing missing `t_order` IDs |
| Other relationship orphan checks | No blocking orphan rows found |
| Duplicate usernames/order numbers | None returned by checks |

## Backup

Backup created before changing the live database:

- `/var/backups/project-fyp-mall/electronic_mall_before_live_db_optimization_20260616_232702.sql`

The first backup command failed because shell quoting expanded the remote `$BACKUP` variable locally. No database changes were made during that failed attempt. The backup command was rerun with remote-side quoting and completed successfully.

## Temporary Rehearsal

Before touching the live database, the backup was imported into:

- `electronic_mall_migration_check_20260616`

The migration was applied to that temporary database first.

Temporary DB verification after rehearsal:

| Check | Result |
| --- | --- |
| Legacy `standard` table | Removed |
| Orphan `order_goods` rows | `0` |
| Foreign-key count | `11` |
| `good.sale_money` type | `decimal(10,2)` |
| `good.discount` type | `decimal(4,2)` |
| `good_standard` primary key | `(good_id, value)` |

## Live Migration Applied

The tested migration was applied to live `electronic_mall`.

During the migration:

1. `project-fyp-mall.service` was stopped briefly.
2. The migration SQL was applied to live MySQL.
3. `project-fyp-mall.service` was started again.
4. The service reported `active`.

## Live Database Changes

Applied changes:

- Deleted the 14 orphaned `order_goods` rows.
- Dropped the unused `standard` table.
- Changed `good.discount` to `decimal(4,2)`.
- Changed `good.sale_money` to `decimal(10,2)`.
- Added primary key `(good_id, value)` to `good_standard`.
- Added unique key on `sys_user.username`.
- Added unique key on `t_order.order_no`.
- Added practical lookup indexes for address, carousel, cart, good, icon-category, order, and order item queries.
- Added 11 physical foreign-key constraints:
  - `fk_address_user`
  - `fk_cart_user`
  - `fk_cart_good`
  - `fk_carousel_good`
  - `fk_good_category`
  - `fk_good_standard_good`
  - `fk_icon_category_category`
  - `fk_icon_category_icon`
  - `fk_order_user`
  - `fk_order_goods_order`
  - `fk_order_goods_good`

## Post-Migration Live DB Verification

| Check | Result |
| --- | --- |
| `standard` table exists | `0` |
| Orphan `order_goods` rows | `0` |
| Foreign-key count | `11` |
| `good.sale_money` | `decimal(10,2)` |
| `good.discount` | `decimal(4,2)` |
| `good_standard` primary key | `good_id,value` |
| `sys_user.username` unique key | Present |
| `t_order.order_no` unique key | Present |
| Expected practical indexes | `10` found |

## Application Verification

VM service checks:

| Check | Result |
| --- | --- |
| `project-fyp-mall.service` | `active` |
| `nginx` | `active` |
| Recent backend startup | Spring Boot started on port `9191` |

Recent backend logs still show existing MyBatis-Plus warnings for entities without `@TableId` annotations, including `Standard` and `IconCategory`. These warnings do not block startup and the current code paths do not use the unavailable `xxById` methods for those entities.

Public non-mutating smoke checks:

| Flow | Result |
| --- | --- |
| Homepage | Passed |
| Product list | Passed |
| Product detail | Passed |
| Product variants | Passed |
| Carousel | Passed |
| Login | Passed |
| Authenticated user ID | Passed |
| Cart read | Passed |
| Order history read | Passed |

Controlled write smoke test:

| Flow | Result |
| --- | --- |
| Login as demo user | Passed |
| Add to cart | Passed |
| Place Pending Payment order | Passed |
| Verify created order in history | Passed |
| Delete test order | Passed |
| Confirm cleanup in MySQL | `0` test order rows, `0` orphan `order_goods` rows |

Test order number:

- `20260615233112469267`

The test order was deleted after verification. Simulated payment was not executed, so product stock and sales totals were not intentionally changed by this smoke test.

## Local Verification

| Check | Result |
| --- | --- |
| `node tools/check-database-schema.js` | Passed |
| `xmllint --noout docs/testing/jmeter/*.jmx` | Passed |
| `git diff --check` | Passed |
| `mvn -q test` in `ElectronicMallApi` | Passed |
| `mvn -q package` in `ElectronicMallApi` | Passed |
| `npm run check:auth` in `ElectronicMallVue` | Passed |
| `npm run check:deployment` in `ElectronicMallVue` | Passed |
| `npm run build` in `ElectronicMallVue` | Passed with existing Browserslist and asset-size warnings |

## Phase 1-4 Status

| Phase | Status after this check |
| --- | --- |
| Phase 1-2 localization and core e-commerce stabilization | Verified through backend/frontend regression checks and public smoke checks |
| Phase 3 email/authentication work | Regression checks pass; MD5 login remains intentionally unchanged |
| Phase 4 cloud deployment | VM service, Nginx, public homepage, and public API checks pass |
| Final database readiness | Live DB now matches the optimized design objectives without resetting demo data |

## Remaining Notes

- Keep the backup until after the final FYP presentation.
- phpMyAdmin should now show the optimized live schema.
- JMeter is still not installed locally, so `.jmx` files were XML-validated but not executed in this pass.
