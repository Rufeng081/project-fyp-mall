<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <!--      Sidebar-->
      <el-aside
        :width="sideWidth + 'px'"
        style="background-color: rgb(238, 241, 246); height: 100%"
      >
        <Aside :is-collapse="isCollapse"></Aside>
      </el-aside>

      <el-container>
        <!--        Header-->
        <el-header
          style="border-bottom: 1px solid #ccc; background-color: aliceblue;height: 80px;"
        >
          <Header
            :collapse-icon="collapseIcon"
            :collapse-title="collapseTitle"
            @collapse="handleCollapse"
            :user="user"
          ></Header>
        </el-header>

        <el-main :class="{bk: $route.path=='/manage/home'}">
          <router-view @refresh="getUser" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 80px;
}

.el-aside {
  color: #333;
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
