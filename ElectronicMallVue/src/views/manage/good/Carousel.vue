<template>
  <div>
    <div>
      <el-table :data="tableData" border stripe style="width: 80%;margin: 2px auto">
        <el-table-column label="Product">
          <template slot-scope="scope">
            <a :href="'/goodView/'+scope.row.goodId">{{scope.row.goodName}}</a>
          </template>
        </el-table-column>
        <el-table-column  label="Image" >
          <template   slot-scope="scope">
            <img :src="baseApi + scope.row.img" width="300" height="185" />
          </template>
        </el-table-column>
        <el-table-column prop="showOrder" label="Carousel Order"></el-table-column>

        <el-table-column
            fixed="right"
            label="Actions"
            width="250">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-a-032"  @click="edit(scope.row)">Edit</el-button>
            <el-popconfirm
                @confirm="del(scope.row.id)"
                title="Delete?"
            >
              <el-button type="danger" icon="el-icon-a-022" slot="reference" style="margin-left: 10px">Delete</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
<!--Add button-->
    <div style="text-align: center">
      <el-button @click="add" type="primary" style="margin: 30px;width: 150px; font-size: 20px;">
        <i class="el-icon-a-07"></i>
        Add
      </el-button>
    </div>
    <!-- Dialog   -->

    <el-dialog title="Information" :visible.sync="dialogFormVisible" width="30%"
               :close-on-click-modal="false">
      <el-form :model="entity">
        <el-form-item label="Product ID" label-width="150px">
          <el-input v-model="entity.goodId" autocomplete="off" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="Carousel Order" label-width="150px">
<!--          <el-input v-model="entity.showOrder" autocomplete="off" style="width: 80%"></el-input>-->
          <el-select v-model="entity.showOrder">
            <el-option v-for="index in tableData.length" :key="index" :label="index" :value="index">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="save">Confirm</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import API from '../../../utils/request'
const url = "/api/carousel/"

export default {
  name: "Carousel",
  data() {
    return {
      baseApi: this.$store.state.baseApi,
      options: [],
      searchText: '',
      user: {},
      tableData: [],
      pageNum: 1,
      pageSize: 5,
      entity: {},
      total: 0,
      dialogFormVisible: false
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
    load() {
      API.get(url).then(res => {
        this.tableData = res.data || []
      })
    },
    add() {
      this.entity = {}
      this.tableData.length++;
      this.dialogFormVisible = true
    },
    edit(row) {
      this.entity = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    save() {
      if(this.entity.goodId == undefined || this.entity.goodId === "") {
          this.$message.error("Product ID is required")
          return;
      }
      if(this.entity.showOrder == undefined) {
          this.$message.error("Carousel order is required")
          return;
      }

      API.post(url, this.entity).then(res => {
        if (res.code === '200') {
          this.$message.success("Saved successfully")
          this.load()
          this.dialogFormVisible = false
        } else {
          this.$message.error(res.msg)
        }

      })
    },
    del(id) {
      API.delete(url + id).then(res => {
        if(res.code==='200'){
          this.$message({
            type: "success",
            message: "Deleted successfully",
          });
          this.load();
        }else {
          this.$message.error(res.msg);
        }
      })
    }
  },
};
</script>

<style scoped>
</style>
