<template>
  <div class="home-page mall-page">
    <section class="hero-banner">
      <div class="hero-content">
        <span class="welcome-badge">Rufeng Mall</span>
        <h2>Everyday essentials, thoughtfully selected.</h2>
        <p>
          A simple and warm shopping experience for study, work, and daily living.
        </p>
        <el-button class="primary-button" type="primary" @click="$router.push('/goodList')">
          Shop Now
          <i class="el-icon-right"></i>
        </el-button>
        <div class="hero-trust-points" aria-label="Shopping benefits">
          <span>Simple browsing</span>
          <span>Secure orders</span>
          <span>Daily essentials</span>
        </div>
      </div>

      <router-link class="hero-image" to="/goodList" aria-label="Browse Rufeng Mall products">
        <img :src="heroImage" alt="Warm desk scene with laptop, books, notebook, coffee cup, plant and phone" />
      </router-link>
    </section>

    <section class="service-strip">
      <div class="service-item">
        <strong>Trusted Checkout</strong>
        <span>Safe and protected</span>
      </div>
      <div class="service-item">
        <strong>Curated Quality</strong>
        <span>Only the better for you</span>
      </div>
      <div class="service-item">
        <strong>Malaysia Delivery</strong>
        <span>Ship to your doorstep</span>
      </div>
      <div class="service-item">
        <strong>Helpful Support</strong>
        <span>We're here to help</span>
      </div>
    </section>

    <main class="home-content">
      <aside class="category-card mall-card">
        <div class="section-kicker">Shop by need</div>
        <h3>Categories</h3>
        <router-link
          v-for="category in visibleCategories"
          :key="category.id"
          class="category-item"
          :to="{ path: '/goodList', query: { categoryId: category.id } }"
        >
          <span class="category-icon" aria-hidden="true">
            <i :class="category.iconClass"></i>
          </span>
          <div class="category-text">
            <strong>{{ category.name }}</strong>
            <span>{{ category.description }}</span>
          </div>
          <i class="el-icon-arrow-right"></i>
        </router-link>
      </aside>

      <section class="recommended-section">
        <div class="section-header">
          <div>
            <span class="section-kicker">Featured Products</span>
            <h3 class="mall-section-title">Selected for everyday use</h3>
          </div>
          <router-link to="/goodList">View all</router-link>
        </div>

        <div class="product-grid">
          <article
            v-for="(product, index) in featuredGoods"
            :key="product.id"
            class="product-card mall-card"
          >
            <router-link :to="'/goodView/' + product.id" class="product-image">
              <img :src="productImage(product)" :alt="product.name" />
              <span class="curated-badge">{{ productBadge(index) }}</span>
            </router-link>
            <div class="product-info">
              <span class="product-category">{{ product.categoryName || categoryLabel(index) }}</span>
              <router-link :to="'/goodView/' + product.id">
                <h4>{{ product.name }}</h4>
              </router-link>
              <p class="product-description">
                {{ product.description || productCopy(index) }}
              </p>
              <div class="rating-row">
                <span class="rating">★ {{ ratingFor(product, index) }}</span>
                <span>{{ reviewCount(product, index) }} reviews</span>
              </div>
              <div class="product-footer">
                <p class="price">RM {{ Number(product.price).toFixed(2) }}</p>
                <button
                  class="add-cart-button"
                  type="button"
                  :aria-label="'Add ' + product.name + ' to cart'"
                  @click="$router.push('/goodView/' + product.id)"
                >
                  <i class="el-icon-shopping-cart-2"></i>
                  Add
                </button>
              </div>
              <router-link class="details-button" :to="'/goodView/' + product.id">
                View details
              </router-link>
            </div>
          </article>
        </div>
      </section>
    </main>

    <section class="lifestyle-section mall-card">
      <div>
        <span class="section-kicker">Campus Collection</span>
        <h3>Objects that make daily routines feel easier.</h3>
        <p>
          From study essentials to weekend carry items, Rufeng Mall presents
          practical products with a quieter, more thoughtful shopping rhythm.
        </p>
      </div>
      <router-link to="/goodList" class="ghost-link">
        Explore the collection
        <i class="el-icon-right"></i>
      </router-link>
    </section>

    <section class="service-section">
      <div class="service-card">
        <strong>Carefully Selected for Everyday Living</strong>
        <span>Products are presented with clear information and consistent imagery.</span>
      </div>
      <div class="service-card">
        <strong>Trusted Checkout Experience</strong>
        <span>The existing cart, checkout and order flow remains unchanged.</span>
      </div>
      <div class="service-card">
        <strong>Delivered Across Malaysia</strong>
        <span>A calm shopping journey from browsing to simulated payment.</span>
      </div>
      <div class="service-card">
        <strong>We're Here Whenever You Need Us</strong>
        <span>Support copy is warmer and less template-like for FYP review.</span>
      </div>
    </section>
  </div>
