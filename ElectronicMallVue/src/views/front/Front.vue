<template>
  <el-container class="front-shell">
    <el-header class="front-header">
      <Navagation :user="user"
                  :role="role"
                  :login-status="loginStatus"
      ></Navagation>
    </el-header>
    <el-main class="front-main">
      <router-view />
    </el-main>
  </el-container>
</template>

<script>

import Navagation from "@/components/Navagation";
import request from "@/utils/request";

export default {
  name: "Front",
  data(){
    return{
      user:{},
      role: 'user',
      loginStatus: false,
    }
  },
  methods: {
    getUser() {
      let username = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username : ""
      if (username) {
        // Get user data from the API
        this.request.get("/userinfo/" + username).then(res => {
          // Refresh user data from the API
          this.user = res.data
          console.log(this.user.role)
        })
      }

    },
  },


  components:{
    Navagation,
  },
  created() {
    if(localStorage.getItem("user")){
      request.post("/role").then(res=> {
        if (res.code === '200') {
          this.role = res.data;
          if (localStorage.getItem("user")) {
            this.user = JSON.parse(localStorage.getItem("user"));
            this.loginStatus = true;
          }
        } else {
          this.user = {nickname: 'Not logged in', avatarUrl: null};
          localStorage.removeItem('user')
          this.loginStatus = false;
        }
      })
    }else{
      this.user = {nickname: 'Not logged in', avatarUrl: null};
      this.loginStatus = false;
    }

  }
}
</script>

<style scoped>
@import "../../resource/css/search.css";

.front-shell {
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(circle at 8% 12%, rgba(91, 43, 214, 0.08), transparent 26%),
    linear-gradient(180deg, var(--mall-bg) 0%, #ffffff 100%);
}

.front-header {
  height: auto !important;
  padding: 0;
  line-height: normal;
  background: transparent;
}

.front-main {
  width: 100%;
  padding: 0 0 34px;
  background: transparent;
  overflow: visible;
}
</style>
