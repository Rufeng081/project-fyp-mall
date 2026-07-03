# UI/UX Design Handoff

This document summarizes the current interface, content, components, user flows, and design constraints of the FYP mall project. It is intended for UI/UX redesign planning before any visual or interaction refactor is implemented.

## 1. Project Context

The project is a small e-commerce platform adapted for a UKM FYP demonstration. It is currently localized to an English and Malaysia-context storefront.

Core positioning:

- Product type: R Mall / campus-friendly e-commerce demo.
- Currency: `RM` / MYR.
- Locale context: Malaysia addresses, `+60` phone numbers, English UI.
- Payment scope: simulated payment only; no real payment gateway.
- Main proof points: product browsing, cart, checkout, order lifecycle, admin management, and revenue/performance testing readiness.

Primary user roles:

| Role | Interface Access | Notes |
|---|---|---|
| Guest | Home, product list, product detail, login, register | Can browse products and search, but must log in for cart/order actions. |
| User | Storefront, profile, cart, checkout, payment, order history | Normal customer role. |
| Administrator | Storefront plus `/manage` admin console | Can manage users, files, avatars, products, categories, carousel, orders, and revenue views. |

## 2. Frontend Technology and UI Dependencies

Frontend path: `<frontend-module>/`

| Area | Current Implementation |
|---|---|
| Framework | Vue 2.6 |
| Router | Vue Router 3, history mode |
| State | Vuex 3; currently mainly stores `baseApi` |
| UI library | Element UI 2.15 |
| Charts | ECharts 5 |
| HTTP | Axios wrapper in `src/utils/request.js` |
| Icons | Two local iconfont sets plus Element UI icons |
| Dev server | `http://localhost:9192` |
| API/media server | `http://localhost:9191` |

Important UI constraint: most layout and visual styling is embedded directly in Vue templates through inline styles. A redesign should expect component markup cleanup, style extraction, and responsive layout work.

## 3. Information Architecture

### Storefront Routes

| Route | View | Purpose |
|---|---|---|
| `/` | `views/front/Front.vue` | Storefront shell; redirects to `/topview`. |
| `/topview` | `views/front/TopView.vue` | Home page with search, category menu, carousel, and recommended products. |
| `/goodList` | `views/front/good/GoodList.vue` | Product listing with search/category filtering and pagination. |
| `/goodView/:goodId` | `views/front/good/GoodView.vue` | Product detail page. |
| `/cart` | `views/front/good/Cart.vue` | Customer cart; login required. |
| `/preOrder` | `views/front/order/PreOrder.vue` | Confirm order and delivery address; login required. |
| `/pay` | `views/front/order/Pay.vue` | Simulated payment; login required. |
| `/orderList` | `views/front/order/OrderList.vue` | Customer order history; login required. |
| `/person` | `views/Person.vue` | Customer profile edit; login required. |

### Authentication Routes

| Route | View | Purpose |
|---|---|---|
| `/login` | `views/Login.vue` | Login form. |
| `/register` | `views/Register.vue` | Registration form. |
| `/*` | `views/404NotFound.vue` | Basic fallback page. |

### Admin Routes

| Route | View | Purpose |
|---|---|---|
| `/manage` | `views/manage/Manage.vue` | Admin shell with sidebar and top header. |
| `/manage/home` | `views/manage/Home.vue` | Dashboard welcome page. |
| `/manage/user` | `views/manage/User.vue` | User management. |
| `/manage/person` | `views/Person.vue` | Admin profile edit. |
| `/manage/file` | `views/manage/file/File.vue` | File management. |
| `/manage/avatar` | `views/manage/file/Avatar.vue` | Avatar file management. |
| `/manage/category` | `views/manage/good/Category.vue` | Product category and icon group management. |
| `/manage/carousel` | `views/manage/good/Carousel.vue` | Home carousel management. |
| `/manage/good` | `views/manage/good/Goods.vue` | Product management list. |
| `/manage/goodInfo` | `views/manage/good/GoodInfo.vue` | Add/edit product detail form. |
| `/manage/order` | `views/manage/Order.vue` | Order management. |
| `/manage/incomeChart` | `views/manage/income/IncomeChart.vue` | Revenue charts. |
| `/manage/incomeRank` | `views/manage/income/IncomeRank.vue` | Product revenue ranking. |

