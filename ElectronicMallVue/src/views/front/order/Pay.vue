<!--
 * @Description: 
 * @Author: Rabbiter
 * @Date: 2023-03-26 15:27:05
-->
<template>
<div style="margin-top: 10px;width: 50%;margin: 10px auto;background-color: white;text-align: center">
  <table style="margin: 20px auto">
    <tr>
      <th>Order No.</th>
      <td>{{orderNo}}</td>
    </tr>

    <tr>
      <th>Amount</th>
      <td>RM {{ money }}</td>
    </tr>

  </table>
  <hr style="width: 280px" />
  <div>
    <span>Payment Method:</span>
  </div>
  <br>
  <el-button type="success" style="font-size: 18px" @click="pay">
    Complete Simulated Payment
  </el-button>
</div>
</template>

<script>
export default {
  name: "Pay",
  data(){
    return{
      userId: 0,
      money1: 0,
      orderNo: '',
    }
  },
  created() {
    this.money = parseFloat(this.$route.query.money).toFixed(2);
    this.orderNo = this.$route.query.orderNo;
  },

  methods:{
    pay(){
      this.request.get("/api/order/paid/"+this.orderNo).then(res=>{
        if(res.code==='200'){
          alert("Payment successful: RM " + this.money)
          this.$router.replace({ name: "orderList" })
        }else{
          this.$message.error(res.msg)
        }
      })

    }
  }

}
</script>

<style scoped>
tr{
  line-height:40px;
}

</style>
