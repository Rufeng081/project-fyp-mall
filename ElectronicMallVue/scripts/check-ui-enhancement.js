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
  () => assertContains("src/components/Navagation.vue", "mall-navbar", "Storefront navigation was not upgraded"),
  () => assertContains("src/views/front/TopView.vue", "hero-banner", "Homepage hero banner is missing"),
  () => assertContains("src/views/front/TopView.vue", "service-section", "Homepage service guarantee section is missing"),
  () => assertNotContains("src/views/front/TopView.vue", "background-color: black", "Homepage carousel still uses black image framing"),
  () => assertContains("src/views/front/good/GoodList.vue", "product-grid", "Product list grid was not upgraded"),
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
