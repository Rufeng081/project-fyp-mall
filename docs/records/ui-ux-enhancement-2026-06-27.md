# UI/UX Enhancement Record - 2026-06-27

## Purpose

Upgrade R Mall from a functional student-project interface to a warmer, cleaner, and more professional FYP demonstration storefront. The work followed the provided UI enhancement plan and the approved reference homepage style.

## Branch

- Working branch: `codex/ui-ux-enhancement`
- Scope rule: frontend presentation only
- Backend APIs, database schema, authentication flow, email verification flow, shopping workflow, deployment configuration, and JMeter assets were not intentionally changed.

## Implementation Summary

- Added global design tokens in `ElectronicMallVue/src/resource/global.css` for deep purple, soft green, warm background, text, borders, radius, shadows, buttons, inputs, cards, responsive sizing, and reduced-motion behavior.
- Reworked the storefront navigation into a sticky, branded `R Mall / FYP-UKM Demo` header with responsive menu, search, cart, notification, and user dropdown areas.
- Redesigned the homepage with a large rounded hero banner, welcome message, feature highlights, category panel, recommended product grid, and service guarantee section.
- Restyled product list, product detail, cart, checkout, payment, order history, login, register, password reset dialog, user profile, and admin dashboard shell.
- Added `ElectronicMallVue/scripts/check-ui-enhancement.js` and `npm run check:ui` to enforce key UI structure acceptance points.
- Adjusted `ElectronicMallVue/src/main.js` import order so the project design system overrides Element UI defaults.

## Verification Performed

- `npm run check:ui` passed: 14 UI structure checks.
- `npm run check:auth` passed.
- `npm run check:deployment` passed.
- `FRONTEND_PORT=8081 npm run check:routes` passed for 12 history routes against the local Vue dev server.
- `npm run build` passed.
- Browser verification on `http://127.0.0.1:8081/topview` confirmed:
  - `.hero-banner` present.
  - `.service-item` count is 4.
  - 390px viewport has no horizontal overflow.
  - Primary hero button uses the deep-purple gradient.

## Findings and Limits

- The local backend API was not running during browser verification, so storefront product/category API calls produced Axios network errors and dynamic product cards could not be visually populated from live data in this local browser check.
- Production build still reports pre-existing Vue CLI warnings:
  - Browserslist `caniuse-lite` data is outdated.
  - Large existing assets/bundles exceed the default recommended size threshold, including `01.jpg`, `back.jpg`, vendor chunks, and a large route chunk.
- Existing user worktree changes to `D5_REWRITE_CONTEXT_20260627.md` were left untouched.

## Acceptance Notes

- The UI color, spacing, card, button, input, and navigation treatment is now consistent across the main user-facing pages.
- The homepage now closely follows the supplied reference layout and visual hierarchy while reusing existing API data and routes.
- No backend files, database migrations, or API contracts were changed for this enhancement.
