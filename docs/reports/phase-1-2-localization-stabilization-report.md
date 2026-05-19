# Phase 1 and Phase 2 Localization/Stabilization Report

## Purpose

The project was updated according to the current [implementation roadmap](../project/implementation-roadmap.md) to support a UKM FYP demonstration as a small cloud-ready e-commerce platform.

The work focused on two goals:

1. Localize the system into an English-based Malaysia-context mall.
2. Stabilize the core e-commerce flow before later cloud deployment and performance testing work.

## Scope Completed

### Phase 1: System Localization and Interface Standardization

- Translated visible storefront and admin UI text into English.
- Standardized customer-facing currency display to `RM`.
- Replaced China-specific payment labels with a simulated payment flow.
- Localized seed data to English names, Malaysia addresses, Malaysia phone numbers, English product/category names, and English order statuses.
- Standardized order statuses as:
  - `Pending Payment`
  - `Paid`
  - `Shipped`
  - `Received`

### Phase 2: Core E-Commerce Function Stabilization

- Fixed home carousel and product image loading issues.
- Verified the backend API runs on `http://localhost:9191`.
- Verified the frontend runs on `http://localhost:9192`.
- Fixed storefront route consistency for product list, product detail, and order history pages.
- Fixed login/register form defaults and registration submission behavior.
- Fixed simulated payment redirect to the order history page.
- Added compatibility for legacy Chinese order states so existing records display with English status labels.
- Fixed confirm-order price display formatting.

## Database Reset

After explicit approval, the local `electronic_mall` database was reset by importing:

```bash
database/electronic_mall.sql
```

The imported seed data was verified with MySQL queries and API checks.

Verified seed examples:

- Users: `Administrator`, `Demo User`
- Categories: `Clothing`, `Men Clothing`, `Stationery`, `Books`, `Food and Beverages`, `Daily Essentials`
- Products: `Study Desk and Chair Set`, `Men Casual Sneakers`, `Women Cotton T-Shirt`, `Premium Malt Beverage`
- Phone format: `+60 ...`
- Address context: Malaysia addresses such as Bangi, Selangor, Kajang, Johor, and Kuala Lumpur
- Order states: `Paid`, `Received`

## Functional Verification

The following user flow was tested successfully in the browser:

```text
Login -> Browse Products -> View Product Details -> Add to Cart -> Place Order -> Complete Simulated Payment -> View Order History
```

Default verified account:

```text
Username: user
Password: 123456
```

Observed browser results:

- Home page showed English categories and English product names.
- Product and carousel images loaded successfully.
- Prices displayed with `RM`.
- Product detail page displayed English description and variant text.
- Cart displayed English product/variant data.
- Checkout displayed Malaysia delivery addresses and `+60` phone numbers.
- Payment page used simulated payment text.
- Order history displayed English order statuses.
- Browser page-text checks across the tested flow found no visible Chinese characters.

Verification screenshot:

```text
docs/assets/phase-2-order-history-verified.png
```

## Build and API Verification

Commands used during verification:

```bash
cd <frontend-module>
npm run build
```

```bash
cd <backend-module>
mvn clean package
```

API checks:

- `GET /api/good`
- `GET /api/icon`
- `GET /api/carousel`
- `POST /login`
- `GET /api/order/userid/{userId}`

## Final Acceptance Update: 2026-05-18

Final acceptance found one remaining Phase 2 gap: generic direct GET requests to Vue Router history-mode deep links returned `404` from the Vue development server.

Resolution:

- Added explicit `devServer.historyApiFallback` configuration in `<frontend-module>/vue.config.js`.
- Added repeatable route regression check: `<frontend-module>/scripts/check-history-routes.js`.
- Added repeatable API golden-path check: `tools/phase12-api-golden-path.js`.

Final verification:

- `npm run check:routes` passed for 12 main front-end routes.
- `npm run build` completed with exit 0.
- `mvn clean package` completed with `BUILD SUCCESS`.
- Static localization audits returned no visible business Chinese or China/RMB markers.
- `node tools/phase12-api-golden-path.js` passed and verified registration, login, product data, image endpoint, address, cart, order creation, simulated payment, and order history.

Final accepted state:

```text
Phase 1: complete
Phase 2: complete
Ready for Phase 3: registration email verification code
```

## Remaining Notes

- Backend Java comments still include some Chinese developer comments. They are not visible in the application UI and do not affect the FYP demonstration.
- `Order.xml` intentionally retains old Chinese order-state strings only as compatibility mapping for legacy data.
- Some generated/static resource metadata may contain original non-business filenames or asset labels, but visible storefront/admin UI has been localized.

## Appendix A: Final Acceptance Review Detail

### Source Detail: Phase 1 and Phase 2 Final Acceptance Review

## Review Date

2026-05-18, Malaysia time.

## Purpose

This document records the final acceptance process for Phase 1 and Phase 2 before starting Phase 3 email verification.

The review checked whether:

1. Phase 1 localization and Malaysia-context requirements are implemented.
2. Phase 2 core e-commerce functions are implemented and operational.
3. Known issues from the previous acceptance check are fixed.
4. The verification process can be repeated by later reviewers.

## Scope

### Phase 1: System Localization and Interface Standardization