</template>

<script>
const homepageHero = require("@/resource/homepage-hero.png");

const fallbackProducts = [
  {
    id: 35,
    name: "Wireless Headphone",
    categoryName: "Electronics",
    price: 159,
    imgs: "/file/seed_035_noise_reducing_headphones.jpg",
    localImage: require("@/../../ElectronicMallApi/file/seed_035_noise_reducing_headphones.jpg"),
    description: "Quiet audio for study sessions and daily focus.",
  },
  {
    id: 23,
    name: "Minimal Notebook",
    categoryName: "Stationery",
    price: 8.9,
    imgs: "/file/seed_023_academic_planner_2026.jpg",
    localImage: require("@/../../ElectronicMallApi/file/seed_023_academic_planner_2026.jpg"),
    description: "A simple planner for lectures, projects and routines.",
  },
  {
    id: 58,
    name: "Reusable Shopping Bags",
    categoryName: "Eco Living",
    price: 12.9,
    imgs: "/file/seed_058_reusable_shopping_bags.jpg",
    localImage: require("@/../../ElectronicMallApi/file/seed_058_reusable_shopping_bags.jpg"),
    description: "Lightweight carry bags for everyday errands.",
  },
  {
    id: 59,
    name: "Stainless Food Container",
    categoryName: "Food & Living",
    price: 35,
    imgs: "/file/seed_059_stainless_food_container.jpg",
    localImage: require("@/../../ElectronicMallApi/file/seed_059_stainless_food_container.jpg"),
    description: "A practical container for meals between classes.",
  },
];

const fallbackCategories = [
  { id: 1, name: "Study Essentials", description: "Stationery, books and planning tools", iconClass: "el-icon-notebook-2" },
  { id: 2, name: "Campus Tech", description: "Headphones, adapters and accessories", iconClass: "el-icon-monitor" },
  { id: 3, name: "Daily Carry", description: "Bags, bottles and practical items", iconClass: "el-icon-shopping-bag-1" },
  { id: 4, name: "Eco Living", description: "Reusable and low-waste products", iconClass: "el-icon-sunrise" },
  { id: 5, name: "Food & Drinks", description: "Simple snacks and pantry basics", iconClass: "el-icon-coffee-cup" },
];