## 4. Core User Flows

### Guest Browsing Flow

```text
Open home -> Search or select category -> Product list -> Product detail -> Login if cart/order action is attempted
```

UI considerations:

- Search should be prominent and reusable across home/list pages.
- Category navigation currently appears as icon groups and slash-separated category links.
- Product cards need clear image, name, price, and click target treatment.
- Guest-to-login transition should preserve intent where possible.

### Customer Purchase Flow

```text
Login -> Browse product -> Select variant and quantity -> Buy Now or Add to Cart -> Confirm delivery address -> Place Order -> Simulated Payment -> Order History
```

UI considerations:

- Variant selection is required for product actions.
- Stock and quantity limits are data-driven.
- Checkout supports address add/edit/delete in the order confirmation page.
- Payment is intentionally simulated and should be labelled clearly.
- Order states should be visible and understandable.

### Admin Management Flow

```text
Login as admin -> Admin console -> Sidebar module -> Search/filter -> Table operation -> Dialog/form confirmation -> Success/error feedback
```

UI considerations:

- Admin pages are table-heavy and need consistent toolbar, filter, pagination, bulk action, and dialog patterns.
- Product management spans both list and detailed edit form.
- Revenue views need chart-friendly layout and responsive chart sizing.

## 5. Reusable Component Inventory

| Component | File | Current Role | UI Elements |
|---|---|---|---|
| Storefront navigation | `src/components/Navagation.vue` | Top nav for customer-facing pages | Brand, Home, Category, My Cart, My Orders, Admin link for admin role, avatar/nickname dropdown, Login/Profile/Logout actions. |
| Admin sidebar | `src/components/Aside.vue` | Left navigation for admin console | Logo, Dashboard, Storefront, System/User, File, Product, Revenue groups; menu visibility is role-gated. |
| Admin header | `src/components/Header.vue` | Top admin bar | Sidebar collapse/expand control, back button, breadcrumb, avatar/nickname dropdown, Profile/Logout. |
| Search bar | `src/components/Search.vue` | Product search input | Text input, custom image button, Enter key support. |
| Cart item | `src/components/CartItem.vue` | One cart row/card | Order time, product image/link, product, variant, price, quantity editor, total, Pay, Remove. |
| Order item | `src/components/OrderItem.vue` | One customer order row/card | Order time, order number, product image/link, variant, quantity, total, recipient hover details, state actions. |
| Address box | `src/components/AddressBox.vue` | Delivery address card | Recipient, phone, address, Update/Delete actions, selected state from parent. |
| Income item | `src/components/IncomeItem.vue` | Revenue ranking item | Rank, product image/link, product ID/name, revenue. |
| Message item | `src/components/MessageItem.vue` | Message/comment display component | Avatar, nickname, message, time, delete action if owner. Not currently part of main route map. |

Design note: these components are mostly presentation-plus-API components, with duplicated table/card patterns and heavy inline styling. A redesign should define canonical card, table row, toolbar, modal, avatar, and status components.

## 6. Screen Inventory and UI Content

### Storefront Shell

File: `src/views/front/Front.vue`

Current layout:

- Element UI container.
- White 60px header with `Navagation`.
- Light grey main background.
- Nested route outlet.

Design considerations:

- Decide whether storefront should remain app-like or become a more polished e-commerce layout.
- Header currently has fixed column proportions and may not adapt well to mobile.
- Main background and page card styling should be standardized.

### Home Page

File: `src/views/front/TopView.vue`

Current content:

- Search bar.
- Category icon menu, limited to the first six icon groups.
- Carousel, `600 x 370`, linking to product detail.
- Section title: `Recommended Products`.
- Four-column product card grid.

Data:

- `GET /api/good`
- `GET /api/icon`
- `GET /api/carousel`

Design considerations:

- Category menu, carousel, and product grid need responsive behavior.
- Product images use `object-fit: contain` in carousel and fixed-height card images.
- Product card should include consistent image ratio, price format, title wrapping, and hover/click states.

### Product List

File: `src/views/front/good/GoodList.vue`

Current content:

