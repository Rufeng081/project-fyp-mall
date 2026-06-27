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
  min-height: 100vh;
}

.manage-aside {
  height: 100vh;
  background: #f4f1fb;
  border-right: 1px solid var(--mall-border);
}

.manage-header {
  height: 80px !important;
  line-height: 80px;
  border-bottom: 1px solid var(--mall-border);
  background: rgba(255, 255, 255, 0.94);
  color: var(--mall-text);
}

.manage-main {
  background:
    radial-gradient(circle at 92% 8%, rgba(47, 191, 155, 0.12), transparent 26%),
    var(--mall-bg);
}

.bk {
  width: 100%;
  background:
    linear-gradient(135deg, rgba(251, 249, 255, 0.94), rgba(255, 255, 255, 0.82)),
    url("@/resource/img/back.jpg") center center no-repeat;
  background-size: cover;
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
