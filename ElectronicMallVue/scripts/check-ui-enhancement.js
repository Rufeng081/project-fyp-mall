const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assertContains(file, text, message) {
  const content = read(file);
  if (!content.includes(text)) {
    throw new Error(`${message} (${file})`);
  }
}

function assertNotContains(file, text, message) {
  const content = read(file);
  if (content.includes(text)) {
    throw new Error(`${message} (${file})`);
  }
}

const checks = [
  () => assertContains("src/resource/global.css", "--mall-primary", "Global design tokens are missing"),
  () => assertContains("src/resource/global.css", "--mall-primary: #6D4AFF", "Warm softened primary token is missing"),
  () => assertContains("src/resource/global.css", "--mall-bg: #FAF8F4", "Warm page background token is missing"),
  () => assertContains("src/resource/global.css", "--mall-bg-warm: #F3EFE8", "Warm soft background token is missing"),
  () => assertContains("src/resource/global.css", "--mall-border: #E8E2D8", "Warm neutral border token is missing"),
  () => assertContains("src/resource/global.css", "background: var(--mall-primary);", "Primary buttons must use solid brand colour"),
  () => assertNotContains("src/resource/global.css", "linear-gradient(135deg, var(--mall-primary)", "Primary buttons must not use gradients"),
  () => assertContains("src/components/Navagation.vue", "mall-navbar", "Storefront navigation was not upgraded"),
  () => assertContains("src/views/front/TopView.vue", "hero-banner", "Homepage hero banner is missing"),
  () => assertContains("src/views/front/TopView.vue", "homepage-hero.png", "Homepage must use the supplied warm lifestyle hero image"),
  () => assertContains("src/views/front/TopView.vue", "Everyday essentials, thoughtfully selected.", "Hero title must match the approved UI/UX plan"),
  () => assertContains("src/views/front/TopView.vue", "hero-trust-points", "Hero trust points are missing"),
  () => assertNotContains("src/views/front/TopView.vue", "hero-features", "Hero should not contain repeated feature blocks"),
  () => assertContains("src/views/front/TopView.vue", "lifestyle-section", "Homepage lifestyle storytelling section is missing"),
  () => assertContains("src/views/front/TopView.vue", "curated-badge", "Product cards need curated marketplace badges"),
  () => assertContains("src/views/front/TopView.vue", "details-button", "Product cards need a clear details action"),
  () => assertContains("src/views/front/TopView.vue", "add-cart-button", "Product cards need a clear add-to-cart action"),
  () => assertContains("src/views/front/TopView.vue", "service-section", "Homepage service guarantee section is missing"),
  () => assertNotContains("src/views/front/TopView.vue", "background-color: black", "Homepage carousel still uses black image framing"),
  () => assertContains("src/views/front/good/GoodList.vue", "product-grid", "Product list grid was not upgraded"),
  () => assertContains("src/views/front/good/GoodList.vue", "categoryName(product.categoryId)", "Product list must display real category labels"),
  () => assertContains("src/views/manage/good/Goods.vue", "admin-product-thumb", "Admin product thumbnails need a stable image container"),
  () => assertNotContains("src/components/Aside.vue", "Admin Dashboard</span>", "Admin sidebar title should be removed to avoid clipping"),
  () => assertContains("src/views/front/good/GoodView.vue", "product-detail-page", "Product detail layout was not upgraded"),
  () => assertContains("src/views/front/good/Cart.vue", "cart-page", "Cart page layout was not upgraded"),
  () => assertContains("src/views/front/order/PreOrder.vue", "checkout-page", "Checkout page layout was not upgraded"),
  () => assertContains("src/views/front/order/OrderList.vue", "orders-page", "Order history layout was not upgraded"),
  () => assertContains("src/views/Login.vue", "auth-card", "Login page auth card was not upgraded"),
  () => assertContains("src/views/Register.vue", "verification-steps", "Register verification progress is missing"),
  () => assertContains("src/views/Person.vue", "profile-page", "User profile layout was not upgraded"),
  () => assertContains("src/views/manage/Manage.vue", "manage-shell", "Admin shell minor optimization is missing"),
];

checks.forEach((check) => check());

console.log(`UI enhancement checks passed (${checks.length} checks).`);
