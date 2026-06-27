<template>
  <div class="admin-header">
    <div class="header-left">
      <button class="header-icon" type="button" @click="$emit('collapse')" :title="collapseTitle">
        <span :class="collapseIcon"></span>
      </button>
      <button class="header-icon" type="button" @click="back" title="Back">
        <span class="iconfont icon-r-left"></span>
      </button>
      <el-breadcrumb class="admin-breadcrumb">
        <el-breadcrumb-item :to="{ path: '/manage/home' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>{{ routePath }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-dropdown class="admin-profile">
      <span class="el-dropdown-link">
        <img :src="baseApi + user.avatarUrl" class="avatar" alt="Admin avatar" />
        {{ user.nickname }}
        <i class="el-icon-arrow-down el-icon--right"></i>
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
export default {
  name: "Header",
  props: {
    collapseIcon: String,
    collapseTitle: String,
    user: Object,
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
      this.$message.success("Logged out successfully");
    },
    back() {
      this.$router.go(-1);
    },
  },
  data() {
    return {
      routePath: "",
      baseApi: this.$store.state.baseApi,
    };
  },
  watch: {
    "$route": function () {
      this.routePath = this.$route.meta.path;
    },
  },
  created() {
    this.routePath = this.$route.meta.path;
  },
};
</script>

<style scoped>
.admin-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.header-left {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 10px;
  background: var(--mall-primary-soft);
  color: var(--mall-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 21px;
  cursor: pointer;
}

.admin-breadcrumb {
  margin-left: 12px;
  font-size: 16px;
  font-weight: 700;
}

.admin-profile {
  margin-right: 24px;
  cursor: pointer;
}

.el-dropdown-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--mall-text);
  font-weight: 800;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  object-fit: cover;
}
</style>