- Search bar.
- `Category` heading.
- Category icon groups with selected category state.
- Product grid.
- Pagination: total, prev, pager, next.

Data:

- `GET /api/icon`
- `GET /api/good/page`

Design considerations:

- Search and category filters should behave as one filtering system.
- Current grid uses fixed 4-column Element layout; mobile/tablet layouts need definition.
- Empty search results and loading states are not visibly designed.

### Product Detail

File: `src/views/front/good/GoodView.vue`

Current content:

- Product image.
- Product name and description.
- Price panel:
  - `Original Price`
  - `Discount`
  - `Sale Price`
  - or simple `Price`
- `Monthly Sales`
- `Stock`
- Variant radio buttons.
- Quantity stepper.
- `Buy Now`
- `Add to Cart`

Data:

- `GET /api/good/{id}`
- `GET /api/good/standard/{id}`
- `POST /api/cart`

States:

- Discounted vs non-discounted pricing.
- Variant selected vs missing.
- Store/stock visible after variant selection.
- Guest user redirected to login for Add to Cart.

Design considerations:

- Product detail currently uses a fixed `1060px` layout and side-by-side content.
- Variant, stock, quantity, and primary action hierarchy need stronger design.
- Price range and discounted range need clear typography and formatting.
- Product image handling should use a stable aspect ratio.

### Cart

File: `src/views/front/good/Cart.vue`

Current content:

- Empty state: `Your cart is empty`.
- List of `CartItem` cards.

Data:

- `GET /userid`
- `GET /api/cart/userid/{userId}`
- `DELETE /api/cart/{id}`

Design considerations:

- Empty cart should include a return-to-shopping action.
- Cart item layout currently uses a table inside a card; redesign should support smaller screens.
- Quantity editing currently appears only after clicking the quantity button.

### Confirm Order

File: `src/views/front/order/PreOrder.vue`

Current content:

- `Delivery Address` section.
- Address cards with Add, Update, Delete.
- Address dialog fields:
  - Full Name
  - Phone Number
  - Address
- Product confirmation table:
  - Product Image
  - Product Name
  - Variant
  - Unit Price
  - Quantity
  - Price
- Summary:
  - Total
  - Discount
  - Place Order

Data:

- `GET /userid`
- `GET /api/address/{userId}`
- `POST /api/address`
- `DELETE /api/address/{id}`
- `POST /api/order`

Design considerations:

- Address selection state is a thick black border; refine for clarity and accessibility.
- Add address button is currently a small `+`; redesign should make the action discoverable.
- Checkout total summary should be visually persistent and clear.
- If there are no addresses, the page needs a guided empty state.

### Payment

File: `src/views/front/order/Pay.vue`

Current content:

- Order No.
- Amount.
- Payment Method label.
- `Complete Simulated Payment` button.
- Alert on success: `Payment successful: RM ...`.

Data:

- `GET /api/order/paid/{orderNo}`

Design considerations:

- Since payment is simulated, copy must avoid implying real gateway integration.
- Current page is sparse; designer should decide whether to show a confirmation panel, order summary, or demo note.

### Order History

File: `src/views/front/order/OrderList.vue`

Current content:

- Empty state: `No order records`.
- List of `OrderItem` cards.

Order item states:

| State | Customer UI |
|---|---|
| `Pending Payment` or other fallback | Shows state and `Pay Now`. |
| `Paid` | Shows state and disabled `Waiting for shipment`. |
| `Shipped` | Shows state and `Confirm Receipt`. |
| `Received` | Shows check icon and final state. |

Design considerations:

- Order cards should clearly separate order metadata, product info, delivery info, and next action.
- Recipient details currently appear in a hover popover; mobile alternatives are needed.

### Login

File: `src/views/Login.vue`

Current content:

- Background image.
- Title: `Login - R Mall`.
- Username field.
- Password field.
- `Login` button.
- `Register` button.

Design considerations:

- Auth screens use fixed center card sizing and large top margin.
- Error states rely on Element UI messages.
- Login should preserve redirect intent when coming from protected pages.

### Register

File: `src/views/Register.vue`

Current content:

- Background image.
- Title: `Register`.
- Username field.
- Password field.
- Confirm Password field.
- `Register` button.
- `Back` button.

