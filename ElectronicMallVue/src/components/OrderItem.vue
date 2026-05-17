<template>
<div>
  <div class="header" style="padding-left: 25px;">
    <span style="line-height: 40px"><b>{{order.create_time}}</b></span>
    <span style="line-height: 40px;margin-left: 30px"><b>Order No.: {{order.order_no}}</b></span>
  </div>
  <div class="body">
    <div style="display: inline-block;">
      <router-link :to="'/goodView/'+order.good_id">
        <img :src="baseApi + order.imgs" style="width: 100px;height:100px">
      </router-link>
    </div>
    <div style="display: inline-block;line-height: 40px" >
      <table>
        <tr>
          <th>Product</th>
          <th>Variant</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Recipient</th>
          <th>Order Status</th>
        </tr>
        <tr>
          <td>
            <router-link :to="'/goodView/'+order.good_id">{{order.good_name}}</router-link>
          </td>
          <td>{{order.standard}}</td>
          <td>{{order.count}}</td>
          <td>{{order.total_price}}</td>
          <el-popover
              placement="bottom-start"
              width="200"
              trigger="hover"
              :content=address>
            <td slot="reference" style="color: #42b983">{{ order.link_user }}</td>
          </el-popover>
<!--          Order Status-->
          <template v-if="order.state==='Shipped'">
            <td style="color: #42b983">{{order.state}}</td>
            <td>
              <el-button style="margin-left: 20px;font-size: 15px;" type="primary" @click="receive">Confirm Receipt</el-button>
            </td>
          </template>

          <template v-else-if="order.state==='Received'">
            <td style="color: #42b983"><a class="el-icon-check"></a>{{order.state}}</td>
          </template>

          <template v-else-if="order.state==='Paid'">
            <td style="color: #3b62f8"> {{order.state}}</td>
            <td>
              <el-button style="font-size: 15px;" type="info" plain disabled>Waiting for shipment</el-button>
            </td>
          </template>

          <template v-else>
            <td>{{order.state}}</td>
            <td>
              <el-button style="margin-left: 20px;font-size: 15px;" type="success" @click="pay">Pay Now</el-button>
            </td>
          </template>

        </tr>
      </table>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "OrderItem",
  props:{
    order: Object,
  },
  created() {
    console.log(this.order)
  },
  data(){
    return{
      address: 'Phone: '+this.order.link_phone+' Address: '+this.order.link_address,
      baseApi: this.$store.state.baseApi,
    }
  },
  methods:{
    //Navigate to payment page
    pay(){
      this.$router.push({name: 'pay', query: {money: this.order.total_price, orderNo: this.order.order_no}})
    },
    //Confirm Receipt
    receive(){

      this.$confirm('Confirm receipt?', 'Notice', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'info'
      }).then(() => {

        this.request.get("/api/order/received/"+this.order.order_no).then(res=>{
          if(res.code==='200'){
            this.$message.success("Order received successfully");
            this.order.state='Received'
          }
        })
      })

    }
  }
}
</script>

<style scoped>
.header{
  background-color: lightcoral;
  height: 40px;
  border-radius: 25px 25px 0 0;
}
.body{
  background-color: white;
  padding: 20px;
  border-radius: 0 0 25px 25px;
  margin-bottom: 10px;
}
th,td{

  width: 120px;
  text-align: center;
}
th{
  font-size: 15px;
  color: #00b7ff;
  font-weight: normal;
}
</style>
