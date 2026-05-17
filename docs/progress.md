# Progress Log

## Session: 2026-05-17

### Phase 1: System Localization and Interface Standardization
- **Status:** complete
- Actions taken:
  - Read `docs/FYP_PROJECT_OPTIMIZATION_PLAN.md`.
  - Audited frontend, backend, and database files for Chinese text and China/RMB currency markers.
  - Translated visible Vue UI text, route titles, admin menus, form labels, validation messages, dialogs, and order/payment labels to English.
  - Replaced RMB/yuan displays with `RM` prefixes.
  - Replaced the WeChat/Alipay payment UI with a simulated payment button.
  - Standardized order states as `Pending Payment`, `Paid`, `Shipped`, and `Received`.
  - Translated backend user-facing messages and aligned order status persistence.
  - Localized database seed data to English/Malaysia sample names, addresses, phone numbers, categories, products, variants, users, and orders.
  - Updated `README.md` with Phase 1 seed data notes and default demo accounts.
  - Started the Vue dev server at `http://localhost:9192/`.
- Files created/modified:
  - `ElectronicMallVue/src/`
  - `ElectronicMallApi/src/main/java/`
  - `ElectronicMallApi/src/main/resources/mapper/Income.xml`
  - `database/electronic_mall.sql`
  - `README.md`
  - `docs/task_plan.md`
  - `docs/findings.md`
  - `docs/progress.md`

## Test Results
| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| Baseline Chinese text audit | `rg -n "[\p{Han}]" ...` | Findings before localization | Found Chinese UI, backend messages, comments, and seed data | complete |
| Baseline currency audit | `rg -n "¥|￥|RMB|CNY|元|人民币"` | Findings before localization | Found RMB/yuan markers in Vue files and seed data context | complete |
| Front-end build | `npm run build` in `ElectronicMallVue` | Exit 0 | Exit 0; only Browserslist and asset-size warnings | complete |
| Back-end package | `mvn clean package` in `ElectronicMallApi` | Exit 0 | Exit 0; no tests configured | complete |
| Front-end visible Chinese audit | `rg -n "[\p{Han}]" ElectronicMallVue/src --glob '!ElectronicMallVue/src/resource/**' --glob '!ElectronicMallVue/src/views/front/good/index.html'` | No matches | No matches | complete |
| Currency/China payment audit | `rg -n "¥|￥|RMB|CNY|人民币|支付宝|微信|Pay宝|元" ElectronicMallVue/src ElectronicMallApi/src database README.md --glob '!ElectronicMallVue/src/resource/**'` | No matches | No matches | complete |
| Database Chinese audit | `rg -n "[\p{Han}]" database/electronic_mall.sql` | No matches | No matches | complete |

## Error Log
| Timestamp | Error | Attempt | Resolution |
|-----------|-------|---------|------------|
| 2026-05-18 00:03 MYT | `npm run dev` failed with `listen EPERM: operation not permitted 0.0.0.0:9192` in sandbox | 1 | Re-ran with approved escalation and server started. |
| 2026-05-17 | SQL `rg` pattern with backticks triggered shell command substitution | 1 | Switched to direct SQL reads and later static audits. |

## 5-Question Reboot Check
| Question | Answer |
|----------|--------|
| Where am I? | Phase 1 is complete and verified. |
| Where am I going? | Phase 2 core e-commerce function stabilization. |
| What's the goal? | English UI with Malaysia address, phone, and RM/MYR currency context. |
| What have I learned? | Order status values must be aligned across Vue, Java, MyBatis, and SQL seed data. |
| What have I done? | Localized front end, backend messages/statuses, database seed data, README, and verified builds. |

## Session: 2026-05-18

### Phase 2: Core E-Commerce Function Stabilization
- **Status:** in progress
- Actions taken:
  - Reproduced the reported home/product/login symptoms against the running Vue app.
  - Confirmed the first root cause was that the Spring Boot API on `http://localhost:9191` was not running while the Vue app on `http://localhost:9192` was running.
  - Started the Spring Boot backend and verified `/api/good`, `/api/carousel`, `/api/icon`, and `/login`.
  - Verified browser login with `user / 123456`.
  - Fixed storefront links to use canonical `/goodView`, `/goodList`, and `/orderList` paths.
  - Removed invalid nested anchors from product/category links.
  - Fixed login/register empty-field defaults and register form submission so failed retries do not hash the live form state.
  - Fixed simulated payment redirect to the actual order history route.
  - Normalized legacy Chinese order states from the database to the English states expected by the front end.
  - Fixed confirm-order unit price display to two decimals.
- Notes:
  - The local MySQL database still contains old Chinese test data. The project SQL file is localized, but re-importing it would overwrite local data and requires explicit approval.

## Phase 2 Verification Results
| Test | Result |
|------|--------|
| Frontend build | `npm run build` completed with exit 0; only existing Browserslist and asset-size warnings. |
| Backend package | `mvn clean package` completed with `BUILD SUCCESS`; no tests configured. |
| Product API | `GET /api/good` returned HTTP 200 and product data. |
| Carousel API | `GET /api/carousel` returned HTTP 200 and carousel data. |
| Login API | `POST /login` with `user / 123456` MD5 payload returned code `200`. |
| Browser home smoke test | Home page loaded at `http://localhost:9192/topview`; 12/12 images loaded and no `/undefined/file/...` image paths remained. |
| Browser login/order flow | Login worked, cart checkout reached simulated payment, payment redirected to `/orderList`, and old Chinese order states displayed as `Paid` / `Received`. |

## Database Reset Verification: 2026-05-18
- Re-imported `database/electronic_mall.sql` into the local `electronic_mall` database after explicit user approval.
- Verified database seed data:
  - Users: `Administrator`, `Demo User`.
  - Categories: `Clothing`, `Men Clothing`, `Stationery`, `Books`, `Food and Beverages`, `Daily Essentials`, and related English subcategories.
  - Products: `Study Desk and Chair Set`, `Men Casual Sneakers`, `Women Cotton T-Shirt`, `Premium Malt Beverage`, and related English products.
  - Addresses and phones use Malaysia-style values, including `+60` phone numbers and Malaysia addresses.
  - Orders use English states: `Paid`, `Received`.
- Verified browser golden path after import:
  - Login with `user / 123456`.
  - Home page displayed English categories/products and RM prices with 12/12 images loaded.
  - Product detail displayed English content and RM prices.
  - Add to cart, checkout, simulated payment, and order history worked.
  - Browser text checks for home, product detail, cart, checkout, payment, and order history found no visible Chinese characters.
- Screenshot saved: `docs/phase2_order_history_verified.png`.