Design considerations:

- Only minimal registration information is collected.
- Password match validation appears only after submission.
- Visual treatment should match login.

### Profile

File: `src/views/Person.vue`

Current content:

- Card title: `Edit Profile`.
- Avatar upload.
- Nickname.
- Phone.
- Email.
- Address.
- `Confirm`.
- `Reset Password` popover:
  - New Password.
  - Confirm Password.

Data:

- `GET /userinfo/{username}`
- `POST /user`
- `GET /user/resetPassword`
- `POST /avatar`

Design considerations:

- Same profile page is used in storefront and admin.
- Password reset in popover may be easy to miss and hard to validate responsively.
- Avatar upload needs clear preview, loading, and error states.

### Admin Shell

File: `src/views/manage/Manage.vue`

Current layout:

- Collapsible sidebar, width `250px` or `64px`.
- Header height `80px`.
- Main area with route outlet.
- Admin home uses background image `resource/img/back.jpg`.

Design considerations:

- Admin UI should be dense, predictable, and work-focused.
- Sidebar hierarchy should be simplified and consistently labelled.
- Breadcrumb currently uses route metadata strings such as `Product/Product Management`.

### Admin Dashboard

File: `src/views/manage/Home.vue`

Current content:

- `Welcome to the Admin Dashboard`.

Design considerations:

- Dashboard currently has no operational metrics.
- If kept, define useful admin overview widgets: orders needing shipment, total revenue, product count, user count, recent orders.

### User Management

File: `src/views/manage/User.vue`

Current content:

- Search mode select: User ID, Account, Nickname.
- Search input.
- Search and Reset buttons.
- Add and Delete Selected buttons.
- Add/Edit dialog:
  - Account for add only.
  - Default password display: `123456`.
  - Nickname.
  - Role.
  - Phone.
  - Email.
  - Address.
- Table columns:
  - id
  - Account
  - Role
  - Nickname
  - Phone
  - Email
  - Address
  - Actions
- Row actions: Edit, Delete.
- Pagination with page size selector and jumper.

Design considerations:

- Toolbar, batch action, table, and modal patterns should become reusable admin patterns.
- Destructive actions use confirmation dialogs and need consistent severity styling.
- Long addresses need wrapping/truncation behavior.

### Order Management

File: `src/views/manage/Order.vue`

Current content:

- Status select: Paid, Shipped, Received.
- Order number search input.
- Reset and Search buttons.
- Table columns:
  - ID
  - Order No.
  - Total
  - User ID
  - Full Name
  - Phone Number
  - Delivery Address
  - Status
  - Order Time
  - Actions
- Status tags:
  - Paid: success
  - Shipped: primary
  - Received: info
- Actions:
  - Details.
  - Ship when status is Paid.
- Details dialog table:
  - Image
  - Product ID
  - Product Name
  - Product Variant
  - Unit Price
  - Discount
  - Actual Price
  - Quantity
  - Total

Design considerations:

- Order status design must align customer and admin views.
- Shipment action should be visibly constrained to paid orders.
- Delivery address column is wide and may dominate the table.

### File Management

File: `src/views/manage/file/File.vue`

Current content:

- File name search.
- Search and Reset.
- Upload.
- Delete Selected.
- Table columns:
  - File Name
  - File Type
  - File Size
  - Actions
- Row actions: Download, Delete.
- Pagination.

Design considerations:

- Upload feedback and allowed file type guidance need consistency.
- Batch delete confirmation currently says `Delete selected users?`, which should be corrected during UX/content cleanup.

### Avatar Management

File: `src/views/manage/file/Avatar.vue`

Current content:

- Avatar preview table.
- File Type.
- File Size.
- Download.
- Delete.
- Pagination.

Design considerations:

- This is a specialized media table; could share table/action patterns with File Management.
- Image preview dimensions and empty/loading states should be standardized.

### Carousel Management

File: `src/views/manage/good/Carousel.vue`

Current content:

- Table columns:
  - Product
  - Image
  - Carousel Order
  - Actions
- Add button.
- Add/Edit dialog:
  - Product ID.
  - Carousel Order select.
- Row actions: Edit, Delete.

Design considerations:

