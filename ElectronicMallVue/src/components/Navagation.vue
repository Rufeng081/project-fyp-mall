<!--
 * @Description: 
 * @Author: Rabbiter
 * @Date: 2023-03-26 15:27:05
-->
<template>
  <div class="navagation">
    <el-row>
      <el-col :span="3">
        <div style="font-size: 20px; font-weight: bold; text-align: center">
          <a href="/"><i class="el-icon-a-011"></i> Online Mall</a>
        </div>
      </el-col>
      <el-col :span="17">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          router
        >
          <el-menu-item index="/" class="menu-item">Home</el-menu-item>
          
          <el-menu-item index="/goodList" class="menu-item"
            >Category</el-menu-item
          >
          <el-menu-item index="/cart" class="menu-item"
            >My Cart</el-menu-item
          >
          <el-menu-item index="/orderList" class="menu-item"
            >My Orders</el-menu-item
          >
          <el-menu-item
            index="/manage"
            class="menu-item"
            v-if="role === 'admin'"
            >Admin</el-menu-item
          >
        </el-menu>
      </el-col>
      <el-col :span="4">
        <!--         Top-right profile-->
        <el-dropdown style="cursor: pointer; float: right; margin-right: 60px">
          <span class="el-dropdown-link">
            <div style="display: inline-block">
              <img
                v-if="user.avatarUrl != null"
                :src="baseApi + user.avatarUrl"
                class="avatar"
              />
              {{ user.nickname }}
              <i
                class="el-icon-arrow-down el-icon--right"
                style="margin-right: 5px"
              ></i>
            </div>
          </span>
          <!--          Dropdown menu-->
          <el-dropdown-menu slot="dropdown" style="text-align: center">
            <el-dropdown-item>
              <!--              After login, redirect to the storefront path-->
              <div
                @click="$router.push({ path: '/login', query: { to: '/' } })"
                v-show="!loginStatus"
              >
                Login
              </div>
            </el-dropdown-item>
            <el-dropdown-item v-show="loginStatus">
              <div @click="$router.push('/person')">Profile</div>
            </el-dropdown-item>
            <el-dropdown-item v-show="loginStatus">
              <div @click="logout">Logout</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>


<script>
export default {
  name: "Navagation",
  props: {
    user: Object,
    loginStatus: Boolean,
    role: String,
  },
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
      baseApi: this.$store.state.baseApi,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      this.$router.go(0);
      this.$message.success("Logged out successfully");
    },
  },
};
</script>
<style>
a {
  text-decoration: none;
}
.navagation {
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: white;
  overflow: hidden;
}
.avatar {
  width: 45px;
  border-radius: 5px;
  position: relative;
  top: 10px;
  right: 5px;
}
.menu-item {
  padding-left: 50px;
  padding-right: 50px;
}
</style>
