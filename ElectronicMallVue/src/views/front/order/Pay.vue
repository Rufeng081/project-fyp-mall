<template>
  <div class="payment-page mall-page">
    <section class="payment-card mall-card">
      <div class="payment-icon">
        <i class="el-icon-bank-card"></i>
      </div>
      <span class="eyebrow">Simulated Payment</span>
      <h2>Confirm your payment</h2>

      <div class="payment-details">
        <div>
          <span>Order No.</span>
          <strong>{{ orderNo }}</strong>
        </div>
        <div>
          <span>Amount</span>
          <strong>RM {{ money }}</strong>
        </div>
      </div>

      <el-button type="primary" @click="pay">
        Complete Simulated Payment
      </el-button>
    </section>
  </div>
</template>

<script>
export default {
  name: "Pay",
  data() {
    return {
      userId: 0,
      money: "0.00",
      orderNo: "",
    };
  },
  created() {
    this.money = parseFloat(this.$route.query.money).toFixed(2);
    this.orderNo = this.$route.query.orderNo;
  },

  methods: {
    pay() {
      this.request.get("/api/order/paid/" + this.orderNo).then((res) => {
        if (res.code === "200") {
          alert("Payment successful: RM " + this.money);
          this.$router.replace({ name: "orderList" });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style scoped>
.payment-page {
  min-height: calc(100vh - 120px);
  padding: 48px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-card {
  width: min(520px, 100%);
  padding: 34px;
  text-align: center;
}

.payment-icon {
  width: 76px;
  height: 76px;
  margin: 0 auto 18px;
  border-radius: 999px;
  background: var(--mall-primary-soft);
  color: var(--mall-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
}

.eyebrow {
  color: var(--mall-primary);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.payment-card h2 {
  margin: 8px 0 24px;
  color: var(--mall-text);
  font-size: 30px;
}

.payment-details {
  display: grid;
  gap: 12px;
  margin-bottom: 26px;
  text-align: left;
}

.payment-details div {
  padding: 14px;
  border-radius: var(--mall-radius-md);
  background: #fbf8ff;
  border: 1px solid var(--mall-border);
}

.payment-details span {
  display: block;
  color: var(--mall-text-muted);
  font-size: 12px;
  font-weight: 900;
}

.payment-details strong {
  display: block;
  margin-top: 6px;
  color: var(--mall-text);
  overflow-wrap: anywhere;
}

.payment-card .el-button {
  width: 100%;
  height: 46px;
  border-radius: 10px;
  font-weight: 900;
}
</style>