- Product ID input is not designer-friendly; consider product picker/search in future UX.
- Carousel image preview is large and table-specific.
- Ordering control should be clearer.

### Category Management

File: `src/views/manage/good/Category.vue`

Current content:

- Add category group icon button.
- Icon group table with expandable subcategory table.
- Group columns:
  - id
  - icon
  - Actions
- Subcategory columns:
  - Category ID
  - Category Name
  - Actions
- Group actions:
  - Edit icon.
  - Add subcategory.
  - Delete group.
- Subcategory actions:
  - Update.
  - Delete.
- Dialogs:
  - Edit Category Group.
  - Add Category Group.
- Prompt flows:
  - Enter updated name.
  - Enter new subcategory name.

Design considerations:

- Expandable table is compact but may be hard to scan.
- Icon selection uses raw icon glyphs; designer should define icon library usage.
- Category group vs subcategory hierarchy should be visually explicit.

### Product Management

File: `src/views/manage/good/Goods.vue`

Current content:

- Search input.
- Search, Reset, Add.
- Product table columns:
  - Product ID
  - Product Name
  - Product Image
  - Product Description
  - Discount
  - Sales
  - Revenue (RM)
  - Created At
  - Recommended switch
  - Actions
- Actions:
  - Edit.
  - Delete.
- Pagination.

Design considerations:

- Product descriptions and images make the table visually dense.
- Recommended is a switch; confirm whether this maps to home recommendations.
- Add/Edit redirects to the detailed product form.

### Product Add/Edit

File: `src/views/manage/good/GoodInfo.vue`

Current content:

- Product Name.
- Product Description.
- Variant tag list.
- Add/edit/delete variant.
- Discount.
- Category select.
- Product Image upload.
- Submit.
- Variant dialog:
  - Variant Name.
  - Price.
  - Stock.

Design considerations:

- Product editing is a high-value admin workflow and needs clearer grouping: basic info, media, pricing, variants, inventory.
- Variants are represented as tags; editing them by clicking tags is not obvious.
- Image upload allows one image under 500 KB.

### Revenue Charts

File: `src/views/manage/income/IncomeChart.vue`

Current content:

- Total revenue card: `RM Total`.
- Tabs:
  - Revenue by Category Bar Chart.
  - Revenue by Category Pie Chart.
  - This Week Revenue.
  - This Month Revenue.
- ECharts bar, pie, and line charts.

Data:

- `GET /api/income/chart`
- `GET /api/income/week`
- `GET /api/income/month`

Design considerations:

- Chart containers use fixed widths up to `1500px`; responsive chart behavior must be redesigned.
- The total card changes according to active tab.
- Chart color palette and labels should match the future design system.

### Revenue Ranking

File: `src/views/manage/income/IncomeRank.vue`

Current content:

- Top 10 product revenue ranking.
- Uses `IncomeItem` component.

Data:

- `GET /api/category`
- `GET /api/good/rank?num=10`

Design considerations:

- Could be redesigned as a ranked list, compact table, or dashboard widget.
- Product image, rank, revenue, and category context should be scannable.

## 7. Data Entities Affecting UI Design

### Product

Common UI fields:

- `id`
- `name`
- `description`
- `discount`
- `sales`
- `saleMoney`
- `categoryId`
- `imgs`
- `createTime`
- `recommend`

Design implications:

- Product images are central to storefront and admin tables.
- Discount may be `1` for no discount or below `1` for sale pricing.
- Product variants carry their own price and stock.

### Variant / Standard

Common UI fields:

- `value`
- `price`
- `store`

Design implications:

- Variant selection is mandatory for purchase/cart actions.
- Stock display depends on selected variant.
- Price may be shown as a range before a specific variant is selected.

### Order

Common UI fields:

- `orderNo`
- `totalPrice`
- `userId`
- `linkUser`
- `linkPhone`
- `linkAddress`
- `state`
- `createTime`

Order statuses:

| Status | Meaning | Customer Action | Admin Action |
|---|---|---|---|
| `Pending Payment` | Created but not paid | Pay Now | Usually hidden from admin status filter currently. |
| `Paid` | Paid, waiting for shipment | Waiting for shipment | Ship. |
| `Shipped` | Shipped, waiting for customer receipt | Confirm Receipt | No primary action. |
| `Received` | Completed | Final state | Final state. |

