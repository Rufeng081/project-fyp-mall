<template>
  <div class="orders-page mall-page">
    <section class="orders-heading">
      <div>
        <span class="eyebrow">Order History</span>
        <h2>Track your Rufeng Mall orders</h2>
      </div>
      <div class="summary-pill">
        <strong>{{ orders.length }}</strong>
        <span>Total orders</span>
      </div>
    </section>

    <div v-if="orders.length === 0" class="empty-box mall-card">
      <div class="empty-icon"><i class="el-icon-document"></i></div>
      <h3>No order records</h3>
      <p>Your completed checkout records will appear here.</p>
    </div>

    <section v-else class="order-list">
      <order-item v-for="order in orders" :order="order" :key="order.id"></order-item>
    </section>
  </div>
</template>

<script>
import OrderItem from "@/components/OrderItem";
import API from "@/utils/request";
export default {
  name: "OrderList",
  components: {
    "order-item": OrderItem,
  },
  data() {
    return {
      orders: [],
    };
  },
  created() {
    API.get("/userid").then((res) => {
      API.get("/api/order/userid/" + res).then((res) => {
        if (res.code === "200") {
          this.orders = res.data;
          for (var i = 0; i < this.orders.length; ++i) {
            this.orders[i].create_time = this.orders[i].create_time
              .toLocaleString()
              .replace(/T/g, " ")
              .replace(/\.[\d]{3}Z/, "");
          }
        }
      });
    });
  },
};
</script>

<style scoped>
.orders-page {
  padding: 30px 0 42px;
}

.orders-heading {
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

.orders-heading h2 {
  margin: 8px 0 0;
  color: var(--mall-text);
  font-size: 32px;
}

.summary-pill {
  min-width: 150px;
  padding: 16px;
  border-radius: var(--mall-radius-md);
  background: var(--mall-primary-soft);
  text-align: center;
}

.summary-pill strong {
  display: block;
  color: var(--mall-primary);
  font-size: 28px;
}

.summary-pill span {
  color: var(--mall-text-muted);
  font-size: 13px;
}

.order-list {
  display: grid;
  gap: 16px;
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

.empty-box p {
  color: var(--mall-text-muted);
}

@media (max-width: 620px) {
  .orders-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
