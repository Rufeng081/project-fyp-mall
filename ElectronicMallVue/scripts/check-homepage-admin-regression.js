const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assertContains(file, expected, message) {
  const content = read(file);
  if (!content.includes(expected)) {
    throw new Error(`${message} (${file})`);
  }
}

function assertNotContains(file, unexpected, message) {
  const content = read(file);
  if (content.includes(unexpected)) {
    throw new Error(`${message} (${file})`);
  }
}

assertContains(
  "src/views/front/TopView.vue",
  "carouselFeaturedGoods()",
  "Homepage featured products must be derived from carousel/admin recommendations"
);
assertContains(
  "src/views/front/TopView.vue",
  "concat(fallbackGoods).slice(0, 4);",
  "Homepage featured products must keep the four-product limit"
);
assertContains(
  "src/views/front/TopView.vue",
  "carouselGoodIds",
  "Homepage must map carousel product IDs back to product records"
);
assertContains(
  "src/views/manage/good/Carousel.vue",
  "Homepage Recommendation Management",
  "Admin carousel page copy should reflect its homepage recommendation role"
);
assertContains(
  "src/views/manage/good/Carousel.vue",
  "Recommendation Order",
  "Admin carousel order label should describe recommendation ordering"
);
assertNotContains(
  "src/views/manage/Manage.vue",
  "linear-gradient(135deg, rgba(251, 249, 255, 0.94), rgba(255, 255, 255, 0.82))",
  "Admin home must not keep the oversized translucent mask overlay"
);
assertContains(
  "src/views/manage/Home.vue",
  "admin-home-legacy",
  "Admin home should be restored to the stable legacy layout wrapper"
);

console.log("Homepage carousel and admin regression checks passed.");