### User

Common UI fields:

- `username`
- `nickname`
- `role`
- `phone`
- `email`
- `address`
- `avatarUrl`

Roles:

- `user`
- `admin`

Design implications:

- Admin menu visibility depends on role.
- Avatar appears in both storefront and admin header.
- User profile and admin user management share the same underlying data.

### Category and Icon Group

Common UI fields:

- Icon group `id`
- Icon group `value`, stored as iconfont HTML entity.
- Category `id`
- Category `name`

Seed categories include:

- Clothing
- Men Clothing
- Sports Shoes
- Casual Shoes
- Boots
- Stationery
- Books
- Laptops
- Smartphones
- Tablets
- Food and Beverages
- Beverages
- Tea
- Coffee
- Daily Essentials
- Household Supplies

Design implications:

- Storefront category navigation is icon-group based.
- Admin category editing distinguishes group icons and subcategories.
- Icon library decision should be part of the redesign.

### Address

Common UI fields:

- `linkUser`
- `linkPhone`
- `linkAddress`

Design implications:

- Malaysia-style addresses may be long.
- Checkout and order history need readable address handling.
- Address cards need selected, edit, delete, and empty states.

## 8. Assets and Media

### Frontend Static Assets

| Asset | Usage |
|---|---|
| `src/resource/01.jpg` | Login/register background. |
| `src/resource/03.png` | Login title icon. |
| `src/resource/logo.png` | Admin sidebar logo. |
| `src/resource/search.png` | Search button background image. |
| `src/resource/搜索.png` | Legacy search asset; filename is Chinese. |
| `src/resource/img/back.jpg` | Admin home background. |
| `src/resource/img/login.jpg` | Existing login-related image asset; not clearly used in current inspected views. |
| `src/resource/img/微信支付.png` | Legacy China payment image asset; current payment flow no longer uses it. |
| `src/resource/img/支付宝.png` | Legacy China payment image asset; current payment flow no longer uses it. |
| `src/resource/font/` | Iconfont set. |
| `src/resource/font2/` | Second iconfont set. |

### Backend Media Assets

Product and avatar media are served by the backend:

- `<backend-module>/file/`
- `<backend-module>/avatar/`

Current seed product examples:

- Men Casual Shirt
- Study Desk and Chair Set
- Premium Malt Beverage
- Women Cotton T-Shirt
- English Psalms Book
- Men Casual Sneakers
- Children Drawing Book
- UV Protection Sunglasses

Design implications:

- Product media quality and ratios vary.
- The redesign should define required image ratios for product card, carousel, detail view, table thumbnail, avatar, and upload previews.
- Legacy unused China payment assets should not drive the new design.

## 9. Current Visual System Audit

Current visual characteristics:

- Element UI default components provide most form, table, pagination, dialog, upload, tabs, carousel, popover, tag, switch, and message UI.
- Storefront uses white rounded panels on a light grey background.
- Product cards use pale cyan backgrounds and red price text.
- Admin sidebar uses dark blue-grey `rgb(48,65,86)`.
- Admin header uses pale blue/aliceblue tones.
- Many border radii are large: `20px`, `25px`, `30px`, `40px`, and `90px`.
- Font sizes vary by inline style, often 15px, 18px, 20px, 22px, 25px, 28px, 32px, and 40px.
- Many widths are fixed: search `650px`, product detail `1060px`, image `420px`, charts up to `1500px`, cart/order list around 55-60%.

Main UI issues to address in redesign:

- Inconsistent naming: component `Navagation` is misspelled, but this is implementation naming rather than visible UI.
- Heavy inline styles make visual consistency difficult.
- Storefront and admin use different visual languages.
- Fixed widths make mobile and smaller desktop responsiveness weak.
- Empty states are basic and usually lack next actions.
- Loading states are not deliberately designed.
- Error/success feedback relies on default Element UI messages and browser `alert` in payment.
- Some destructive confirmation text is inconsistent.
- Some image assets and filenames are legacy or non-English.
- Icon usage mixes Element UI icons and custom iconfont glyphs.
- Admin dashboard is currently a welcome page, not a useful operational dashboard.

