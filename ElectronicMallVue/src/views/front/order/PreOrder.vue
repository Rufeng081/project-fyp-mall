<template>
  <div style="margin-top: 10px; width: 90%; margin: 10px auto">
    <div style="background-color: white; padding: 10px; border-radius: 12px">
      <!--Delivery Address-->
      <div
        style="
          padding: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
        "
      >
        <div
          style="
            font-size: 20px;
            border-bottom: 2px solid dodgerblue;
            padding-bottom: 10px;
            margin-bottom: 20px;
          "
        >
          Delivery Address
          <el-button style="height: 25px; padding: 5px" @click="addAddress"
            >+</el-button
          >
        </div>
        <template v-for="(item, index) in addressData">
          <address-box
            :address="item"
            :key="index"
            :class="index === checkedIndex ? 'active' : ' '"
            style="margin-right: 20px;cursor:pointer;"
            @edit="editAddress(item)"
            @delete="deleteAddress(item)"
            @click.native="select(index)"
          ></address-box>
        </template>
      </div>
      <!--      AddressDialog-->
      <el-dialog title="Address Information" :visible.sync="dialogFormVisible">
        <el-form label-width="90px" style="padding: 0 60px">
          <el-form-item label="Full Name">
            <el-input v-model="address.linkUser" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Phone Number">
            <el-input v-model="address.linkPhone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Address">
            <el-input
              v-model="address.linkAddress"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveAddress">Confirm</el-button>
        </div>
      </el-dialog>

      <!--        Product confirmation-->
      <el-table :data="goods" stripe style="width: 100%">
        <el-table-column label="Product Image" width="150">
          <template slot-scope="scope">
            <el-image
              :src="baseApi + scope.row.imgs"
              style="width: 100px; height: 100px"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Product Name"></el-table-column>
        <el-table-column prop="standard" label="Variant"></el-table-column>
        <el-table-column label="Unit Price">
          <template slot-scope="scope">
            {{ Number(scope.row.realPrice).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="num" label="Quantity"></el-table-column>
        <el-table-column label="Price">
          <template slot-scope="scope">
            {{ (scope.row.realPrice * scope.row.num).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 10px">
        <div style="background-color: white; padding: 10px">
          <div style="color: red; text-align: right">
            <div>
              <span>Total:</span>
              <span> RM {{ sumPrice }}</span>
            </div>
            <div style="text-align: right; color: #999; font-size: 12px">
              Discount: RM {{ sumDiscount }}
            </div>
            <div style="padding: 10px 0">
              <el-button
                style="background-color: red; color: white; width: 100px"
                @click="submitOrder"
                >Place Order</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
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
      //Temporary address data
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
      console.log(index);
      this.checkedIndex = index;
    },
    addAddress() {
      this.address = {};
      this.dialogFormVisible = true;
    },
    editAddress(item) {
      //Deep copy
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
            console.log("address" + this.addressData);
          }
        });
      });
    },

    submitOrder() {
      let address = this.addressData[this.checkedIndex];
      console.log(address);
      if (!address) {
        this.$message({
          type: "warning",
          message: "Please select a delivery address!",
        });
        return;
      }
      console.log(JSON.stringify(this.good));
      // Place Order
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
          //Navigate to payment page
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
.active {
  border: black 5px solid;
}
</style>
