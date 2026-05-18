# Findings & Decisions

## Requirements
- Phase 1 objective: English-based and Malaysia-context e-commerce platform.
- Translate visible UI text, route titles, messages, dialog labels, product/category names, order status text, user role names, and admin panel text.
- Standardize currency display to `RM` / `MYR`.
- Use Malaysia-style address and phone examples.
- Update seed/default data to English names, Malaysia addresses, Malaysia phone numbers, MYR prices, and English categories.

## Research Findings
- Frontend: Vue 2 with Element UI. Visible text is mostly hard-coded in `.vue` files and route metadata.
- Backend: Spring Boot returns user-facing messages from services/controllers and stores order state strings in the database.
- Database: `database/electronic_mall.sql` contained Chinese sample names, China addresses, China phone numbers, Chinese categories, product descriptions, standards, user nicknames, and order statuses.
- Existing planning files are intentionally stored in `docs/` via `.planning/.active_plan`.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Preserve existing database schema | Phase 1 is localization, not schema redesign. |
| Encode Malaysia-style address as a single formatted string where schema only has `link_address` / `address` | Avoids risky schema changes before Phase 2 stabilization. |
| Use `Pending Payment`, `Paid`, `Shipped`, and `Received` consistently across Vue, Java, MyBatis, and seed SQL | Prevents status-filter mismatch after localization. |
| Use `RM` prefix in UI labels and price displays | Matches Phase 1 requirement and Malaysia currency convention. |
| Replace WeChat/Alipay UI with a simulated payment button | Aligns Phase 1 localization and keeps payment suitable for FYP scope. |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Vue dev server cannot bind to `0.0.0.0:9192` inside the default sandbox | Started it with approved escalation. |
| `npm run build` reports Browserslist and bundle-size warnings | Build still exits 0; warnings are dependency/asset-size concerns, not localization failures. |
| Vue Router history-mode deep links returned 404 for generic GET checks | Added explicit `devServer.historyApiFallback.htmlAcceptHeaders` including `*/*`, then added `npm run check:routes` to prevent regression. |

## Final Phase 1/2 Acceptance Findings: 2026-05-18
- The remaining Phase 2 gap was not a Vue route table problem. It was a dev-server fallback configuration issue for history-mode deep links.
- Browser-style `Accept: text/html` requests already worked, but generic GET checks failed before the fix.
- `ElectronicMallVue/scripts/check-history-routes.js` now covers direct access to 12 main routes.
- `tools/phase12-api-golden-path.js` now provides a repeatable API-level golden path covering registration, login, products, image endpoint, cart, order creation, simulated payment, and order history.
- Final API verification created local test user `phase12check_1779075614723` and paid order `20260518114014173400`.

## Resources
- `docs/FYP_PROJECT_OPTIMIZATION_PLAN.md`
- `ElectronicMallVue/src/`
- `ElectronicMallApi/src/main/java/`
- `ElectronicMallApi/src/main/resources/mapper/Income.xml`
- `database/electronic_mall.sql`
- `README.md`
- `docs/PHASE_1_2_FINAL_ACCEPTANCE_REVIEW.md`
