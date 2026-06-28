# Homepage Hero Warm Lifestyle Optimization - 2026-06-28

## Purpose

Apply the latest Rufeng Mall UI/UX optimization plan and replace the homepage hero image with the supplied warm lifestyle image. The intent was to make the homepage feel more professional, warm, human-centered, student-friendly, and suitable for FYP presentation screenshots.

## Scope

- Created branch `codex/homepage-hero-warm-lifestyle`.
- Replaced the homepage hero visual with the supplied `hero.png`.
- Updated homepage, navigation, global style tokens, UI verification checks, and documentation.
- Did not modify backend APIs, database schema, order logic, cart logic, authentication logic, or admin CRUD behavior.

## Implementation Summary

- Added `ElectronicMallVue/src/resource/homepage-hero.png` from the user-provided image.
- Updated global UI tokens to the new warm system:
  - Primary: `#6D4AFF`
  - Primary dark: `#4F35C9`
  - Primary light: `#EFEAFF`
  - Main background: `#FAF8F4`
  - Soft background: `#F3EFE8`
  - Border: `#E8E2D8`
  - Warm accent: `#D89C64`
- Reworked the homepage hero section:
  - Uses the supplied warm desk lifestyle image.
  - Uses the approved title: `Everyday essentials, thoughtfully selected.`
  - Uses the approved subtitle about study, work, and daily living.
  - Adds small trust points: simple browsing, secure orders, daily essentials.
  - Adjusts hero height, ratio, radius, and warm cream background to reduce emptiness while keeping a premium lifestyle feel.
- Improved product card clarity:
  - Standardized image area height.
  - Kept product name, category, short description, rating, reviews, and price.
  - Added explicit `Add` and `View details` actions.
  - Kept action behavior within existing frontend navigation to avoid business logic changes.
- Improved category scanability:
  - Added consistent category icons derived from category names.
  - Changed category rows into softer card-like items with hover feedback.
- Improved navigation login status:
  - Shows `Not logged in` and `Login / Register` when anonymous.
  - Shows `Customer` or `Administrator` for logged-in roles.
  - Adds `Admin Dashboard` to the user dropdown for administrators.
- Extended `npm run check:ui` from 21 to 28 checks so regressions are caught for:
  - Warm design tokens.
  - Supplied hero image usage.
  - Approved hero title.
  - Hero trust points.
  - Product card details and add-to-cart actions.

## Findings

- The supplied image matches the plan well: warm desk scene, natural light, books, laptop, notebook, coffee cup, plant, and phone.
- The current backend-driven carousel would override the local hero image if left in place. To satisfy the instruction that this image should replace the homepage hero, the homepage now always uses the local `homepage-hero.png` for the hero visual.
- Some broader plan items mention cart, order, login, and admin optimization. Those areas already received baseline UI work in earlier iterations, so this pass focused on the newly supplied hero image and the homepage-specific acceptance items to avoid expanding the change into backend or workflow behavior.
- Product card `Add` action currently routes to product details rather than directly mutating the cart. This preserves existing behavior and avoids changing cart/order business logic in a UI-only pass.

## Verification

Run:

- `npm run check:ui`
- `npm run check:auth`
- `npm run check:deployment`
- `FRONTEND_PORT=8081 npm run check:routes`
- `npm run build`

Browser verification:

- Desktop `1440 x 900`
- Tablet `1024 x 768`
- Mobile `390 x 844`

Result:

- `npm run check:ui` passed with 28 checks.
- Auth, deployment, and history route fallback checks passed.
- Production build completed successfully.
- Build still reports existing Browserslist warning and asset/entrypoint size warnings.
- New warning source: the supplied `homepage-hero.png` is emitted as a 2.09 MiB asset. This preserves the provided image but should be optimized in a future performance pass if deployment speed becomes part of evaluation.
- Browser plugin navigation to the dev server timed out when loading the large image. To avoid stale hot-reload state, final browser verification used the freshly built `dist` output served locally on port `8095`.
- Built app desktop `1440 x 900` check:
  - No horizontal overflow.
  - Body background rendered as `rgb(250, 248, 244)`.
  - Hero container rendered at `1392 x 600`.
  - Supplied hero image loaded with natural size `1536 x 1024`.
  - Hero title and three trust points rendered.
  - Four product cards, four details buttons, four add buttons, and five category icons rendered.
  - Product card height spread was `0`; product image height spread was `0`.
- Built app tablet `1024 x 768` check:
  - No horizontal overflow.
  - Hero container rendered at `976 x 520`.
  - Product card and product image heights remained consistent.
- Built app mobile `390 x 844` check:
  - No horizontal overflow.
  - Scroll width equaled viewport width.
  - Hero stacked vertically and remained within the mobile page width.
  - Product card and product image heights remained consistent.

## Files Changed

- `ElectronicMallVue/src/resource/homepage-hero.png`
- `ElectronicMallVue/src/resource/global.css`
- `ElectronicMallVue/src/components/Navagation.vue`
- `ElectronicMallVue/src/views/front/TopView.vue`
- `ElectronicMallVue/scripts/check-ui-enhancement.js`
- `docs/records/homepage-hero-warm-lifestyle-optimization-2026-06-28.md`
