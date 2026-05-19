<template>
  <el-menu :default-openeds="['2', 'good']" style="height: 100%;"
           background-color="rgb(48,65,86)"
           text-color ="#fff"
           :collapse-transition="false"
           :collapse="isCollapse"
           router
  >
    <div style="height: 60px;margin-left: 30px; line-height: 60px">
      <router-link to="/manage/home">
        <img src="../resource/logo.png" style="width: 32px;position: relative; top: 7px;right: 6px;">
      </router-link>
      <span slot="title" style="color: aliceblue;font-size: 20px" v-show="!isCollapse">Admin Dashboard</span>
    </div>
    <el-menu-item index="/manage/home">
      <i class="el-icon-a-011" style="font-size: 22px;color: white;"></i><span slot="title">Dashboard</span>
    </el-menu-item>
    <el-menu-item index="/">
      <i class="el-icon-a-02" style="font-size: 22px;color: white;"></i><span slot="title">Storefront</span>
    </el-menu-item>

    <el-submenu index="2">
      <template slot="title" >
        <i class="el-icon-a-031" style="font-size: 22px;color: white;"></i><span slot="title">System</span></template>
      <el-submenu v-show="userGroup" index="user" >
        <template slot="title" ><i class="el-icon-a-01" style="font-size: 22px;color: white;"></i>User</template>
        <el-menu-item index="/manage/user" v-if="menuFlags.userMenu"> User Management</el-menu-item>
      </el-submenu>
      <el-submenu v-if="fileGroup" index="file">
        <template slot="title"><i class="el-icon-a-061" style="font-size: 22px;color: white;"></i>File</template>
        <el-menu-item index="/manage/file" v-if="menuFlags.fileMenu">File Management</el-menu-item>
        <el-menu-item index="/manage/avatar" v-if="menuFlags.avatarMenu">Avatar Management</el-menu-item>
      </el-submenu>
      <el-submenu v-if="GoodGroup" index="good">
        <template slot="title"><i class="el-icon-a-041" style="font-size: 22px;color: white;"></i>Product</template>
        <el-menu-item index="/manage/category" v-if="menuFlags.categoryMenu">Category Management</el-menu-item>
        <el-menu-item index="/manage/carousel" v-if="menuFlags.carouselMenu">Carousel Management</el-menu-item>
        <el-menu-item index="/manage/good" v-if="menuFlags.goodMenu">Product Management</el-menu-item>
        <el-menu-item index="/manage/order" v-if="menuFlags.orderMenu">Order Management</el-menu-item>
      </el-submenu>
      <el-submenu v-if="incomeGroup" index="income">
        <template slot="title"><i class="el-icon-a-021" style="font-size: 22px;color: white;"></i>Revenue</template>
        <el-menu-item index="/manage/incomeChart" v-if="menuFlags.incomeChartMenu">Charts</el-menu-item>
        <el-menu-item index="/manage/incomeRank" v-if="menuFlags.incomeRankMenu">Revenue Ranking</el-menu-item>
      </el-submenu>
    </el-submenu>
  </el-menu>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Aside",
  props: {
    isCollapse: Boolean,
  },
  data() {
    return{
      role : 'user',
      menuFlags: {
        userMenu: false,
        fileMenu: false,
        avatarMenu: false,
        goodMenu: false,
        carouselMenu: false,
        orderMenu: false,
        categoryMenu: false,
        incomeChartMenu: false,
        incomeRankMenu: false,
      }
    }
  },
  computed: {
    userGroup: function (){
      return this.menuFlags.userMenu
    },
    fileGroup: function (){
      return this.menuFlags.fileMenu || this.menuFlags.avatarMenu
    },
    GoodGroup: function (){
      return this.menuFlags.goodMenu ||this.menuFlags.orderMenu || this.menuFlags.categoryMenu || this.menuFlags.carouselMenu
    },
    incomeGroup: function () {
      return this.menuFlags.incomeChartMenu || this.menuFlags.incomeRankMenu
    }
  },
  created() {
    request.post("/role").then(res=>{
      if(res.code==='200'){
        this.role = res.data;
        console.log("asider，role："+this.role)
        if(this.role === 'admin'){
          this.menuFlags.userMenu = true
          this.menuFlags.fileMenu = true
          this.menuFlags.avatarMenu = true
          this.menuFlags.categoryMenu = true
          this.menuFlags.goodMenu = true
          this.menuFlags.carouselMenu = true
          this.menuFlags.orderMenu = true
          this.menuFlags.incomeChartMenu = true
          this.menuFlags.incomeRankMenu = true
        }
        else if(this.role==='user'){

        }
        console.log(this.menuFlags)
      }
    })
  }
}
</script>

<style scoped>

</style>
