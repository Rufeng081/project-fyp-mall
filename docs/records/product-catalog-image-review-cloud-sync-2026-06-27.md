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

## Pending Cloud Sync

The intended sync sequence is:

1. Commit the reviewed local changes, including already-approved existing `README.md`, `docs/cloud/...`, and `report/` changes.
2. Push local `main` to GitHub.
3. Pull the pushed commit on the Google Cloud VM.
4. Copy or preserve the 50 seed product images under the backend file-serving path.
5. Back up the live `electronic_mall` database before applying the updated seed.
6. Import the updated `database/electronic_mall.sql` into the live database only after backup.
7. Rebuild/restart the backend, rebuild/sync the frontend if required, reload Nginx if required.
8. Run public smoke checks for the homepage, product API, and at least one seeded product image URL.

## Notes

- The UI optimization task remains intentionally separate and must be handled on a new branch later.
- The live database import is destructive by design because `database/electronic_mall.sql` drops and recreates tables. A backup is required before import.
