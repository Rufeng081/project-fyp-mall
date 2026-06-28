# Product Catalog Image Review and Cloud Sync Record - 2026-06-27

## Purpose

Remove the alcohol-related seed product, expand the storefront seed catalog with culturally respectful products, verify the user-provided real product images, preserve the operation evidence under `docs/records`, then synchronize GitHub, the Google Cloud VM, and the live MySQL database.

## Scope

- Local branch: `main`
- GitHub repository: `Rufeng081/project-fyp-mall`
- VM: `fyp-mall-vm`
- Zone: `asia-southeast1-b`
- VM repository path: `/opt/project-fyp-mall`
- Public endpoint: `http://34.143.225.11/`
- Database: `electronic_mall`
- Out of scope: task 3 UI optimization. No UI branch or UI background change is included in this sync.

## Local Changes

| Area | Change | Purpose |
|---|---|---|
| Product seed data | Removed `Premium Malt Beverage` from `database/electronic_mall.sql`. | Avoid alcohol-related products and respect Muslim user constraints. |
| Product variants | Removed the deleted product's `Single Bottle` and `Gift Set of 3` standards. | Avoid orphaned or inappropriate purchasable variants. |
| Carousel seed | Repointed the carousel item that referenced deleted product ID `4` to new product ID `11`. | Keep seeded carousel data valid after removing the product. |
| Catalog expansion | Added 50 products across clothing, shoes, stationery, books, technology accessories, drinks, tea, coffee, food, household supplies, and daily essentials. | Provide a broader FYP demo catalog with complete product metadata. |
| Product standards | Added price and stock records for each new product in `good_standard`. | Ensure listing, detail, and cart flows can resolve product prices. |
| Product images | Added 50 user-provided real JPEG product images under `ElectronicMallApi/file/`. | Replace placeholder/icon assets with realistic storefront product photography. |
| Backend file serving | Added a fallback in `FileService.download()` from configured upload storage to bundled `ElectronicMallApi/file/`. | Let seeded repository product images render before or alongside production upload migration. |
| Regression coverage | Added `FileServiceDownloadTest`. | Prove bundled seed images are downloadable when the configured upload folder does not contain them. |

## Product Image Review

The 50 image files were reviewed in two passes.

File-level checks:

- All expected files from `seed_011_*.jpg` through `seed_060_*.jpg` are present.
- Every file is JPEG image data.
- Every image is `800x800`.
- Filenames match the paths referenced by `database/electronic_mall.sql`.

Visual checks:

- Images are real product-style photos on white or light backgrounds.
- Product content matches the intended SQL product names and categories.
- No alcohol, pork-related, gambling, adult, political, or religiously sensitive content was observed.
- No obvious watermark was observed.
- Some images contain product-package text, which is acceptable because it is part of the product packaging rather than an external watermark.

## Local Verification

| Check | Result |
|---|---|
| Seed data validation script | Passed: 50 new goods, standards, JPG images, and no forbidden text. |
| Image filename count validation | Passed: one expected JPEG per new product ID from 11 to 60. |
| Backend regression test | Passed with `mvn -Dtest=FileServiceDownloadTest test`. |

Forbidden seed text scan covered:

```text
Premium Malt Beverage
Single Bottle
Gift Set of 3
beer
wine
liquor
alcohol
pork
gambling
casino
```

## GitHub Sync Result

| Item | Result |
|---|---|
| Commit | `b029003 Update product seed catalog and sync records` |
| Push | `origin/main` updated from `e5f7485` to `b029003` |
| GitHub auth note | Initial HTTPS push failed because git credential helper was not configured. `gh auth setup-git` was run, then `git push origin main` succeeded. |

## Google Cloud VM and Database Sync Result

Status: completed for GitHub pull, live database import, product image serving, and smoke checks.

| Step | Action | Result |
|---|---|---|
| 1 | Confirmed gcloud target. | Account `a206331@siswa.ukm.edu.my`, project `cobalt-bond-496703-n2`, zone `asia-southeast1-b`. |
| 2 | Confirmed VM state. | `fyp-mall-vm` was `RUNNING` at `34.143.225.11`. |
| 3 | Inspected VM repository. | VM was at `4abffa3`, behind `origin/main`; tracked local edits existed in `README.md` and `docs/cloud/phpmyadmin-admin-setup-2026-06-15.md`. |
| 4 | Preserved VM tracked edits. | Stashed the two tracked VM edits as `pre-product-catalog-sync`; untracked runtime `backups/` and `uploads/` directories were preserved. |
| 5 | Pulled GitHub changes. | VM repository fast-forwarded to `b029003`. |
| 6 | Backed up live database before import. | Backup written to `/var/backups/project-fyp-mall/electronic_mall_before_product_catalog_20260627_105455.sql`; file ended with `Dump completed on 2026-06-27 10:54:55`. |
| 7 | Imported updated seed SQL. | `database/electronic_mall.sql` imported into live `electronic_mall`. |
| 8 | Synced product image files. | `ElectronicMallApi/file/` copied to `/opt/project-fyp-mall/uploads/file/`; avatars preserved under `/opt/project-fyp-mall/uploads/avatar/`; upload ownership reset to `www-data:www-data`. |
| 9 | Checked live database counts. | `GOOD_COUNT=58`, `PREMIUM_COUNT=0`, `NEW_SEED_COUNT=50`, `NEW_SEED_STANDARD_COUNT=50`. |
| 10 | Attempted backend rebuild. | VM Maven was slow because it was downloading dependencies from the configured Aliyun repository. The long-running build was stopped; the existing backend service stayed active. |
| 11 | Verified VM runtime services. | `project-fyp-mall.service`, `nginx`, `mysql`, and `redis-server` were all active. |
| 12 | Ran VM-local smoke checks. | Local homepage returned HTTP `200`; local product API returned `"code":"200"` with new products; local image URL returned HTTP `200`. |
| 13 | Ran public smoke checks. | Public homepage `http://34.143.225.11/` returned HTTP `200`; public product API returned new products; public image URL `/api/file/seed_011_women_long_sleeve_top.jpg` returned HTTP `200`. |

Important build note:

- The live product update does not depend on the new backend fallback code because the product images were also synced into `/opt/project-fyp-mall/uploads/file/`, which is the configured production upload root.
- The VM repository contains the backend fallback code at `b029003`, but the running jar was not rebuilt during this sync because Maven dependency downloads did not complete in a reasonable time.
- If the fallback behavior itself must be active in the running jar, rerun `mvn -DskipTests package` on the VM after Maven dependency downloads stabilize, then restart `project-fyp-mall.service`.

## Notes

- The UI optimization task remains intentionally separate and must be handled on a new branch later.
- The live database import is destructive by design because `database/electronic_mall.sql` drops and recreates tables. A backup was created before import.
