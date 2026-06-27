<template>
  <article class="order-item mall-card">
    <header class="order-header">
      <div>
        <span>{{ order.create_time }}</span>
        <strong>Order No.: {{ order.order_no }}</strong>
      </div>
      <span class="status-badge" :class="statusClass">{{ order.state }}</span>
    </header>

    <div class="order-body">
      <router-link :to="'/goodView/' + order.good_id" class="order-image">
        <img :src="baseApi + order.imgs" :alt="order.good_name" />
      </router-link>

      <div class="order-info">
        <router-link :to="'/goodView/' + order.good_id">
          <h3>{{ order.good_name }}</h3>
        </router-link>
        <div class="order-meta">
          <span>Variant: {{ order.standard }}</span>
          <span>Quantity: {{ order.count }}</span>
          <span>Total: RM {{ order.total_price }}</span>
        </div>
      </div>

      <el-popover placement="bottom-start" width="220" trigger="hover" :content="address">
        <button slot="reference" class="recipient-button" type="button">
          <i class="el-icon-location-outline"></i>
          {{ order.link_user }}
        </button>
      </el-popover>

      <div class="order-actions">
        <el-button
          v-if="order.state === 'Shipped'"
          type="primary"
          @click="receive"
        >
          Confirm Receipt
        </el-button>
        <el-button
          v-else-if="order.state === 'Paid'"
          type="info"
          plain
          disabled
        >
          Waiting for shipment
        </el-button>
        <span v-else-if="order.state === 'Received'" class="received-label">
          <i class="el-icon-check"></i>
          Received
        </span>
        <el-button v-else type="primary" @click="pay">Pay Now</el-button>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "OrderItem",
  props: {
    order: Object,
  },
  data() {
    return {
      address: "Phone: " + this.order.link_phone + " Address: " + this.order.link_address,
      baseApi: this.$store.state.baseApi,
    };
  },
  computed: {
    statusClass() {
      const state = String(this.order.state || "").toLowerCase();
      if (state.includes("pending")) return "pending";
      if (state.includes("paid")) return "paid";
      if (state.includes("shipped")) return "shipped";
      if (state.includes("received") || state.includes("completed")) return "completed";
      if (state.includes("cancel")) return "cancelled";
      return "neutral";
    },
  },
  methods: {
    pay() {
      this.$router.push({
        name: "pay",
        query: { money: this.order.total_price, orderNo: this.order.order_no },
      });
    },
    receive() {
      this.$confirm("Confirm receipt?", "Notice", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "info",
      }).then(() => {
        this.request.get("/api/order/received/" + this.order.order_no).then((res) => {
          if (res.code === "200") {
            this.$message.success("Order received successfully");
            this.order.state = "Received";
          }
        });
      });
    },
  },
};
</script>

<style scoped>
.order-item {
  overflow: hidden;
}

.order-header {
  min-height: 52px;
  padding: 12px 18px;
  background: linear-gradient(135deg, #fbf8ff, #ffffff);
  border-bottom: 1px solid var(--mall-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.order-header div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  color: var(--mall-text-muted);
  font-size: 13px;
}

.order-header strong {
  color: var(--mall-text);
}

.status-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.status-badge.pending {
  background: #fff7ed;
  color: #c2410c;
}

.status-badge.paid,
.status-badge.shipped {
  background: #eaf1ff;
  color: #3159c9;
}

.status-badge.completed {
  background: var(--mall-secondary-soft);
  color: #047857;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #b91c1c;
}

.status-badge.neutral {
  background: var(--mall-primary-soft);
  color: var(--mall-primary);
}

.order-body {
  padding: 18px;
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr) 180px 210px;
  align-items: center;
  gap: 18px;
}

.order-image {
  width: 112px;
  height: 112px;
  border-radius: var(--mall-radius-md);
  background: var(--mall-surface-soft);
  overflow: hidden;
}

.order-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-info h3 {
  margin: 0 0 10px;
  color: var(--mall-text);
  font-size: 18px;
}

.order-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  color: var(--mall-text-muted);
  font-size: 13px;
}

.recipient-button {
  min-height: 40px;
  border: 1px solid var(--mall-border);
  border-radius: 999px;
  padding: 0 14px;
  background: #ffffff;
  color: var(--mall-primary);
  font-weight: 800;
  cursor: pointer;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
}

.received-label {
  color: var(--mall-success);
  font-weight: 900;
}

@media (max-width: 1120px) {
  .order-body {
    grid-template-columns: 112px minmax(0, 1fr);
  }

  .recipient-button,
  .order-actions {
    grid-column: 2;
    justify-content: flex-start;
  }
}

@media (max-width: 620px) {
  .order-header,
  .order-body {
    align-items: flex-start;
    grid-template-columns: 1fr;
  }

  .recipient-button,
  .order-actions {
    grid-column: auto;
  }
}
</style>
