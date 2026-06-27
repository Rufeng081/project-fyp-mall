<template>
  <div class="home-page mall-page">
    <section class="hero-banner">
      <div class="hero-content">
        <span class="welcome-badge">Welcome to</span>
        <h2>Rufeng Mall</h2>
        <p>A modern shopping platform developed for the UKM Final Year Project.</p>

        <div class="hero-features">
          <div class="feature-item">
            <div class="feature-icon"><i class="el-icon-medal"></i></div>
            <div>
              <strong>Quality Products</strong>
              <span>Carefully selected for you</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon"><i class="el-icon-bank-card"></i></div>
            <div>
              <strong>Secure Payment</strong>
              <span>Safe and reliable checkout</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon"><i class="el-icon-truck"></i></div>
            <div>
              <strong>Fast Delivery</strong>
              <span>Prompt and trusted shipping</span>
            </div>
          </div>
        </div>

        <el-button class="primary-button" type="primary" @click="$router.push('/goodList')">
          Start Shopping
          <i class="el-icon-right"></i>
        </el-button>
      </div>

      <router-link
        class="hero-image"
        :to="heroLink"
        aria-label="View featured product"
      >
        <img :src="heroImage" alt="Shopping banner" />
      </router-link>

      <div class="carousel-dots" aria-hidden="true">
        <span class="active"></span>
        <span></span>
        <span></span>
      </div>
    </section>

    <main class="home-content">
      <aside class="category-card mall-card">
        <h3>Categories</h3>
        <router-link
          v-for="category in visibleCategories"
          :key="category.id"
          class="category-item"
          :to="{ path: '/goodList', query: { categoryId: category.id } }"
        >
          <div class="category-icon">
            <i v-if="category.iconClass" :class="category.iconClass"></i>
            <i v-else class="iconfont" v-html="category.icon"></i>
          </div>
          <div class="category-text">
            <strong>{{ category.name }}</strong>
            <span>{{ category.description }}</span>
          </div>
          <i class="el-icon-arrow-right"></i>
        </router-link>
        <router-link class="view-all-category" to="/goodList">
          View All Categories
          <i class="el-icon-arrow-right"></i>
        </router-link>
      </aside>

      <section class="recommended-section">
        <div class="section-header">
          <h3 class="mall-section-title">
            <i class="el-icon-collection-tag"></i>
            Recommended Products
          </h3>
          <router-link to="/goodList">
            View All
            <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>

        <div class="product-grid">
          <article
            v-for="product in featuredGoods"
            :key="product.id"
            class="product-card mall-card"
          >
            <router-link :to="'/goodView/' + product.id" class="product-image">
              <img :src="baseApi + product.imgs" :alt="product.name" />
            </router-link>
            <div class="product-info">
              <span class="product-category">{{ product.categoryName || "Rufeng Mall" }}</span>
              <router-link :to="'/goodView/' + product.id">
                <h4>{{ product.name }}</h4>
              </router-link>
              <p class="product-description">
                {{ product.description || "Selected product for campus lifestyle shopping." }}
              </p>
              <div class="rating">
                <i class="el-icon-star-on"></i>
                <span>4.8 ({{ 60 + product.id }})</span>
              </div>
              <p class="price">RM {{ Number(product.price).toFixed(2) }}</p>
              <div class="product-actions">
                <el-button class="cart-button" @click="$router.push('/goodView/' + product.id)">
                  <i class="el-icon-shopping-cart-2"></i>
                  Add to Cart
                </el-button>
                <button
                  class="wishlist-button"
                  type="button"
                  aria-label="Add to wishlist"
                >
                  <i class="el-icon-star-off"></i>
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>

    <section class="service-section mall-card">
      <div class="service-item">
        <div class="service-icon"><i class="el-icon-lock"></i></div>
        <div>
          <strong>Secure Payment</strong>
          <span>Your payment information is safe with us.</span>
        </div>
      </div>
      <div class="service-item">
        <div class="service-icon"><i class="el-icon-medal"></i></div>
        <div>
          <strong>Quality Guarantee</strong>
          <span>We ensure the best quality products for you.</span>
        </div>
      </div>
      <div class="service-item">
        <div class="service-icon"><i class="el-icon-truck"></i></div>
        <div>
          <strong>Fast Delivery</strong>
          <span>Get your products delivered quickly to your doorstep.</span>
        </div>
      </div>
      <div class="service-item">
        <div class="service-icon"><i class="el-icon-service"></i></div>
        <div>
          <strong>24/7 Support</strong>
          <span>Contact us anytime, we're here to help.</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
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
    heroImage() {
      if (this.carousels.length > 0) {
        return this.baseApi + this.carousels[0].img;
      }
      if (this.good.length > 0) {
        return this.baseApi + this.good[0].imgs;
      }
      return require("@/resource/01.jpg");
    },
    heroLink() {
      if (this.carousels.length > 0) {
        return "/goodView/" + this.carousels[0].goodId;
      }
      if (this.good.length > 0) {
        return "/goodView/" + this.good[0].id;
      }
      return "/goodList";
    },
    featuredGoods() {
      return this.good.slice(0, 4);
    },
    visibleCategories() {
      const categories = [];
      this.icons.forEach((iconGroup, groupIndex) => {
        iconGroup.categories.forEach((category) => {
          categories.push({
            id: category.id,
            name: category.name,
            description: this.categoryDescription(category.name),
            icon: iconGroup.value,
            iconClass: this.categoryIcon(groupIndex),
          });
        });
      });
      return categories.slice(0, 6);
    },
  },
  created() {
    this.request.get("/api/good").then((res) => {
      if (res.code === "200") {
        this.good = res.data;
      } else {
        this.$message.error(res.msg);
      }
    });
    this.request.get("/api/icon").then((res) => {
      if (res.code === "200") {
        this.icons = res.data.slice(0, 6);
      }
    });
    this.request.get("/api/carousel").then((res) => {
      if (res.code === "200") {
        this.carousels = res.data;
      }
    });
  },
  methods: {
    categoryDescription(name) {
      const normalized = String(name || "").toLowerCase();
      if (normalized.includes("shoe")) return "Sports / Casual / Boots";
      if (normalized.includes("cloth")) return "Campus and daily wear";
      if (normalized.includes("book") || normalized.includes("station")) return "Books & More";
      if (normalized.includes("elect")) return "Devices and accessories";
      if (normalized.includes("food")) return "Snacks / Food";
      if (normalized.includes("drink") || normalized.includes("beverage")) return "Tea / Coffee / Drinks";
      return "Selected lifestyle goods";
    },
    categoryIcon(index) {
      const icons = [
        "el-icon-s-custom",
        "el-icon-football",
        "el-icon-notebook-2",
        "el-icon-monitor",
        "el-icon-food",
        "el-icon-coffee-cup",
      ];
      return icons[index % icons.length];
    },
  },
};
</script>

