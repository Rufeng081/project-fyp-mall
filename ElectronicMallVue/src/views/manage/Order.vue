<template>
  <div>
    <div>
      <el-select v-model="searchMode" placeholder="Select order status" style="width: 150px;margin-right: 10px">
        <el-option value="Paid" label="Paid"></el-option>
        <el-option value="Shipped" label="Shipped"></el-option>
        <el-option value="Received" label="Received"></el-option>
      </el-select>
      <el-input v-model="searchText" @keyup.enter.native="load" style="width: 200px"> <i slot="prefix" class="el-input__icon el-icon-a-042"></i></el-input>
      <el-button @click="reset" type="warning" style="margin: 10px">
        <i class="el-icon-a-031"></i>
        Reset
      </el-button>
      <el-button @click="load" type="primary" style="margin: 10px">
        <i class="el-icon-a-042"></i>
        Search
      </el-button>
    </div>
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="50" sortable> </el-table-column>
      <el-table-column prop="orderNo" label="Order No." width="200"></el-table-column>
      <el-table-column prop="totalPrice" label="Total" width="100"></el-table-column>
      <el-table-column prop="userId" label="User ID" width="100"></el-table-column>
      <el-table-column prop="linkUser" label="Full Name" width="150"></el-table-column>
      <el-table-column prop="linkPhone" label="Phone Number"></el-table-column>
      <el-table-column prop="linkAddress" label="Delivery Address" width="300"></el-table-column>
      <el-table-column prop="state" label="Status" width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.state==='Paid'">{{scope.row.state}}</el-tag>
          <el-tag type="primary" v-if="scope.row.state==='Shipped'">{{scope.row.state}}</el-tag>
          <el-tag type="info" v-if="scope.row.state==='Received'">{{scope.row.state}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="Order Time"></el-table-column>
      <el-table-column
          fixed="right"
          label="Actions"
          width="250">
        <template slot-scope="scope">
          <el-button type="primary" style="font-size: 15px;"  @click="showDetail(scope.row)">
            <i class="el-icon-a-042"></i>
            Details
          </el-button>
          <el-popconfirm
              @confirm="delivery(scope.row)"
              title="Ship this order?"
              v-if="scope.row.state==='Paid'"
          >
            <el-button type="primary" style="font-size: 15px;margin-left: 10px;" slot="reference">
              <i class="el-icon-a-07"></i>
              Ship
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
<!--    Pagination-->
    <div style="margin-top: 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        :page-sizes="[3, 5, 8, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
<!--    DetailsDialog-->
    <el-dialog :visible.sync="dialogFormVisible">
      <el-table :data="detail" background-color="black" >
        <el-table-column  label="Image" width="150" >
          <template   slot-scope="scope">
            <img :src="baseApi + scope.row.img"  min-width="100" height="100" />
          </template>
        </el-table-column>

        <el-table-column prop="goodId" label="Product ID"  ></el-table-column>
        <el-table-column prop="goodName" label="Product Name"  ></el-table-column>
        <el-table-column prop="standard" label="Product Variant"  ></el-table-column>
        <el-table-column prop="price" label="Unit Price"  ></el-table-column>
        <el-table-column prop="discount" label="Discount"></el-table-column>
        <el-table-column label="Actual Price" >
          <template slot-scope="scope">
            {{scope.row.price * scope.row.discount}}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="Quantity" ></el-table-column>
        <el-table-column label="Total" >
          <template slot-scope="scope">
            {{scope.row.price * scope.row.discount * scope.row.count }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import API from '../../utils/request'
const url = "/api/order/"

export default {
  name: "Order",
  data() {
    return {
      options: [],
      searchMode: '',
      searchText: '',
      user: {},
      tableData: [],
      pageNum: 1,
      pageSize: 8,
      entity: {},
      total: 0,
      dialogFormVisible: false,
      detail:[],
      baseApi: this.$store.state.baseApi,
    };
  },
  created() {
    this.load()
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()
    },
    reset(){
      this.searchMode = '';
      this.searchText = '';
      this.load()
    },
    load() {
       API.get(url + "/page", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            orderNo: this.searchText,
            state: this.searchMode
          }
       }).then(res => {
          this.tableData = res.data.records || []
          this.total = res.data.total
       })
    },
    showDetail(row){
        this.request.get("/api/order/orderNo/"+row.orderNo).then(res=>{
          if(res.code==='200'){
            this.detail=[];
            this.detail.push(res.data);
            this.dialogFormVisible = true;
          }
        })
    },
    //Ship
    delivery(order){
        this.request.get("/api/order/delivery/"+order.orderNo).then(res=>{
          if(res.code==='200'){
            this.$message.success("Shipped successfully");
            order.state = 'Shipped'
          }
        })
    },

  },
};
</script>

<style scoped>
</style>
