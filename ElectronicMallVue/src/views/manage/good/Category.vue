<template>
  <div>
    <div style="width: 60%; margin: 30px auto">
      <el-button
        type="success"
        icon="el-icon-a-07"
        style="font-size: 20px;"
        circle
        @click="addDialogFormVisible = true"
      ></el-button>
      <el-table :data="icons" stripe>
        <!-- Subcategory table-->
        <el-table-column type="expand" label="Subcategory" width="100px">
          <template slot-scope="scope">
            <el-table
              :data="scope.row.categories"
              :header-cell-style="{ background: '#cbefea', color: 'black' }"
            >
              <el-table-column label="Category ID" prop="id"></el-table-column>
              <el-table-column label="Category Name" prop="name"></el-table-column>
              <el-table-column label="Actions" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                      size="mini"
                    @click="handleEditCategory(scope.row)"
                    >Update</el-button
                  >

                  <el-popconfirm
                    @confirm="deleteCategory(scope.row)"
                    title="Delete?"
                  >
                    <el-button
                      type="danger"
                      size="mini"
                      slot="reference"
                      >Delete</el-button
                    >
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <!---->
        </el-table-column>
        <el-table-column label="id" prop="id" width="60px"></el-table-column>
        <el-table-column label="icon">
          <template slot-scope="scope">
            <i class="iconfont" v-html="scope.row.value"></i>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="Actions" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              style="font-size: 18px;"
              icon="el-icon-a-032"
              circle
              @click="handleEditIcon(scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-a-07"
              style="font-size: 18px;"
              circle
              @click="handleAddCategory(scope.row)"
            ></el-button>

            <el-popconfirm
              @confirm="deleteIcon(scope.row.id)"
              title="Delete?"
            >
              <el-button
                type="danger"
                icon="el-icon-a-022"
                style="font-size: 18px;margin-left: 10px;"
                circle
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--iconUpdateDialog-->
    <el-dialog title="Edit Category Group" :visible.sync="dialogFormVisible">
      <el-form :model="icon">
        <el-form-item label="Icon" label-width="100px">
          <i class="iconfont" v-html="icon.value"></i>
        </el-form-item>
        <el-form-item label="Change Icon" label-width="100px">
          <el-select placeholder="Select icon" v-model="icon.value">
            <el-option v-for="item in iconStore" :value="item" :key="item">
              <i class="iconfont" v-html="item"></i>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editIcon">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Add Category Group" :visible.sync="addDialogFormVisible">
      <el-form :model="addIcon">
        <el-form-item label="Icon" label-width="100px">
          <i class="iconfont" v-html="addIcon.value"></i>
        </el-form-item>
        <el-form-item label="Change Icon" label-width="100px">
          <el-select placeholder="Select icon" v-model="addIcon.value">
            <el-option v-for="item in iconStore" :value="item" :key="item">
              <i class="iconfont" v-html="item"></i>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveIcon">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from "../../../utils/request";
import icons from "@/utils/icons";
export default {
  name: "Category",
  data() {
    return {
      options: [],
      searchText: "",
      user: {},
      //Import iconStore from icons.js
      iconStore: icons.iconStore,
      icons: [],
      icon: {},
      addIcon: {},
      pageNum: 1,
      pageSize: 5,
      entity: {},
      total: 0,
      dialogFormVisible: false,
      addDialogFormVisible: false,
    };
  },
  created() {
    this.user = localStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : {};
    this.load();
    console.log(this.iconStore);
  },
  methods: {
    load() {
      this.request.get("/api/icon").then((res) => {
        this.icons = res.data;
      });
    },

    handleEditCategory(category) {
      this.$prompt("Enter the updated name", "Notice", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
      }).then(({ value }) => {
        category.name = value;
        this.request.post("/api/category", category).then((res) => {
          if (res.code === "200") {
            this.$message.success("Updated successfully");
          } else {
            this.$message.error("Update failed");
          }
        });
      });
    },
    handleAddCategory(icon) {
      this.$prompt("Enter the new subcategory name", "Notice", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
      }).then(({ value }) => {
        this.request
          .post("/api/category/add", { name: value, iconId: icon.id })
          .then((res) => {
            if (res.code === "200") {
              this.$message.success("Added successfully");
              this.load();
            } else {
              this.$message.error("Add failed");
            }
          });
      });
    },
    handleEditIcon(icon) {
      this.icon = JSON.parse(JSON.stringify(icon));
      this.dialogFormVisible = true;
    },
    editIcon() {
      //Delete unused properties
      delete this.icon.categories;
      this.request.post("/api/icon", this.icon).then((res) => {
        if (res.code === "200") {
          this.$message.success("Updated successfully");
          this.dialogFormVisible = false;
        } else {
          this.$message.error("Update failed");
        }
      });
    },
    saveIcon() {
      // Add Category Group
      if (this.addIcon.value == undefined) {
        this.$message.error("Select a category group icon");
        return;
      }
      this.request.post("/api/icon", this.addIcon).then((res) => {
        console.log(res);
        if (res.code === "200") {
          this.$message.success("Added successfully");
          this.addDialogFormVisible = false;
          this.load();
        } else {
          this.$message.error("Add failed");
        }
      });
    },
    deleteIcon(iconId) {
      // Delete category group
      this.request.get("/api/icon/delete?id=" + iconId).then((res) => {
        if (res.code == "200") {
          this.$message.success("Deleted successfully");
          this.load();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    deleteCategory(category) {
      // DeleteSubcategory
      this.request.get("/api/category/delete?id=" + category.id).then((res) => {
        if (res.code == "200") {
          this.$message.success("Deleted successfully");
          this.load();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style scoped>
@import "../../../resource/css/icon.css";
</style>