<style scoped>
.home-page {
  padding-top: 22px;
}

.hero-banner {
  position: relative;
  min-height: 390px;
  border-radius: var(--mall-radius-xl);
  overflow: hidden;
  background:
    radial-gradient(circle at 2% 85%, rgba(91, 43, 214, 0.13), transparent 18%),
    linear-gradient(100deg, #f5edff 0%, #fbf7ff 42%, #fff4ea 100%);
  display: grid;
  grid-template-columns: minmax(0, 48%) minmax(0, 52%);
  box-shadow: var(--mall-shadow-md);
}

.hero-content {
  padding: clamp(34px, 4vw, 52px) 28px clamp(34px, 4vw, 48px) clamp(34px, 7vw, 106px);
  z-index: 2;
}

.welcome-badge {
  display: inline-block;
  padding: 8px 18px;
  border-radius: 999px;
  background: #eadcff;
  color: var(--mall-primary);
  font-size: 14px;
  font-weight: 800;
}

.hero-content h2 {
  margin: 18px 0 10px;
  color: var(--mall-primary);
  font-size: clamp(42px, 5vw, 64px);
  line-height: 1;
  font-weight: 900;
}

.hero-content p {
  max-width: 420px;
  margin: 0;
  color: #393161;
  font-size: 18px;
  line-height: 1.55;
}

.hero-features {
  display: flex;
  flex-wrap: wrap;
  gap: 22px 32px;
  margin: 30px 0 34px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 150px;
}

.feature-icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: #eee5ff;
  color: var(--mall-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.feature-item strong,
.service-item strong {
  display: block;
  color: var(--mall-text);
  font-size: 13px;
  font-weight: 800;
}

.feature-item span,
.service-item span {
  display: block;
  margin-top: 4px;
  color: var(--mall-text-muted);
  font-size: 12px;
  line-height: 1.45;
}

.primary-button {
  height: 48px;
  padding: 0 26px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 800;
}

.primary-button i {
  margin-left: 8px;
}

.hero-image {
  min-height: 390px;
  display: block;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-dots {
  position: absolute;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
}

.carousel-dots span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #d7d0e9;
}

.carousel-dots .active {
  background: var(--mall-primary);
}

.home-content {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 28px;
  margin-top: 22px;
}

.category-card {
  padding: 18px;
}

.category-card h3 {
  margin: 0 0 12px;
  color: var(--mall-text);
  font-size: 16px;
}

.category-item {
  display: grid;
  grid-template-columns: 38px 1fr 16px;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--mall-border);
  transition: color 0.2s ease, transform 0.2s ease;
}

.category-item:hover {
  color: var(--mall-primary);
  transform: translateX(3px);
}

.category-icon {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #f2f0f8;
  color: var(--mall-text);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.category-text strong {
  display: block;
  font-size: 13px;
}

.category-text span {
  display: block;
  margin-top: 3px;
  color: var(--mall-text-muted);
  font-size: 12px;
}

.view-all-category {
  margin-top: 14px;
  color: var(--mall-primary);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 800;
}

.section-header {
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.section-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-header h3 i {
  color: var(--mall-accent);
}

.section-header a {
  color: var(--mall-primary);
  font-size: 13px;
  font-weight: 800;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(190px, 1fr));
  gap: 22px;
  margin-top: 8px;
}

.product-card {
  padding: 12px;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--mall-shadow-md);
}

.product-image {
  height: 180px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--mall-surface-soft);
  display: block;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 12px 4px 0;
}

