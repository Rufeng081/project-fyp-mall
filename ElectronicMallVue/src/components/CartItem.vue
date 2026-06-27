<template>
  <article class="cart-item mall-card">
    <div class="cart-time">
      <i class="el-icon-time"></i>
      <span>Added Time: {{ cart.createTime }}</span>
    </div>
    <div class="cart-body">
      <router-link :to="'/goodView/' + cart.goodId" class="cart-image">
        <img :src="baseApi + cart.img" :alt="cart.goodName" />
      </router-link>

      <div class="cart-info">
        <router-link :to="'/goodView/' + cart.goodId">
          <h3>{{ cart.goodName }}</h3>
        </router-link>
        <div class="cart-meta">
          <span>Variant: {{ cart.standard }}</span>
          <span>Unit Price: RM {{ realPrice.toFixed(2) }}</span>
          <span>Total: RM {{ totalPrice }}</span>
        </div>
      </div>

      <div class="quantity-box">
        <span>Quantity</span>
        <el-button v-if="!countChangeFlag" @click="countChangeFlag = true">
          {{ cart.count }}
        </el-button>
        <el-input-number
          v-if="countChangeFlag"
          v-model="cart.count"
          :min="1"
          :max="cart.store"
          size="small"
        ></el-input-number>
      </div>

      <div class="cart-actions">
        <el-button type="primary" @click="pay" icon="el-icon-bank-card">
          Pay
        </el-button>
        <el-popconfirm @confirm="del" title="Delete?">
          <el-button type="danger" icon="el-icon-delete" slot="reference">
            Remove
          </el-button>
        </el-popconfirm>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "CartItem",
  props: {
    cart: Object,
  },
  data() {
    return {
      baseApi: this.$store.state.baseApi,
      countChangeFlag: false,
    };
  },
  computed: {
    totalPrice: function () {
      return (this.realPrice * this.cart.count).toFixed(2);
    },
    realPrice: function () {
      return this.cart.price * this.cart.discount;
    },
  },
  methods: {
    del() {
      this.request.delete("/api/cart/" + this.cart.id).then((res) => {
        if (res.code === "200") {
          this.$message.success("Deleted successfully");
          this.$emit("delete", this.cart.id);
        }
      });
    },
    pay() {
      let good = {
        id: this.cart.goodId,
        name: this.cart.goodName,
        imgs: this.cart.img,
        discount: this.cart.discount,
      };
      this.$router.push({
        name: "preOrder",
        query: {
          good: JSON.stringify(good),
          realPrice: this.realPrice,
          num: this.cart.count,
          standard: this.cart.standard,
          cartId: this.cart.id,
        },
      });
    },
  },
};
</script>

<style scoped>
.cart-item {
  overflow: hidden;
}

.cart-time {
  min-height: 44px;
  padding: 0 20px;
  background: linear-gradient(135deg, var(--mall-primary-soft), #ffffff);
  color: var(--mall-text);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
}

.cart-body {
  padding: 18px;
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr) 140px 220px;
  align-items: center;
  gap: 18px;
}

.cart-image {
  width: 112px;
  height: 112px;
  border-radius: var(--mall-radius-md);
  background: var(--mall-surface-soft);
  overflow: hidden;
}

.cart-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-info h3 {
  margin: 0 0 10px;
  color: var(--mall-text);
  font-size: 18px;
}

.cart-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  color: var(--mall-text-muted);
  font-size: 13px;
}

.quantity-box {
  display: grid;
  gap: 8px;
}

.quantity-box span {
  color: var(--mall-text-muted);
  font-size: 12px;
  font-weight: 900;
}

.cart-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.cart-actions .el-button {
  min-height: 40px;
  border-radius: 9px;
  font-weight: 800;
}

@media (max-width: 1080px) {
  .cart-body {
    grid-template-columns: 112px minmax(0, 1fr);
  }

  .quantity-box,
  .cart-actions {
    grid-column: 2;
    justify-content: flex-start;
  }
}

@media (max-width: 620px) {
  .cart-body {
    grid-template-columns: 1fr;
  }

  .cart-image,
  .quantity-box,
  .cart-actions {
    grid-column: auto;
  }
}
</style>