Acceptance targets:

- Visible storefront and admin UI text is English.
- Currency display uses `RM` / Malaysia context.
- China-specific payment labels are removed from the active flow.
- Seed data uses English names, English products/categories, Malaysia addresses, Malaysia-style phone numbers, and English order statuses.
- Order states are standardized as `Pending Payment`, `Paid`, `Shipped`, and `Received`.

### Phase 2: Core E-Commerce Function Stabilization

Acceptance targets:

- Main front-end routes can be opened directly.
- Backend public APIs return expected data.
- Registration and login work.
- Product browsing and product detail work.
- Product images and carousel images load through the backend file API.
- Cart creation works.
- Order creation works.
- Simulated payment changes the order status to `Paid`.
- Order history returns the paid order.

## Issue Found During Final Review

### Front-End History Route Fallback

During direct-route verification, the Vue development server returned `404` for deep links when the request used a generic HTTP accept header.

Failing examples before the fix:

```text
GET http://localhost:9192/topview
GET http://localhost:9192/login
GET http://localhost:9192/register
GET http://localhost:9192/goodView/3
```

Root cause:

- `<frontend-module>/src/router/index.js` uses Vue Router `history` mode.
- Vue CLI's default `historyApiFallback.htmlAcceptHeaders` did not include `*/*`.
- Browser-style `Accept: text/html` requests worked, but generic GET checks returned `404`.

Fix:

- Updated `<frontend-module>/vue.config.js`.
- Added explicit `devServer.historyApiFallback` with:

```text
disableDotRule: true
htmlAcceptHeaders: ['text/html', 'application/xhtml+xml', '*/*']
```

Regression coverage:

- Added `<frontend-module>/scripts/check-history-routes.js`.
- Added npm script `npm run check:routes`.
- The check validates 12 main routes return the SPA entry HTML.

## Verification Commands

### Front-End Build

```bash
cd <frontend-module>
npm run build
```

Result:

```text
Exit 0
Build complete
Warnings only: outdated Browserslist data and large bundle/assets
```

### Back-End Build

```bash
cd <backend-module>
mvn clean package
```

Result:

```text
Exit 0
BUILD SUCCESS
No tests configured
```

### Front-End Route Regression

Requires the Vue dev server on `http://localhost:9192`.

```bash
cd <frontend-module>
npm run check:routes
```

Result:

```text
History route fallback check passed for 12 routes.
```

Routes checked:

```text
/
/topview
/login
/register
/goodList
/goodView/3
/cart
/preOrder
/pay
/orderList
/person
/manage/home
```

### Phase 1 Static Localization Audits

```bash
rg -n "[\p{Han}]" <frontend-module>/src --glob '!<frontend-module>/src/resource/**' --glob '!<frontend-module>/src/views/front/good/index.html'
```

Result:

```text
No matches
```

```bash
rg -n "¥|￥|RMB|CNY|人民币|支付宝|微信|Pay宝|元" <frontend-module>/src <backend-module>/src database README.md --glob '!<frontend-module>/src/resource/**'
```

Result:

```text
No matches
```

```bash
rg -n "[\p{Han}]" database/electronic_mall.sql
```

Result:

```text
No matches
```

```bash
rg -n "China|Chinese|Beijing|Shanghai|Guangzhou|¥|RMB|CNY|Alipay|WeChat|Weixin|支付宝|微信" database/electronic_mall.sql <frontend-module>/src <backend-module>/src --glob '!<frontend-module>/src/resource/**'
```

Result:

```text
No matches
```

### Phase 2 API Golden Path

Requires the Spring Boot API on `http://localhost:9191`.

```bash
node tools/phase12-api-golden-path.js
```

Result:

```json
{
  "productCount": 8,
  "categoryGroups": 7,
  "carouselItems": 3,
  "registeredUser": "phase12check_1779075614723",
  "demoUser": "user",
  "cartItemId": 7,
  "orderNo": "20260518114014173400",
  "orderState": "Paid",
  "deliveryPhone": "+60 11-1234 5678"
}
```

The script verifies:

- Product list
- Product detail
- Product variants
- Category data
- Carousel data
- Product image file endpoint
- User registration
- User login
- Authenticated user ID lookup
- Malaysia delivery address
- Cart item creation
- Order creation
- Simulated payment
- Order history
- No visible Chinese characters in the checked business API payload

## Files Changed For Final Acceptance

```text
<frontend-module>/package.json
<frontend-module>/vue.config.js
<frontend-module>/scripts/check-history-routes.js
tools/phase12-api-golden-path.js
docs/reports/phase-1-2-localization-stabilization-report.md
docs/README.md
docs/records/project-work-log.md
docs/records/project-work-log.md
docs/records/project-work-log.md
docs/reports/phase-1-2-localization-stabilization-report.md
```

## Local Data Created During Verification

The final API golden-path check intentionally created local verification data:

```text
Registered user: phase12check_1779075614723
Paid order: 20260518114014173400
```

This data is only in the local MySQL database used for verification. It is not written to `database/electronic_mall.sql`.

## Final Acceptance Decision

Phase 1 and Phase 2 are accepted as complete.

The project is ready to enter Phase 3: registration email verification code.
