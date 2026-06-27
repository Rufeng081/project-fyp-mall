<template>
  <div class="cart-page mall-page">
    <section class="page-heading">
      <div>
        <span class="eyebrow">Shopping Cart</span>
        <h2>Review your selected products</h2>
      </div>
      <div class="summary-pill">
        <strong>RM {{ cartSubtotal }}</strong>
        <span>Current subtotal</span>
      </div>
    </section>

    <div v-if="carts.length === 0" class="empty-box mall-card">
      <div class="empty-icon"><i class="el-icon-shopping-cart-2"></i></div>
      <h3>Your cart is empty</h3>
      <p>Browse products and add items before checkout.</p>
      <el-button type="primary" @click="$router.push('/goodList')">Start Shopping</el-button>
    </div>

    <div v-else class="cart-layout">
      <section class="cart-items">
        <cart-item
          v-for="cart in carts"
          :cart="cart"
          @delete="delItem"
          :key="cart.id"
        ></cart-item>
      </section>

      <aside class="cart-summary mall-card">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Items</span>
          <strong>{{ carts.length }}</strong>
        </div>
        <div class="summary-row total">
          <span>Subtotal</span>
          <strong>RM {{ cartSubtotal }}</strong>
        </div>
        <p>Select Pay on an item to continue with the existing checkout flow.</p>
      </aside>
    </div>
  </div>
</template>

<script>
import CartItem from "@/components/CartItem";
export default {
  name: "Cart",
  data() {
    return {
      userId: Number,
      carts: [],
    };
  },
  components: {
    "cart-item": CartItem,
  },
  computed: {
    cartSubtotal() {
      return this.carts
        .reduce((sum, cart) => sum + cart.price * cart.discount * cart.count, 0)
        .toFixed(2);
    },
  },
  created() {
    this.request.get("/userid").then((res) => {
      this.userId = res;
      this.request.get("/api/cart/userid/" + this.userId).then((res) => {
        if (res.code === "200") {
          this.carts = res.data;
          for (var i = 0; i < this.carts.length; ++i) {
            this.carts[i].createTime = this.carts[i].createTime
              .toLocaleString()
              .replace(/T/g, " ")
              .replace(/\.[\d]{3}Z/, "");
          }
        }
      });
    });
  },
  methods: {
    delItem(id) {
      this.carts = this.carts.filter((item) => item.id != id);
    },
  },
};
</script>

<style scoped>
.cart-page {
  padding: 30px 0 42px;
}

.page-heading {
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.eyebrow {
  color: var(--mall-primary);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.page-heading h2 {
  margin: 8px 0 0;
  color: var(--mall-text);
  font-size: 32px;
}

.summary-pill {
  min-width: 190px;
  padding: 16px;
  border-radius: var(--mall-radius-md);
  background: var(--mall-primary-soft);
  text-align: right;
}

.summary-pill strong {
  display: block;
  color: var(--mall-primary);
  font-size: 24px;
}

.summary-pill span {
  color: var(--mall-text-muted);
  font-size: 13px;
}

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 24px;
}

.cart-items {
  display: grid;
  gap: 16px;
}

.cart-summary {
  align-self: start;
  padding: 22px;
  position: sticky;
  top: 98px;
}

.cart-summary h3 {
  margin: 0 0 18px;
  font-size: 18px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--mall-border);
  color: var(--mall-text-muted);
}

.summary-row strong {
  color: var(--mall-text);
}

.summary-row.total strong {
  color: var(--mall-primary);
}

.cart-summary p,
.empty-box p {
  color: var(--mall-text-muted);
  line-height: 1.6;
}

.empty-box {
  padding: 64px 24px;
  text-align: center;
}

.empty-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 18px;
  border-radius: 999px;
  background: var(--mall-primary-soft);
  color: var(--mall-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.empty-box h3 {
  margin: 0;
  font-size: 28px;
}

@media (max-width: 940px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 620px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .summary-pill {
    width: 100%;
    text-align: left;
  }
}
</style>