export default {
  name: "TopView",
  data() {
    return {
      carousels: [],
      good: [],
      baseApi: this.$store.state.baseApi,
      icons: [],
    };
  },
  computed: {
    displayGoods() {
      return this.good.length > 0 ? this.good : fallbackProducts;
    },
    heroImage() {
      return homepageHero;
    },
    heroLink() {
      if (this.carousels.length > 0) {
        return "/goodView/" + this.carousels[0].goodId;
      }
      return "/goodView/" + this.displayGoods[0].id;
    },
    featuredGoods() {
      return this.displayGoods.slice(0, 4);
    },
    visibleCategories() {
      const categories = [];
      this.icons.forEach((iconGroup) => {
        iconGroup.categories.forEach((category) => {
          categories.push({
            id: category.id,
            name: category.name,
            description: this.categoryDescription(category.name),
            iconClass: this.categoryIcon(category.name),
          });
        });
      });
      return categories.length > 0 ? categories.slice(0, 5) : fallbackCategories;
    },
  },
  created() {
    this.request.get("/api/good").then((res) => {
      if (res.code === "200") {
        this.good = res.data;
      }
    });
    this.request.get("/api/icon").then((res) => {
      if (res.code === "200") {
        this.icons = res.data.slice(0, 5);
      }
    });
    this.request.get("/api/carousel").then((res) => {
      if (res.code === "200") {
        this.carousels = res.data;
      }
    });
  },
  methods: {
    productImage(product) {
      if (product.localImage) return product.localImage;
      return this.baseApi + product.imgs;
    },
    categoryDescription(name) {
      const normalized = String(name || "").toLowerCase();
      if (normalized.includes("shoe")) return "Comfortable daily footwear";
      if (normalized.includes("cloth")) return "Simple pieces for everyday wear";
      if (normalized.includes("book") || normalized.includes("station")) return "Tools for study and planning";
      if (normalized.includes("elect")) return "Useful tech for campus life";
      if (normalized.includes("food")) return "Snacks and pantry essentials";
      if (normalized.includes("drink") || normalized.includes("beverage")) return "Tea, coffee and simple drinks";
      return "Thoughtfully selected daily goods";
    },
    categoryIcon(name) {
      const normalized = String(name || "").toLowerCase();
      if (normalized.includes("shoe")) return "el-icon-football";
      if (normalized.includes("cloth")) return "el-icon-s-custom";
      if (normalized.includes("book") || normalized.includes("station")) return "el-icon-notebook-2";
      if (normalized.includes("elect") || normalized.includes("laptop") || normalized.includes("phone")) return "el-icon-monitor";
      if (normalized.includes("food")) return "el-icon-food";
      if (normalized.includes("drink") || normalized.includes("beverage") || normalized.includes("coffee")) return "el-icon-coffee-cup";
      return "el-icon-shopping-bag-1";
    },
    productBadge(index) {
      return ["Best Seller", "New", "Eco Choice", "Trending"][index % 4];
    },
    categoryLabel(index) {
      return ["Electronics", "Stationery", "Eco Living", "Food & Living"][index % 4];
    },
    productCopy(index) {
      return [
        "A quiet choice for focus, work and everyday movement.",
        "Useful for lectures, notes and project planning.",
        "A practical object made for repeated daily use.",
        "Simple, durable and easy to bring along.",
      ][index % 4];
    },
    ratingFor(product, index) {
      const base = 4.6 + (index % 3) * 0.1;
      return product.rating || base.toFixed(1);
    },
    reviewCount(product, index) {
      return product.reviews || [128, 86, 64, 102][index % 4];
    },
  },
};
</script>

<style scoped>
.home-page {
  padding-top: 28px;
}

.hero-banner {
  height: clamp(520px, 42vw, 600px);
  border: 1px solid var(--mall-border);
  border-radius: 32px;
  overflow: hidden;
  background: linear-gradient(90deg, #fffaf1 0%, #ffffff 48%, #f3efe8 100%);
  display: grid;
  grid-template-columns: minmax(0, 45%) minmax(0, 55%);
  box-shadow: var(--mall-shadow-md);
}

.hero-content {
  padding: clamp(48px, 7vw, 88px) clamp(28px, 5vw, 72px);
  align-self: center;
}

.welcome-badge,
.section-kicker {
  display: inline-block;
  color: var(--mall-text-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
}

.hero-content h2 {
  max-width: 560px;
  margin: 20px 0 18px;
  color: var(--mall-text);
  font-size: clamp(44px, 5vw, 64px);
  line-height: 1.05;
  font-weight: 700;
}

.hero-content p {
  max-width: 440px;
  margin: 0 0 32px;
  color: var(--mall-text-muted);
  font-size: 16px;
  line-height: 1.65;
}

.primary-button {
  height: 48px;
  padding: 0 28px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
}

.primary-button i {
  margin-left: 8px;
}

.hero-trust-points {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  color: var(--mall-text-muted);
  font-size: 13px;
  font-weight: 600;
}

.hero-trust-points span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.hero-trust-points span::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--mall-accent);
}

.hero-image {
  position: relative;
  height: 100%;
  min-height: 100%;
  display: block;
  overflow: hidden;
  background: var(--mall-bg-warm);
}

