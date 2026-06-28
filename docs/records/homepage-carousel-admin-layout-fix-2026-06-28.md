# Homepage Recommendation and Admin Layout Fix - 2026-06-28

## Purpose

Address two UI/UX follow-up issues after the homepage redesign:

- The homepage featured product section should be driven by the original carousel/admin configuration, so future changes can be made from the admin carousel management page.
- The admin dashboard should not keep the new translucent card/mask treatment that visually misaligned the sidebar and main content. It should return to the stable earlier admin layout.

## Changes

### Homepage Featured Products

`ElectronicMallVue/src/views/front/TopView.vue` now derives homepage featured products from `/api/carousel`:

- Carousel records are read in `show_order` order from the existing backend endpoint.
- `goodId` values from carousel records are mapped back to the full `/api/good` product records.
- Duplicate carousel product IDs are ignored.
- If carousel/admin configuration provides fewer than four valid products, the list is filled from the existing product list.
- The displayed homepage featured products are always capped with `.slice(0, 4)`.

This keeps the section editable through the existing admin carousel management flow while preserving the four-product homepage limit.

### Admin Recommendation Management Copy

`ElectronicMallVue/src/views/manage/good/Carousel.vue` keeps the existing data model and API, but its page copy is clearer:

- Page heading changed to `Homepage Recommendation Management`.
- Order label changed from `Carousel Order` to `Recommendation Order`.
- Dialog title changed to `Homepage Recommendation`.
- Add button changed to `Add Product`.

No backend table, endpoint, or admin permission logic was changed.

### Admin Layout Restoration

`ElectronicMallVue/src/views/manage/Manage.vue` and `ElectronicMallVue/src/views/manage/Home.vue` were restored toward the earlier stable admin layout:

- Removed the oversized translucent gradient mask from the admin home background.
- Restored the simple background image behavior for `/manage/home`.
- Restored the simple legacy welcome title layout.
- Kept the shell class names needed by existing UI verification scripts.

Root cause: the previous admin home redesign introduced a large centered card and translucent background treatment that made the admin page appear as if a mask layer was offset against the sidebar. The sidebar component itself was not the primary source of the issue.

## Verification

Local static checks:

```text
npm run check:homepage-admin
Homepage carousel and admin regression checks passed.

npm run check:ui
UI enhancement checks passed (28 checks).

npm run check:auth
Auth flow checks passed.

npm run check:deployment
Deployment config checks passed.
```

Production build:

```text
npm run build
DONE Build complete. The dist directory is ready to be deployed.
```

The build still reports the existing non-blocking warnings:

- Browserslist / `caniuse-lite` is outdated.
- Some image and JavaScript assets exceed Vue CLI recommended size thresholds.
- `homepage-hero.2c99bd90.png` is approximately 2.09 MiB.

Route check:

```text
FRONTEND_PORT=9192 npm run check:routes
History route fallback check passed for 12 routes.
```

Live VM data check before deployment showed current carousel/admin recommendation records:

```text
/api/api/carousel 200 200
- goodId 5: Women Cotton T-Shirt
- goodId 11: Women Long Sleeve Top
- goodId 7: Men Casual Sneakers
```

Browser verification against the local frontend with the live VM API confirmed:

- Homepage featured section rendered exactly four product cards.
- First three products matched the current carousel/admin configuration:
  - Women Cotton T-Shirt
  - Women Long Sleeve Top
  - Men Casual Sneakers
- The fourth card was a fallback product because the live carousel currently has three configured items.
- Admin home sidebar, header, and main content boundaries aligned.
- Admin home no longer showed the new Product Control / Order Review / Revenue View card content.
- Recommendation management page showed the new `Homepage Recommendation Management` and `Recommendation Order` labels.
- Recommendation management table stayed inside the main content area.

## Result

The homepage recommendation section is now controlled by the existing carousel/admin configuration while still limiting the storefront display to four products. The admin dashboard layout has been restored to a stable non-overlapping presentation, and the carousel management page copy now matches its recommendation role more clearly.
