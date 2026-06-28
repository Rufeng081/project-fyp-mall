<template>
  <div class="manage-shell">
    <el-container class="manage-container">
      <!--      Sidebar-->
      <el-aside
        :width="sideWidth + 'px'"
        class="manage-aside"
      >
        <Aside :is-collapse="isCollapse"></Aside>
      </el-aside>

      <el-container>
        <!--        Header-->
        <el-header
          class="manage-header"
        >
          <Header
            :collapse-icon="collapseIcon"
            :collapse-title="collapseTitle"
            @collapse="handleCollapse"
            :user="user"
          ></Header>
        </el-header>

        <el-main class="manage-main" :class="{bk: $route.path=='/manage/home'}">
          <router-view @refresh="getUser" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
.manage-shell,
.manage-container {
  height: 100%;
  min-height: 100vh;
}

.manage-aside {
  min-height: 100vh;
  background-color: rgb(238, 241, 246);
}

.manage-header {
  height: 80px !important;
  line-height: 80px;
  border-bottom: 1px solid #ccc;
  background-color: aliceblue;
  color: #333;
}

.manage-main {
  background: #ffffff;
}

.bk {
  width: 100%;
  background: url("@/resource/img/back.jpg") center center no-repeat;
  background-size: 100% 100%;
}
</style>

<script>
import Aside from "@/components/Aside";
import Header from "@/components/Header";
export default {
  data() {
    return {
      user: {},
      isCollapse: false,
      sideWidth: 250,
      collapseIcon: "el-icon-s-fold",
      collapseTitle: "Collapse",
    };
  },

  components: {
    Aside,
    Header,
  },
  methods: {
    handleCollapse() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse) {
        //Collapse button clicked
        this.sideWidth = 64;
        this.collapseIcon = "el-icon-s-unfold";
        this.collapseTitle = "Expand";
      } else {
        //Expand button clicked
        this.sideWidth = 250;
        this.collapseIcon = "el-icon-s-fold";
        this.collapseTitle = "Collapse";
      }
    },
    getUser() {
      let username = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).username
        : "";
      if (username) {
        // Get user data from the API
        this.request.get("/userinfo/" + username).then((res) => {
          // Refresh user data from the API
          this.user = res.data;
          console.log(this.user.role);
        });
      }
    },
  },
  created() {
    this.getUser();
  },
};
</script>
