<template>
  <div class="product-list-page mall-page">
    <search @search="handleSearch"></search>

    <section class="list-hero mall-card">
      <div>
        <span class="eyebrow">Product Catalogue</span>
        <h2>Browse R Mall products</h2>
        <p>Find lifestyle, stationery, electronics, food and campus essentials in one clean catalogue.</p>
      </div>
      <div class="catalogue-stats">
        <strong>{{ total }}</strong>
        <span>Products available</span>
      </div>
    </section>

    <section class="category-filter mall-card">
      <div class="section-header">
        <h3 class="mall-section-title">
          <i class="el-icon-menu"></i>
          Categories
        </h3>
        <button class="clear-filter" type="button" @click="clearCategory">All Products</button>
      </div>
      <div class="category-grid">
        <template v-for="(item, index) in icons">
          <button
            v-for="(category, index2) in item.categories"
            :key="index + '-' + index2"
            type="button"
            class="category-pill"
            :class="{ active: categoryId == category.id }"
            @click="load(category.id)"
          >
            <span class="category-icon">
              <i class="iconfont" v-html="item.value"></i>
            </span>
            <span>{{ category.name }}</span>
          </button>
        </template>
      </div>
    </section>

    <section class="product-results">
      <div class="section-header">
        <h3 class="mall-section-title">
          <i class="el-icon-goods"></i>
          Products
        </h3>
      </div>
      <div class="product-grid">
        <router-link
          v-for="product in good"
          :key="product.id"
          class="product-card mall-card"
          :to="'/goodView/' + product.id"
        >
          <div class="product-image">
            <img :src="baseApi + product.imgs" :alt="product.name" />
          </div>
          <div class="product-info">
            <span class="product-category">{{ categoryName(product.categoryId) }}</span>
            <h4>{{ product.name }}</h4>
            <p>{{ product.description || "A selected product prepared for the FYP mall demo." }}</p>
            <strong>RM {{ Number(product.price).toFixed(2) }}</strong>
          </div>
        </router-link>
      </div>

      <div class="pagination-card">
        <el-pagination
          background
          :hide-on-single-page="false"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="handleCurrentPage"
        >
        </el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import search from "../../../components/Search";
export default {
  name: "GoodList",
  data() {
    return {
      icons: [],
      total: 0,
      pageSize: 9,
      currentPage: 1,
      categoryId: Number,
      searchText: "",
      good: [],
      baseApi: this.$store.state.baseApi,
    };
  },
  components: {
    search,
  },
  created() {
    this.searchText = this.$route.query.searchText;
    this.categoryId = this.$route.query.categoryId;

    this.loadCategories();
    this.load();
  },
  methods: {
    loadCategories() {
      this.request.get("/api/icon").then((res) => {
        if (res.code === "200") {
          this.icons = res.data;
        }
      });
    },
    handleCurrentPage(currentPage) {
      this.currentPage = currentPage;
      this.load();
    },
    handleSearch(text) {
      this.searchText = text;
      this.currentPage = 1;
      this.load();
    },
    clearCategory() {
      this.categoryId = undefined;
      this.currentPage = 1;
      this.$router.push({ path: "/goodList" });
      this.load();
    },
    categoryName(categoryId) {
      const groups = this.icons || [];
      for (const group of groups) {
        const match = (group.categories || []).find((category) => Number(category.id) === Number(categoryId));
        if (match) {
          return match.name;
        }
      }
      return "R Mall";
    },
    load(categoryId) {
      if (categoryId != undefined) {
        this.categoryId = categoryId;
        this.currentPage = 1;

        this.$router.push({
          path: "/goodList",
          query: { categoryId: this.categoryId },
        });
      }
      this.request
        .get("/api/good/page", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            searchText: this.searchText,
            categoryId: this.categoryId,
          },
        })
        .then((res) => {
          if (res.code === "200") {
            this.total = res.data.total;
            this.good = res.data.records;
          }
        });
    },
  },
};
</script>

<style scoped>
.product-list-page {
  padding: 8px 0 36px;
}

.list-hero {
  margin-top: 22px;
  padding: 28px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background:
    radial-gradient(circle at 100% 0%, rgba(47, 191, 155, 0.15), transparent 30%),
    linear-gradient(135deg, #ffffff, #fbf8ff);
}

.eyebrow {
  display: inline-block;
  margin-bottom: 10px;
  color: var(--mall-primary);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.list-hero h2 {
  margin: 0;
  color: var(--mall-text);
  font-size: 30px;
}

.list-hero p {
  max-width: 640px;
  margin: 10px 0 0;
  color: var(--mall-text-muted);
  font-size: 15px;
  line-height: 1.6;
}

.catalogue-stats {
  min-width: 168px;
  padding: 18px;
  border-radius: var(--mall-radius-md);
  background: var(--mall-primary-soft);
  text-align: center;
}

.catalogue-stats strong {
  display: block;
  color: var(--mall-primary);
  font-size: 32px;
}

.catalogue-stats span {
  color: var(--mall-text-muted);
  font-size: 13px;
}

.category-filter {
  margin-top: 22px;
  padding: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.section-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-filter {
  min-height: 36px;
  border: none;
  border-radius: 999px;
  padding: 0 14px;
  background: var(--mall-primary-soft);
  color: var(--mall-primary);
  font-weight: 800;
  cursor: pointer;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-pill {
  min-height: 44px;
  border: 1px solid var(--mall-border);
  border-radius: 999px;
  padding: 0 16px 0 8px;
  background: #ffffff;
  color: var(--mall-text);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.category-pill:hover,
.category-pill.active {
  border-color: var(--mall-primary);
  color: var(--mall-primary);
  transform: translateY(-2px);
}

.category-icon {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: var(--mall-primary-soft);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.product-results {
  margin-top: 24px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 22px;
}

.product-card {
  min-height: 392px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--mall-shadow-md);
}

.product-image {
  height: 220px;
  border-radius: 10px;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.78), transparent 46%),
    linear-gradient(135deg, #f8f3ea, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 14px;
  box-sizing: border-box;
}

.product-info {
  padding: 14px 4px 4px;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.product-category {
  align-self: flex-start;
  padding: 4px 9px;
  border-radius: 999px;
  background: var(--mall-primary-soft);
  color: var(--mall-primary);
  font-size: 11px;
  font-weight: 900;
}

.product-info h4 {
  min-height: 40px;
  margin: 12px 0 8px;
  color: var(--mall-text);
  font-size: 17px;
  line-height: 1.25;
}

.product-info p {
  height: 40px;
  margin: 0;
  color: var(--mall-text-muted);
  font-size: 13px;
  line-height: 1.5;
  overflow: hidden;
}

.product-info strong {
  margin-top: auto;
  padding-top: 14px;
  color: var(--mall-text);
  font-size: 18px;
}

.pagination-card {
  margin-top: 28px;
  text-align: center;
}

@media (max-width: 980px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }

  .list-hero {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 620px) {
  .product-grid {
    grid-template-columns: 1fr;
  }

  .list-hero,
  .category-filter {
    padding: 20px;
  }
}
</style>