.product-category {
  display: inline-block;
  padding: 4px 9px;
  border-radius: 999px;
  background: #efe6ff;
  color: var(--mall-primary);
  font-size: 11px;
  font-weight: 800;
}

.product-info h4 {
  min-height: 38px;
  margin: 11px 0 6px;
  color: var(--mall-text);
  font-size: 15px;
  line-height: 1.25;
}

.product-description {
  height: 34px;
  margin: 0 0 8px;
  color: var(--mall-text-muted);
  font-size: 12px;
  line-height: 1.4;
  overflow: hidden;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--mall-text-muted);
  font-size: 12px;
}

.rating i {
  color: #ffb21e;
}

.price {
  margin: 12px 0;
  color: var(--mall-text);
  font-size: 16px;
  font-weight: 900;
}

.product-actions {
  display: grid;
  grid-template-columns: 1fr 40px;
  gap: 10px;
}

.cart-button {
  height: 38px;
  border: 1px solid var(--mall-primary);
  border-radius: 8px;
  background: #ffffff;
  color: var(--mall-primary);
  font-weight: 800;
  box-shadow: none;
}

.cart-button:hover {
  background: var(--mall-primary);
  color: #ffffff;
}

.wishlist-button {
  width: 40px;
  height: 38px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--mall-text-muted);
  font-size: 22px;
  cursor: pointer;
}

.wishlist-button:hover {
  color: var(--mall-primary);
  background: var(--mall-primary-soft);
}

.service-section {
  margin-top: 36px;
  padding: 24px 28px;
  background: linear-gradient(100deg, #fbf8ff, #ffffff);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.service-item {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 0 28px;
  border-right: 1px solid var(--mall-border);
}

.service-item:last-child {
  border-right: none;
}

.service-icon {
  width: 54px;
  height: 54px;
  border-radius: 999px;
  background: #eee6ff;
  color: var(--mall-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  font-size: 23px;
}

@media (max-width: 1240px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }

  .service-section {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 24px;
  }

  .service-item {
    border-right: none;
  }
}

@media (max-width: 860px) {
  .hero-banner,
  .home-content {
    grid-template-columns: 1fr;
  }

  .hero-image {
    min-height: 260px;
  }
}

@media (max-width: 620px) {
  .home-page {
    padding-top: 14px;
  }

  .hero-content {
    padding: 32px 24px;
  }

  .product-grid,
  .service-section {
    grid-template-columns: 1fr;
  }

  .service-item {
    padding: 0;
  }
}
</style>
