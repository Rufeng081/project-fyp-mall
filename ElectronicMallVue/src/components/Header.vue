<template>
  <div style="display: flex;">
    <div style="flex: 1;">
    <!--          Collapse button-->
    <span style="font-size: 25px;cursor: pointer" :class="collapseIcon" v-on:click="$emit('collapse')" :title="collapseTitle"></span>
    <!--          Collapse button-->
    <span style="font-size: 25px;cursor: pointer;margin-left: 10px" class='iconfont icon-r-left' v-on:click="back" title="Back"></span>
<!--    Breadcrumb-->
    <el-breadcrumb style="display: inline-block; margin-left: 30px;font-size: 22px">
      <el-breadcrumb-item :to="{ path: '/manage/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>{{routePath}}</el-breadcrumb-item>
    </el-breadcrumb>
    </div>
    <!--          Settings button-->
    <el-dropdown style="margin-right: 40px;cursor: pointer">
    <span class="el-dropdown-link">
      <div style="display: inline-block;font-size: 22px;font-weight: 600;">
        <img :src="baseApi + user.avatarUrl" class="avatar">
          {{user.nickname }}
      <i class="el-icon-arrow-down el-icon--right" style="margin-right: 15px"></i>
      </div>
    </span>
      <el-dropdown-menu slot="dropdown" style="text-align: center">
        <el-dropdown-item>
          <div @click="$router.push('/manage/person')">Profile</div>
        </el-dropdown-item>
        <el-dropdown-item>
          <div @click="logout">Logout</div>
        </el-dropdown-item>


      </el-dropdown-menu>
    </el-dropdown>
  </div>

</template>

<script>
import request from "@/utils/request";

export default {
  name: "Header",
  props: {
    collapseIcon: String,
    collapseTitle: String,
    user: Object
  },
  methods:{
    logout() {
      localStorage.removeItem("user");
      this.$router.push('/login');
      this.$message.success("Logged out successfully");
    },
    back(){
      this.$router.go(-1)
    }

  },
  data(){
    return{
      routePath: '',
      baseApi: this.$store.state.baseApi,


      // user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {nickname:'Login expired'}
    }
  },
  watch: {
    //Breadcrumb
    '$route': function (){
      this.routePath=this.$route.meta.path
    },

  },
  created() {
    // this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {nickname:'Login expired'};
    this.routePath=this.$route.meta.path;
  }
}

</script>

<style scoped>
.avatar{
  width: 60px;
  border-radius: 10px;
  position: relative;
  top: 10px;
  right: 5px;
}
</style>