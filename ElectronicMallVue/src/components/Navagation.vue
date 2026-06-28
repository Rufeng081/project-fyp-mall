<template>
  <header class="mall-navbar">
    <router-link class="brand-section" to="/topview" aria-label="Rufeng Mall Home">
      <div class="brand-icon">
        <i class="el-icon-shopping-bag-1"></i>
      </div>
      <div>
        <h1>Rufeng Mall</h1>
        <p>FYP-UKM Demo</p>
      </div>
    </router-link>

    <nav class="main-menu" aria-label="Primary navigation">
      <router-link to="/topview">Home</router-link>
      <router-link to="/goodList">Category</router-link>
      <router-link to="/cart">My Cart</router-link>
      <router-link to="/orderList">My Orders</router-link>
      <router-link v-if="role === 'admin'" to="/manage">Admin</router-link>
    </nav>

    <div class="nav-actions">
      <form class="nav-search" @submit.prevent="submitSearch">
        <input
          v-model.trim="searchText"
          type="search"
          placeholder="Search products..."
          aria-label="Search products"
        />
        <button type="submit" aria-label="Search">
          <i class="el-icon-search"></i>
        </button>
      </form>

      <router-link class="icon-button" to="/cart" aria-label="Open cart">
        <i class="el-icon-shopping-cart-2"></i>
      </router-link>

      <button class="icon-button" type="button" aria-label="Notifications">
        <i class="el-icon-bell"></i>
      </button>

      <el-dropdown class="user-profile" trigger="click">
        <span class="el-dropdown-link">
          <img
            v-if="user.avatarUrl != null"
            :src="baseApi + user.avatarUrl"
            class="avatar"
            alt="User avatar"
          />
          <span v-else class="avatar avatar-fallback">
            <i class="el-icon-user-solid"></i>
          </span>
          <span class="profile-copy">
            <span class="profile-name">{{ displayName }}</span>
            <span class="profile-role">{{ displayRoleLabel }}</span>
          </span>
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="profile-menu">
          <el-dropdown-item v-show="!loginStatus">
            <div @click="$router.push({ path: '/login', query: { to: '/' } })">
              Login
            </div>
          </el-dropdown-item>
          <el-dropdown-item v-show="loginStatus">
            <div @click="$router.push('/person')">Profile</div>
          </el-dropdown-item>
          <el-dropdown-item v-show="loginStatus && role === 'admin'">
            <div @click="$router.push('/manage')">Admin Dashboard</div>
          </el-dropdown-item>
          <el-dropdown-item v-show="loginStatus">
            <div @click="logout">Logout</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
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
      baseApi: this.$store.state.baseApi,
      searchText: "",
    };
  },
  computed: {
    displayName() {
      if (!this.loginStatus) return "Not logged in";
      return this.user.nickname || (this.role === "admin" ? "Administrator" : "Customer");
    },
    displayRoleLabel() {
      if (!this.loginStatus) return "Login / Register";
      return this.role === "admin" ? "Administrator" : "Customer";
    },
  },
  methods: {
    submitSearch() {
      this.$router.push({
        path: "/goodList",
        query: { searchText: this.searchText },
      });
    },
    logout() {
      localStorage.removeItem("user");
      this.$router.go(0);
      this.$message.success("Logged out successfully");
    },
  },
};
</script>

<style scoped>
.mall-navbar {
  width: 100%;
  min-height: 72px;
  padding: 0 clamp(24px, 4vw, 64px);
  background: rgba(255, 255, 255, 0.98);
  border-bottom: 1px solid var(--mall-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  position: sticky;
  top: 0;
  z-index: 30;
  backdrop-filter: blur(10px);
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 210px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--mall-bg-warm);
  border: 1px solid var(--mall-border);
  color: var(--mall-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}

.brand-section h1 {
  margin: 0;
  color: var(--mall-text);
  font-size: 24px;
  line-height: 1;
  font-weight: 800;
}

.brand-section p {
  margin: 4px 0 0;
  color: var(--mall-text-muted);
  font-size: 13px;
  line-height: 1;
}

.main-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(22px, 2.4vw, 40px);
  flex: 1;
}

.main-menu a {
  position: relative;
  min-height: 72px;
  display: inline-flex;
  align-items: center;
  color: var(--mall-text);
  font-size: 15px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.main-menu a:hover,
.main-menu a.router-link-active,
.main-menu a.router-link-exact-active {
  color: var(--mall-primary);
  font-weight: 700;
}

.main-menu a::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  border-radius: 999px;
  background: var(--mall-primary);
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.main-menu a:hover::after,
.main-menu a.router-link-active::after,
.main-menu a.router-link-exact-active::after {
  transform: scaleX(1);
}

.nav-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
}

.nav-search {
  width: clamp(220px, 20vw, 340px);
  height: 44px;
  border: 1px solid var(--mall-border);
  border-radius: 10px;
  background: #ffffff;
  display: flex;
  overflow: hidden;
}

.nav-search input {
  min-width: 0;
  flex: 1;
  border: none;
  outline: none;
  padding: 0 16px;
  color: var(--mall-text);
  font-size: 14px;
}

.nav-search button {
  width: 46px;
  border: none;
  background: var(--mall-primary);
  color: #ffffff;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.nav-search button:hover {
  background: var(--mall-primary-dark);
}

.icon-button {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--mall-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.icon-button:hover {
  background: var(--mall-bg-warm);
  color: var(--mall-text);
}

.user-profile {
  min-width: 0;
}

.el-dropdown-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--mall-text);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  object-fit: cover;
  background: var(--mall-bg-warm);
}

.avatar-fallback {
  color: var(--mall-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.profile-name {
  display: block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.1;
}

.profile-copy {
  min-width: 0;
  display: grid;
  gap: 2px;
}

.profile-role {
  color: var(--mall-text-muted);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.1;
}

@media (max-width: 1180px) {
  .mall-navbar {
    flex-wrap: wrap;
    padding-top: 14px;
    padding-bottom: 14px;
  }

  .brand-section {
    min-width: auto;
  }

  .main-menu {
    order: 3;
    width: 100%;
    flex-wrap: wrap;
  }

  .main-menu a {
    min-height: 38px;
  }
}

@media (max-width: 760px) {
  .mall-navbar {
    align-items: flex-start;
  }

  .nav-actions {
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .nav-search {
    width: 100%;
  }

  .profile-name {
    max-width: 92px;
  }
}
</style>
