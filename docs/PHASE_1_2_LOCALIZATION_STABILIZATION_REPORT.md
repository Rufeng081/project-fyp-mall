# Phase 1 and Phase 2 Localization/Stabilization Report

## Purpose

The project was updated according to `docs/FYP_PROJECT_OPTIMIZATION_PLAN.md` to support a UKM FYP demonstration as a small cloud-ready e-commerce platform.

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
docs/phase2_order_history_verified.png
```

## Build and API Verification

Commands used during verification:

```bash
cd ElectronicMallVue
npm run build
```

```bash
cd ElectronicMallApi
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

- Added explicit `devServer.historyApiFallback` configuration in `ElectronicMallVue/vue.config.js`.
- Added repeatable route regression check: `ElectronicMallVue/scripts/check-history-routes.js`.
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
