<template>
  <div class="product-detail-page mall-page">
    <section class="detail-card mall-card">
      <div class="image-container">
        <img :src="baseApi + good.imgs" :alt="good.name" />
      </div>

      <div class="detail-box">
        <span class="product-badge">Rufeng Mall Selection</span>
        <h2>{{ good.name }}</h2>
        <p class="description">
          {{ good.description || "A selected product prepared for the FYP mall demonstration." }}
        </p>

        <div class="price-box" v-if="good.discount < 1">
          <div class="price-row muted">
            <span>Original Price</span>
            <strong class="line-through">RM {{ price }}</strong>
          </div>
          <div class="price-row">
            <span>Discount</span>
            <strong>{{ discount }}</strong>
          </div>
          <div class="price-row sale">
            <span>Sale Price</span>
            <strong>RM {{ realPrice }}</strong>
          </div>
        </div>
        <div class="price-box" v-if="good.discount === 1">
          <div class="price-row sale">
            <span>Price</span>
            <strong>RM {{ price }}</strong>
          </div>
        </div>

        <div class="meta-grid">
          <div>
            <span>Monthly Sales</span>
            <strong>{{ good.sales || 0 }}</strong>
          </div>
          <div v-if="showStore">
            <span>Stock</span>
            <strong>{{ store }}</strong>
          </div>
        </div>

        <div class="option-section" v-if="standards.length !== 0">
          <label>Choose Variant</label>
          <el-radio-group
            v-for="(standard, index) in standards"
            v-model="checkedStandard"
            @change="change(standard)"
            :key="index"
          >
            <el-radio-button class="standard" :label="standard.value"></el-radio-button>
          </el-radio-group>
        </div>

        <div class="option-section">
          <label>Quantity</label>
          <el-input-number
            v-model="count"
            controls-position="right"
            :min="1"
            :max="store"
          ></el-input-number>
        </div>

        <div class="action-row">
          <el-button type="primary" @click="goToOrder">Buy Now</el-button>
          <el-button type="success" @click="addToCart" icon="el-icon-shopping-cart-1">
            Add to Cart
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "GoodView",
  data() {
    return {
      baseApi: this.$store.state.baseApi,
      good: {},
      goodId: Number,
      price: -1,
      isDiscount: false,
      discount: "",
      standards: [],
      checkedStandard: "",
      store: 0,
      showStore: false,
      count: 1,
    };
  },
  methods: {
    getPriceRange(standards) {
      let arr = standards.map((item) => {
        return item.price;
      });
      for (let i = 0; i < arr.length; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[j] < arr[min]) {
            min = j;
          }
        }
        [arr[i], arr[min]] = [arr[min], arr[i]];
      }
      if (arr[0] === arr[arr.length - 1]) {
        return arr[0];
      } else {
        return arr[0] + " ~ " + arr[arr.length - 1];
      }
    },
    change(standard) {
      this.showStore = true;
      this.price = standard.price;
      this.store = standard.store;
    },
    goToOrder() {
      if (this.standards.length !== 0) {
        if (this.checkedStandard === "") {
          this.$message.warning("Please select a variant");
          return false;
        }
      }
      this.$router.push({
        name: "preOrder",
        query: {
          good: JSON.stringify(this.good),
          realPrice: this.realPrice,
          num: this.count,
          standard: this.checkedStandard,
        },
      });
    },
    addToCart() {
      if (!localStorage.getItem("user")) {
        this.$router.push("/login");
        return false;
      }
      if (!this.checkedStandard) {
        this.$message.error("Please select a variant");
        return false;
      }
      this.request.get("/userid").then((res) => {
        let userId = res;
        let cart = {
          userId: userId,
          goodId: this.goodId,
          standard: this.checkedStandard,
          count: this.count,
        };
        this.request.post("/api/cart", cart).then((res) => {
          if (res.code === "200") {
            this.$message.success("Added to cart successfully");
          }
        });
      });
    },
  },

  created() {
    this.goodId = this.$route.params.goodId;
    this.request.get("/api/good/" + this.goodId).then((res) => {
      if (res.code === "200") {
        this.good = res.data;
        let discount = this.good.discount;
        if (discount < 1) {
          this.isDiscount = true;
          this.discount = (discount * 100).toFixed(0) + "% of original price";
        }
      } else {
        this.$router.go(0);
      }
    });
    this.request.get("/api/good/standard/" + this.goodId).then((res) => {
      if (res.code === "200") {
        let standards = JSON.parse(res.data);
        this.standards = standards;
        this.price = this.getPriceRange(standards);
      } else {
        this.price = this.good.price;
        this.store = this.good.store;
        this.showStore = true;
      }
    });
  },
  computed: {
    realPrice: function () {
      if (this.good.discount < 1) {
        if (isNaN(this.price)) {
          let prices = this.price.split(" ~ ");
          let down = Number(prices[0]) * this.good.discount;
          let up = Number(prices[1]) * this.good.discount;
          return down.toFixed(2) + " ~ " + up.toFixed(2);
        } else {
          return (this.price * this.good.discount).toFixed(2);
        }
      }
      return this.price;
    },
  },
};
</script>

<style scoped>
.product-detail-page {
  padding: 28px 0 42px;
}

.detail-card {
  padding: clamp(20px, 3vw, 36px);
  display: grid;
  grid-template-columns: minmax(320px, 48%) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 56px);
  align-items: center;
}

.image-container {
  aspect-ratio: 1 / 1;
  border-radius: var(--mall-radius-lg);
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 20%, rgba(91, 43, 214, 0.12), transparent 26%),
    var(--mall-surface-soft);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-box {
  min-width: 0;
}

.product-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--mall-primary-soft);
  color: var(--mall-primary);
  font-size: 12px;
  font-weight: 900;
}

.detail-box h2 {
  margin: 16px 0 10px;
  color: var(--mall-text);
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1.08;
}

.description {
  margin: 0;
  color: var(--mall-text-muted);
  font-size: 16px;
  line-height: 1.7;
}

.price-box {
  margin-top: 28px;
  padding: 18px;
  border-radius: var(--mall-radius-md);
  background: linear-gradient(135deg, #fbf8ff, #fffaf4);
  border: 1px solid var(--mall-border);
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  color: var(--mall-text);
  line-height: 1.6;
}

.price-row span {
  color: var(--mall-text-muted);
  font-size: 14px;
}

.price-row strong {
  font-size: 17px;
}

.price-row.sale strong {
  color: var(--mall-primary);
  font-size: 30px;
}

.line-through {
  text-decoration: line-through;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.meta-grid div {
  padding: 14px;
  border-radius: var(--mall-radius-md);
  background: #ffffff;
  border: 1px solid var(--mall-border);
}

.meta-grid span,
.option-section label {
  display: block;
  color: var(--mall-text-muted);
  font-size: 13px;
  font-weight: 800;
}

.meta-grid strong {
  display: block;
  margin-top: 6px;
  color: var(--mall-text);
  font-size: 20px;
}

.option-section {
  margin-top: 22px;
}

.option-section label {
  margin-bottom: 10px;
}

.standard {
  margin: 0 10px 10px 0;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.action-row .el-button {
  min-width: 150px;
  height: 46px;
  border-radius: 10px;
  font-weight: 900;
}

@media (max-width: 860px) {
  .detail-card {
    grid-template-columns: 1fr;
  }
}
</style>
