# Phase 1 and Phase 2 Final Acceptance Review

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

- `ElectronicMallVue/src/router/index.js` uses Vue Router `history` mode.
- Vue CLI's default `historyApiFallback.htmlAcceptHeaders` did not include `*/*`.
- Browser-style `Accept: text/html` requests worked, but generic GET checks returned `404`.

Fix:

- Updated `ElectronicMallVue/vue.config.js`.
- Added explicit `devServer.historyApiFallback` with:

```text
disableDotRule: true
htmlAcceptHeaders: ['text/html', 'application/xhtml+xml', '*/*']
```

Regression coverage:

- Added `ElectronicMallVue/scripts/check-history-routes.js`.
- Added npm script `npm run check:routes`.
- The check validates 12 main routes return the SPA entry HTML.

## Verification Commands

### Front-End Build

```bash
cd ElectronicMallVue
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
cd ElectronicMallApi
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
cd ElectronicMallVue
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
rg -n "[\p{Han}]" ElectronicMallVue/src --glob '!ElectronicMallVue/src/resource/**' --glob '!ElectronicMallVue/src/views/front/good/index.html'
```

Result:

```text
No matches
```

```bash
rg -n "¥|￥|RMB|CNY|人民币|支付宝|微信|Pay宝|元" ElectronicMallVue/src ElectronicMallApi/src database README.md --glob '!ElectronicMallVue/src/resource/**'
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
rg -n "China|Chinese|Beijing|Shanghai|Guangzhou|¥|RMB|CNY|Alipay|WeChat|Weixin|支付宝|微信" database/electronic_mall.sql ElectronicMallVue/src ElectronicMallApi/src --glob '!ElectronicMallVue/src/resource/**'
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
ElectronicMallVue/package.json
ElectronicMallVue/vue.config.js
ElectronicMallVue/scripts/check-history-routes.js
tools/phase12-api-golden-path.js
docs/PHASE_1_2_FINAL_ACCEPTANCE_REVIEW.md
docs/README.md
docs/task_plan.md
docs/findings.md
docs/progress.md
docs/PHASE_1_2_LOCALIZATION_STABILIZATION_REPORT.md
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

