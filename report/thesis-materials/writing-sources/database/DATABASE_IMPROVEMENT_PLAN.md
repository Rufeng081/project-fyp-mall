# Database Improvement Plan for Final FYP Readiness

Date: 2026-06-15

Scope: small cloud-based e-commerce platform for a Network Technology FYP. This plan intentionally avoids microservices, Kubernetes, real payment gateway integration, AI recommendation, and enterprise-scale features.

## Implementation Status

The local SQL seed file has been updated for the core database design improvements on 2026-06-15.

| Item | Status |
| --- | --- |
| Add key to `good_standard` | Complete in `database/electronic_mall.sql` with composite primary key `(good_id, value)` |
| Remove duplicate `standard` table | Complete in `database/electronic_mall.sql` |
| Clean orphaned `order_goods` seed rows | Complete in `database/electronic_mall.sql` |
| Standardize money fields | Complete for `good.discount` and `good.sale_money` |
| Add order number uniqueness | Complete with `uk_t_order_order_no` |
| Add practical indexes | Complete for product, cart, order, order item, carousel, and relation lookups |
| Add foreign keys | Complete in the SQL file using post-seed `ALTER TABLE` statements |
| Keep MD5 password flow | Kept by project decision; documented as a demo limitation |
| Verify real MySQL import locally | Blocked because local MySQL is not accepting socket or TCP connections |
| Apply schema to cloud VM | Not done in this local pass; back up VM database first |

## Current Demonstration Readiness

The deployed cloud system is partially ready for final demonstration.

Live checks against `http://34.143.225.11` on 2026-06-15 confirmed:

| Area | Result |
| --- | --- |
| Public frontend endpoint | HTTP 200 from Nginx |
| Homepage product API | Passed |
| Carousel API | Passed |
| Product detail API | Passed |
| Product variant API | Passed |
| Product image resource | Passed |
| Demo user login | Passed |
| Authenticated user ID | Passed |
| Cart read API | Passed |
| Order history API | Passed |

Not yet executed against the live VM during this audit:

- Add-to-cart mutation.
- Place-order mutation.
- Simulated-payment mutation.
- Email verification with live SMTP credentials.

These flows should be verified with the JMeter plans and/or the existing golden-path script before the presentation, because they modify demo data.

## Completed Must-Fix Items

1. Add a reliable key to the active product-variant table.
   - Current issue: `good_standard` has no primary key.
   - Risk: duplicate variants such as the same product plus same standard can be inserted, causing wrong stock and price lookups.
   - Applied fix: added composite primary key on `(good_id, value)`.

2. Remove or clearly retire the unused `standard` table.
   - Current issue: the backend `Standard` entity maps to `good_standard`, while the SQL also creates `standard` with `goodId`.
   - Risk: report reviewers may see two variant tables and question the design.
   - Applied fix: removed `standard` from the seed script after confirming the backend maps to `good_standard`.

3. Clean orphaned seed data before adding relationships.
   - Current issue: `order_goods` contains rows for order IDs 10-23, but `t_order` only seeds orders 9 and 24.
   - Risk: database integrity is weak and foreign keys cannot be added without cleanup.
   - Applied fix: removed orphaned `order_goods` seed rows and retained only rows that match seeded `t_order` records.

4. Standardize money fields.
   - Current issue: `good.sale_money` uses `double(10,2)` while `good_standard.price` and `t_order.total_price` use `decimal(10,2)`.
   - Risk: floating-point money storage can produce rounding problems.
   - Applied fix: changed `good.sale_money` to `decimal(10,2)` and `good.discount` to `decimal(4,2)`.

5. Add uniqueness to order numbers.
   - Current issue: `t_order.order_no` is generated as a business identifier but has no unique index.
   - Risk: duplicate order numbers could break payment and order-history lookups.
   - Applied fix: added `UNIQUE KEY uk_t_order_order_no (order_no)`.

## Remaining Before Applying to Cloud VM

1. Align cloud database data with the repository seed.
   - Current issue: live cloud API responses show 2023 timestamps, while the current SQL seed file uses 2026 timestamps.
   - Risk: the presentation report and live demo may not match.
   - Recommended fix: before the final demo, either migrate the VM database to the current seed or update the report to describe the VM data version.

2. Record weak password hashing as a presentation limitation.
   - Current issue: the frontend sends MD5 hashes and the backend compares stored hashes directly.
   - Risk: MD5 is not acceptable for real password storage.
   - Current decision: keep the MD5 flow for this FYP demo to avoid broad authentication changes before presentation.
   - Presentation handling: clearly label MD5 as a demo limitation and do not use real personal passwords.

## Recommended Improvements

1. Add foreign keys after seed cleanup.
   - `address.user_id -> sys_user.id`
   - `cart.user_id -> sys_user.id`
   - `cart.good_id -> good.id`
   - `carousel.good_id -> good.id`
   - `good.category_id -> category.id`
   - `good_standard.good_id -> good.id`
   - `icon_category.category_id -> category.id`
   - `icon_category.icon_id -> icon.id`
   - `order_goods.order_id -> t_order.id`
   - `order_goods.good_id -> good.id`
   - `t_order.user_id -> sys_user.id`

   Status: complete in the SQL file. Verify with real MySQL import before applying to the VM.

2. Add indexes for actual query paths.
   - `good(category_id, is_delete, recommend)`
   - `good_standard(good_id, value)`
   - `cart(user_id, create_time)`
   - `t_order(user_id, create_time)`
   - `t_order(order_no)`
   - `order_goods(order_id)`
   - `order_goods(good_id)`
   - `carousel(show_order)`

   Status: complete in the SQL file.

3. Add uniqueness where the business model expects it.
   - `sys_user.username`
   - `sys_user.email` already exists and should be retained.
   - `category.name`
   - `icon_category.category_id` can remain primary if each category has one icon.
   - `sys_file.md5` and `avatar.md5` can be unique if duplicate uploads should reuse the same stored file.

4. Tighten important nullable fields.
   - Require names, prices, stock, order number, order user, and order state.
   - Keep optional fields nullable only where the UI really allows them.

5. Normalize status values.
   - Current order state is text such as `Pending Payment`, `Paid`, `Shipped`, and `Received`.
   - A small FYP-friendly improvement is to document allowed values and validate them in code.

## Future Work

- Introduce SQL migration tooling such as Flyway or Liquibase after the FYP demo.
- Add audit fields such as `updated_time` for important tables.
- Add soft-delete consistency for user-facing records.
- Add better admin reporting indexes after JMeter results show real bottlenecks.
- Replace MD5 password storage with backend-side salted password hashing in a future production version.
- Replace simulated payment with a real payment provider only in a future production version.
- Add HTTPS with a domain name and certificate when the deployment moves beyond FYP demonstration.

## Proposed Implementation Order

1. Back up the VM MySQL database.
2. Clean orphaned `order_goods` seed records.
3. Remove the unused `standard` table from the SQL script.
4. Add key and index changes to `database/electronic_mall.sql`.
5. Update affected backend entity annotations only if the selected key design requires it.
6. Re-import or migrate a test database locally.
7. Run backend tests and package build.
8. Run frontend deployment checks and build.
9. Run golden-path API check locally.
10. Run JMeter smoke plans against local or cloud endpoint.
11. Update cloud database in a controlled maintenance window.
12. Record final verification results in `/docs/records/project-work-log.md`.