.hero-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-strip {
  margin: 32px 0 64px;
  padding: 18px 0;
  border-top: 1px solid var(--mall-divider);
  border-bottom: 1px solid var(--mall-divider);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.service-item strong,
.service-card strong {
  display: block;
  color: var(--mall-text);
  font-size: 13px;
  font-weight: 700;
}

.service-item span,
.service-card span {
  display: block;
  margin-top: 4px;
  color: var(--mall-text-muted);
  font-size: 12px;
  line-height: 1.45;
}

.home-content {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 40px;
}

.category-card {
  padding: 24px;
  align-self: start;
}

.category-card h3 {
  margin: 8px 0 18px;
  color: var(--mall-text);
  font-size: 22px;
}

.category-item {
  display: grid;
  grid-template-columns: 42px 1fr 16px;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: 16px;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.category-item:hover {
  background: var(--mall-bg);
  border-color: var(--mall-border);
  color: var(--mall-primary);
}

.category-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: var(--mall-bg-warm);
  color: var(--mall-accent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.category-text strong {
  display: block;
  font-size: 14px;
  font-weight: 700;
}

.category-text span {
  display: block;
  margin-top: 4px;
  color: var(--mall-text-muted);
  font-size: 12px;
  line-height: 1.45;
}

.section-header {
  margin-bottom: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.mall-section-title {
  margin-top: 8px;
  font-size: 28px;
  font-weight: 700;
}

.section-header a,
.ghost-link {
  color: var(--mall-text);
  font-size: 13px;
  font-weight: 700;
}

.section-header a:hover,
.ghost-link:hover {
  color: var(--mall-primary);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 24px;
  align-items: stretch;
}

.product-card {
  min-height: 456px;
  padding: 0;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--mall-shadow-lg);
}

.product-image {
  position: relative;
  height: 220px;
  margin: 16px 16px 0;
  border-radius: 16px;
  overflow: hidden;
  background: var(--mall-surface-soft);
  display: block;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.curated-badge {
  position: absolute;
  left: 12px;
  top: 12px;
  padding: 5px 9px;
  border-radius: 999px;
  background: rgba(250, 250, 248, 0.9);
  color: var(--mall-text);
  border: 1px solid rgba(232, 232, 230, 0.8);
  font-size: 11px;
  font-weight: 700;
}

.product-info {
  padding: 18px;
}

.product-category {
  color: var(--mall-text-muted);
  font-size: 12px;
  font-weight: 600;
}

.product-info h4 {
  min-height: 42px;
  margin: 8px 0 8px;
  color: var(--mall-text);
  font-size: 16px;
  line-height: 1.35;
  font-weight: 700;
}

.product-description {
  height: 40px;
  margin: 0 0 14px;
  color: var(--mall-text-muted);
  font-size: 13px;
  line-height: 1.5;
  overflow: hidden;
}

.rating-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--mall-text-muted);
  font-size: 12px;
}

.rating {
  color: #8A5A20;
  font-weight: 700;
}

.product-footer {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.price {
  margin: 0;
  color: var(--mall-text);
  font-size: 16px;
  font-weight: 700;
}

.add-cart-button {
  min-width: 86px;
  height: 38px;
  padding: 0 14px;
  border: 1px solid var(--mall-border);
  border-radius: 999px;
  background: #ffffff;
  color: var(--mall-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.add-cart-button:hover {
  background: var(--mall-primary-soft);
  border-color: var(--mall-primary);
  color: var(--mall-primary);
}

.details-button {
  min-height: 42px;
  margin-top: 14px;
  border-radius: 12px;
  background: var(--mall-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  transition: background 0.2s ease;
}

.details-button:hover {
  background: var(--mall-primary-dark);
}

.lifestyle-section {
  margin-top: 64px;
  padding: clamp(32px, 5vw, 56px);
  background: var(--mall-bg-warm);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
}

.lifestyle-section h3 {
  max-width: 620px;
  margin: 8px 0 14px;
  color: var(--mall-text);
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.1;
  font-weight: 700;
}

.lifestyle-section p {
  max-width: 560px;
  margin: 0;
  color: var(--mall-text-muted);
  font-size: 15px;
  line-height: 1.7;
}

.service-section {
  margin: 80px 0 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.service-card {
  padding-top: 20px;
  border-top: 1px solid var(--mall-divider);
}

@media (max-width: 1180px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }

  .service-section,
  .service-strip {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 860px) {
  .hero-banner,
  .home-content {
    grid-template-columns: 1fr;
  }

  .hero-banner {
    height: auto;
  }

  .hero-image {
    height: auto;
    min-height: 320px;
  }

  .lifestyle-section {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 620px) {
  .home-page {
    padding-top: 18px;
  }

  .hero-content {
    padding: 36px 24px;
  }

  .hero-banner {
    border-radius: 24px;
  }

  .hero-image {
    height: auto;
    min-height: 260px;
  }

  .service-strip,
  .product-grid,
  .service-section {
    grid-template-columns: 1fr;
  }
}
</style>