## 10. UX and Accessibility Considerations

Designer should explicitly define:

- Responsive breakpoints for storefront and admin.
- Keyboard focus treatment for nav, forms, dialogs, category filters, product cards, and tables.
- Hover, active, selected, disabled, loading, empty, error, and success states.
- Clear primary vs secondary action hierarchy:
  - Buy Now vs Add to Cart.
  - Place Order vs address editing.
  - Admin Edit vs Delete.
  - Ship vs Details.
- Consistent destructive-action confirmations.
- Form validation placement and wording.
- Product image fallback when media is missing.
- Long text behavior:
  - product names;
  - product descriptions;
  - Malaysia addresses;
  - order numbers;
  - file names.
- Touch-friendly alternatives for hover-only details, especially recipient address popovers.
- Accessible color contrast for price, status, selected category, and warning/destructive actions.

## 11. Recommended Design Deliverables

The UI designer should prepare:

1. Information architecture / navigation map.
2. Storefront design system:
   - typography scale;
   - colors;
   - spacing;
   - product card;
   - search;
   - category navigation;
   - product detail modules;
   - checkout/address/order components.
3. Admin design system:
   - sidebar;
   - top bar;
   - breadcrumb;
   - toolbar;
   - tables;
   - filters;
   - pagination;
   - dialogs;
   - forms;
   - upload controls;
   - status tags;
   - chart panels.
4. Responsive layouts:
   - mobile storefront;
   - tablet storefront;
   - desktop storefront;
   - admin minimum supported desktop width.
5. Component states:
   - loading;
   - empty;
   - selected;
   - disabled;
   - validation error;
   - success;
   - destructive confirmation.
6. UX copy cleanup:
   - consistent action labels;
   - consistent status labels;
   - simulated payment wording;
   - corrected batch delete copy.
7. Media guidelines:
   - product card ratio;
   - carousel ratio;
   - product detail image ratio;
   - admin thumbnail ratio;
   - avatar ratio;
   - fallback image treatment.

## 12. Suggested Redesign Priorities

High priority:

- Storefront navigation, home, product listing, product detail, checkout, and order history.
- Shared product card, address card, order item, cart item, and status tag components.
- Admin table/toolbar/dialog/form patterns.
- Responsive storefront behavior.

Medium priority:

- Admin dashboard usefulness.
- Revenue chart visual polish and responsive chart containers.
- Product media upload UX.
- Category/icon management clarity.

Low priority:

- Legacy unused media cleanup.
- Internal component/file naming cleanup.
- Non-visible developer comments.

## 13. Implementation Notes for Future Developers

- Keep `RM` currency and Malaysia-context sample data unless project scope changes.
- Keep simulated payment clearly labelled; do not introduce real payment UX unless backend scope changes.
- Role checks currently depend on `POST /role` and token in local storage.
- Media URLs are built by prefixing `this.$store.state.baseApi`.
- Route names and paths are already used in navigation and redirects; redesign should preserve user flow unless router refactor is planned.
- Element UI can remain as the implementation base, but the current design does not yet have a coherent component system on top of it.

## 14. Quick File Reference

| Concern | Files |
|---|---|
| Routes | `<frontend-module>/src/router/index.js` |
| API wrapper | `<frontend-module>/src/utils/request.js` |
| API/media base URL | `<frontend-module>/src/store/index.js` |
| Storefront shell | `<frontend-module>/src/views/front/Front.vue` |
| Storefront pages | `<frontend-module>/src/views/front/TopView.vue`, `front/good/*`, `front/order/*` |
| Auth/profile | `<frontend-module>/src/views/Login.vue`, `Register.vue`, `Person.vue` |
| Admin shell | `<frontend-module>/src/views/manage/Manage.vue` |
| Admin pages | `<frontend-module>/src/views/manage/**` |
| Reusable components | `<frontend-module>/src/components/*.vue` |
| Global CSS | `<frontend-module>/src/resource/global.css`, `src/resource/css/search.css`, `src/resource/css/icon.css` |
| Static frontend assets | `<frontend-module>/src/resource/` |
| Backend media | `<backend-module>/file/`, `<backend-module>/avatar/` |
| Seed data | `database/electronic_mall.sql` |
