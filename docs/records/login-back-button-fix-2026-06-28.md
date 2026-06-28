# Login Back Button Fix - 2026-06-28

## Purpose

Add a missing return path on the login page. Before this change, the login page only offered login, registration, and password reset actions, so users who arrived at `/login` had no explicit way to return to the previous storefront page.

## Changes

`ElectronicMallVue/src/views/Login.vue` now includes a visible `Back` button at the top of the login card:

- The button uses the existing `icon-r-left` icon style.
- It calls `goBack()`.
- `goBack()` uses `this.$router.go(-1)` when browser history exists.
- If the page is opened directly and no useful history is available, it falls back to `this.$router.push("/")`.

`ElectronicMallVue/scripts/check-auth-flows.js` now includes regression checks for:

- The visible login page back button.
- The `goBack` click binding.
- The `goBack()` handler implementation.

## Verification

Automated checks:

```text
npm run check:auth
Auth flow checks passed.

npm run check:ui
UI enhancement checks passed (28 checks).

npm run build
DONE Build complete. The dist directory is ready to be deployed.

FRONTEND_PORT=9192 npm run check:routes
History route fallback check passed for 12 routes.
```

Browser verification:

- `/login` rendered exactly one `Back` button.
- The button was inside the login card.
- Navigating from `/topview` to `/login` and clicking `Back` returned to `/topview`.

## Result

The login page now has a clear return action without changing the existing login, registration, password reset, or route guard behavior.
