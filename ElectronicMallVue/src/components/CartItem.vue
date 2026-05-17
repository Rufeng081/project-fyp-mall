<template>
  <div>
    <div class="header" style="padding-left: 25px;">
      <span style="line-height: 40px"><b>Order Time：{{ cart.createTime }}</b></span>
    </div>
    <div class="body">
<!--      Image-->
      <div style="display: inline-block;margin-right: 20px">
        <router-link :to="'/goodView/'+cart.goodId">
          <img :src="baseApi + cart.img" style="width: 100px;height:100px">
        </router-link>
      </div>
<!--      Product Information-->
      <div style="display: inline-block;line-height: 40px" >
        <table>
          <tr>
            <th>Product</th>
            <th>Variant</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
          <tr>
            <td>
              <router-link :to="'/goodView/'+cart.goodId">{{ cart.goodName }}</router-link>
            </td>
            <td>{{cart.standard}}</td>
            <td>{{realPrice.toFixed(2)}}</td>
            <td>
              <el-button style="font-size: 15px;" @click="countChangeFlag=true" v-if="!countChangeFlag">
                {{cart.count}}
              </el-button>
              <el-input-number v-model="cart.count" :min="1" :max="cart.store" v-if="countChangeFlag" style="width: 120px" ></el-input-number>
              </td>
            <td>{{totalPrice}}</td>
            <td>
              <el-button type="success" @click="pay" icon="el-icon-a-07">
                Pay
              </el-button>
              <el-popconfirm
                  @confirm="del"
                  title="Delete?"
              >
                <el-button type="danger" icon="el-icon-a-022" slot="reference">
                  Remove
                </el-button>
              </el-popconfirm>
            </td>
          </tr>
        </table>
      </div>
    </div>



  </div>
</template>

<script>
export default {
  name: "CartItem",
  props:{
    cart: Object,
    countChangeFlag: false,
  },
  created() {
    
  },
  data(){
    return{

      baseApi: this.$store.state.baseApi,
    }
  },
  computed:{
    totalPrice:function () {
      return (this.realPrice * this.cart.count).toFixed(2)
    },
    realPrice: function (){
      return (this.cart.price * this.cart.discount)
    }
  },
  methods:{
    //Remove from cart
    del(id){
      this.request.delete("/api/cart/"+this.cart.id).then(res=>{
        if(res.code==='200'){
          this.$message.success("Deleted successfully")
          this.$emit('delete',this.cart.id)
        }
      })
    },
    //Navigate to payment page
    pay(){
      let good = {id: this.cart.goodId,name: this.cart.goodName,imgs: this.cart.img,discount: this.cart.discount}
      this.$router.push({name: 'preOrder',query: {good: JSON.stringify(good), realPrice: this.realPrice, num: this.cart.count, standard: this.cart.standard, cartId: this.cart.id}})
    },
  }
}
</script>

<style scoped>
.header{
  background-color: #daf3ff;
  height: 40px;
  border-radius: 25px 25px 0 0;
}
.body{
  background-color: white;
  padding: 20px;
  border-radius: 0 0 25px 25px;
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
