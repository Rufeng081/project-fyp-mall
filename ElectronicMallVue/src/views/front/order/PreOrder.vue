<template>
  <div class="checkout-page mall-page">
    <section class="checkout-heading">
      <span class="eyebrow">Checkout</span>
      <h2>Confirm delivery and payment details</h2>
      <div class="checkout-steps">
        <span class="active">Address</span>
        <span class="active">Review</span>
        <span>Payment</span>
      </div>
    </section>

    <section class="checkout-layout">
      <div class="checkout-main">
        <section class="checkout-card mall-card">
          <div class="card-header">
            <h3>Delivery Address</h3>
            <el-button size="mini" type="primary" @click="addAddress">
              <i class="el-icon-plus"></i>
              Add
            </el-button>
          </div>
          <div class="address-list">
            <address-box
              v-for="(item, index) in addressData"
              :address="item"
              :key="index"
              :class="index === checkedIndex ? 'active' : ''"
              @edit="editAddress(item)"
              @delete="deleteAddress(item)"
              @click.native="select(index)"
            ></address-box>
          </div>
        </section>

        <section class="checkout-card mall-card">
          <div class="card-header">
            <h3>Order Items</h3>
          </div>
          <el-table :data="goods" stripe style="width: 100%">
            <el-table-column label="Product" min-width="220">
              <template slot-scope="scope">
                <div class="product-cell">
                  <el-image
                    :src="baseApi + scope.row.imgs"
                    class="product-thumb"
                    fit="cover"
                  ></el-image>
                  <span>{{ scope.row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="standard" label="Variant"></el-table-column>
            <el-table-column label="Unit Price">
              <template slot-scope="scope">
                RM {{ Number(scope.row.realPrice).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="num" label="Qty" width="80"></el-table-column>
            <el-table-column label="Price">
              <template slot-scope="scope">
                RM {{ (scope.row.realPrice * scope.row.num).toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>
        </section>
      </div>

      <aside class="order-summary mall-card">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Total</span>
          <strong>RM {{ sumPrice }}</strong>
        </div>
        <div class="summary-row">
          <span>Discount</span>
          <strong>RM {{ sumDiscount }}</strong>
        </div>
        <el-button type="primary" @click="submitOrder">Place Order</el-button>
      </aside>
    </section>

    <el-dialog title="Address Information" :visible.sync="dialogFormVisible">
      <el-form label-width="110px" class="address-form">
        <el-form-item label="Full Name">
          <el-input v-model="address.linkUser" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Phone Number">
          <el-input v-model="address.linkPhone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Address">
          <el-input v-model="address.linkAddress" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveAddress">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from "@/utils/request";
import addressBox from "@/components/AddressBox";
export default {
  name: "cart",
  data() {
    return {
      baseApi: this.$store.state.baseApi,
      userId: 0,
      addressData: [],
      address: {},
      checkedIndex: 0,
      dialogFormVisible: false,
      good: {},
      realPrice: -1,
      goods: [],
      cartId: "",
    };
  },
  components: {
    "address-box": addressBox,
  },
  created() {
    this.loadAddress();

    this.good = JSON.parse(this.$route.query.good);
    this.good.realPrice = this.$route.query.realPrice;
    this.good.num = this.$route.query.num;
    this.good.standard = this.$route.query.standard;
    this.cartId = this.$route.query.cartId;
    this.goods.push(this.good);
  },
  computed: {
    sumPrice: function () {
      let sum = 0;
      this.goods.forEach(function (good) {
        sum += good.realPrice * good.num;
      });
      return sum.toFixed(2);
    },
    sumDiscount: function () {
      let sum = 0;
      this.goods.forEach(function (good) {
        sum += (good.realPrice / good.discount - good.realPrice) * good.num;
      });
      return sum.toFixed(2);
    },
  },
  methods: {
    select(index) {
      this.checkedIndex = index;
    },
    addAddress() {
      this.address = {};
      this.dialogFormVisible = true;
    },
    editAddress(item) {
      this.address = JSON.parse(JSON.stringify(item));
      this.dialogFormVisible = true;
    },
    deleteAddress(item) {
      this.$confirm("Delete this address?", "Notice", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        API.delete("api/address/" + item.id).then((res) => {
          if (res.code === "200") {
            this.$message.success("Address deleted successfully");
            this.loadAddress();
          }
        });
      });
    },
    saveAddress() {
      this.address.userId = this.userId;
      API.post("/api/address", this.address).then((res) => {
        if (res.code === "200") {
          this.$message.success("Saved successfully");
          this.loadAddress();
          this.dialogFormVisible = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    loadAddress() {
      API.get("/userid").then((res) => {
        this.userId = res;
        API.get("/api/address/" + res).then((res) => {
          if (res.code === "200") {
            this.addressData = res.data;
          }
        });
      });
    },

    submitOrder() {
      let address = this.addressData[this.checkedIndex];
      if (!address) {
        this.$message({
          type: "warning",
          message: "Please select a delivery address!",
        });
        return;
      }
      API.post("/api/order", {
        totalPrice: this.sumPrice,
        linkUser: address.linkUser,
        linkPhone: address.linkPhone,
        linkAddress: address.linkAddress,
        state: "Pending Payment",
        goods: JSON.stringify(this.goods),
        cartId: this.cartId,
      }).then((res) => {
        if (res.code === "200") {
          let orderNo = res.data;
          this.$router.replace({
            path: "pay",
            query: { money: this.sumPrice, orderNo: orderNo },
          });
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.checkout-page {
  padding: 30px 0 42px;
}

.checkout-heading {
  margin-bottom: 22px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.eyebrow {
  color: var(--mall-primary);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.checkout-heading h2 {
  margin: 8px 0 0;
  color: var(--mall-text);
  font-size: 32px;
}

.checkout-steps {
  display: flex;
  gap: 8px;
}

.checkout-steps span {
  padding: 8px 12px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid var(--mall-border);
  color: var(--mall-text-muted);
  font-size: 12px;
  font-weight: 900;
}

.checkout-steps .active {
  background: var(--mall-primary-soft);
  color: var(--mall-primary);
}

.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
}

.checkout-main {
  display: grid;
  gap: 20px;
}

.checkout-card {
  padding: 22px;
}

.card-header {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.card-header h3,
.order-summary h3 {
  margin: 0;
  color: var(--mall-text);
  font-size: 18px;
}

.address-list {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.active {
  border: 2px solid var(--mall-primary) !important;
  box-shadow: 0 0 0 4px rgba(91, 43, 214, 0.1);
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-thumb {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  overflow: hidden;
}

.order-summary {
  align-self: start;
  padding: 22px;
  position: sticky;
  top: 98px;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--mall-border);
  color: var(--mall-text-muted);
}

.summary-row strong {
  color: var(--mall-primary);
  font-size: 20px;
}

.order-summary .el-button {
  width: 100%;
  height: 46px;
  margin-top: 22px;
  border-radius: 10px;
  font-weight: 900;
}

.address-form {
  padding-right: 24px;
}

@media (max-width: 980px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 720px) {
  .checkout-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .checkout-steps {
    flex-wrap: wrap;
  }
}
</style>
