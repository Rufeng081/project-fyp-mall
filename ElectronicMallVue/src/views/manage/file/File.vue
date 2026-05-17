<template>
  <div>
    <div class="demo-input-size">
      <el-input placeholder="Enter file name" prefix-icon="el-icon-a-042" style="width: 250px;padding-right: 5px" v-model="fileName"></el-input>
      <el-button type="primary" @click="search">
        <i class="el-icon-a-042" style="padding-right: 6px"></i>
        Search
      </el-button>
      <el-button type="danger" @click="reload">
        <i class="el-icon-a-031" style="padding-right: 6px"></i>
        Reset
      </el-button>

    </div>
    <!--          Button bar-->
    <div style="padding-top: 10px">

      <el-upload action="http://localhost:9191/file/upload" :show-file-list="false" :on-success="handleFileUploadSuccess" style="display: inline-block">
        <el-button type="primary"><i class="el-icon-a-032" style="padding-right: 6px"></i>Upload</el-button>
      </el-upload>
      <el-button type="danger" @click="delBatch" style="margin-left: 10px"><i class="el-icon-a-022" style="padding-right: 6px"></i>Delete Selected</el-button>
    </div>
    <!--          Table-->
    <el-table :data="tableData" background-color="black" @selection-change="handleSelectionChange" >
      <el-table-column type="selection" ></el-table-column>
      <el-table-column prop="name" label="File Name" width="350" ></el-table-column>
      <el-table-column prop="type" label="File Type" width="180" ></el-table-column>
      <el-table-column prop="size" label="File Size" width="180" ></el-table-column>
      <el-table-column label="Actions">
        <template slot-scope="scope">

<!--          Download-->
          <a :href="baseApi + scope.row.url">
            <el-button
              type="success"
              >
              <i class="el-icon-a-061"></i>
              Download
            </el-button>
          </a>
<!--          Delete-->
          <el-button
              type="danger"
              style="margin-left: 10px"
              @click="handleDelete(scope.row.id)">
              <i class="el-icon-a-022"></i>
              Delete
            </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="flex: 0 0 auto">
      <el-pagination
          :current-page="currentPage"
          :page-sizes="[3, 5, 8, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "File",
  created() {
    this.load();
  },
  data(){
    return{
      baseApi: this.$store.state.baseApi,
      tableData: [],
      total: 0,
      pageSize: 5,
      currentPage: 1,
      fileName: '',

      multipleSelection: []
    }
  },
  methods:{
    handleSizeChange(pageSize){
      this.pageSize = pageSize;
      this.load();
    },
    handleCurrentPage(currentPage){
      this.currentPage = currentPage;
      this.load();
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    handleFileUploadSuccess() {
      this.$message.success("Uploaded successfully");
      this.load();
    },
    handleEnable(row){
      this.request.get("/file/enable",{params:{"id": row.id, "enable": row.enable}}).then(res=>{
        if(res.code==='200'){
          this.$message({
            type: "success",
            message: "Updated successfully",
            duration: 3000
          });
          this.load();
        }else {
          this.$message.error(res.msg);
        }
      })
    },
    load(){
      this.request.get("/file/page",{
        params:{
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          fileName: this.fileName,
        }
      }).then(res=>{
            if(res.code==='200'){
              this.tableData = res.data.records;
              for(let s of this.tableData){
                let size = s.size;
                if(size<1024){
                  s.size = size+' Kb';
                }else if(size >1024 && size < 1024*1024){
                  s.size = (size / 1024).toFixed(2) +' Mb'
                }else{
                  s.size = size /1024/1024 .toFixed(2)+' Gb'
                }
              }
              this.total = res.data.total;
            }
          }
      )
    },
    search(){
      this.currentPage = 1;
      this.load();
    },
    reload(){
      this.fileName='';
      this.load()
    },
    // //Edit
    // handleEdit(row){
    //   this.user = JSON.parse(JSON.stringify(row));
    //   this.dialogTitle='Edit User';
    //   this.dialogFormVisible = true;
    // },

    //Delete
    handleDelete(id){
      this.$confirm('Delete this file?', 'Notice', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.request.delete("/file/"+id).then(res=>{
          if(res.code==='200'){
            this.$message({
              type: "success",
              message: "Deleted successfully",
              duration: 3000
            });
            this.load();
          }else {
            this.$message.error(res.msg);
          }
        })
      })
    },
    //Delete Selected
    delBatch(){
      let ids = this.multipleSelection.map(v => v.id);
      this.$confirm('Delete selected users?', 'Notice', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.request.post("/file/del/batch",ids).then(res=>{
          if(res.code==='200'){
            this.$message({
              type: "success",
              message: "Deleted successfully",
              duration: 3000
            });
            this.load();
          }else {
            this.$message.error(res.msg);
          }
        })

      })

    }
  },
}
</script>

<style scoped>

</style>