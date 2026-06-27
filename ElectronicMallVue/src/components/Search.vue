<template>
  <form class="search-panel" @submit.prevent="$emit('search', searchText)">
    <label for="product-search">Search products</label>
    <div class="search-control">
      <input
        id="product-search"
        v-model="searchText"
        type="search"
        placeholder="Search products by name or category"
      />
      <button type="submit" aria-label="Search products">
        <i class="el-icon-search"></i>
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      searchText: "",
    };
  },
};
</script>

<style scoped>
.search-panel {
  width: min(920px, calc(100% - 32px));
  margin: 22px auto 0;
  display: grid;
  gap: 8px;
}

.search-panel label {
  color: var(--mall-text);
  font-size: 14px;
  font-weight: 800;
}

.search-control {
  height: 48px;
  border: 1px solid #ded7f5;
  border-radius: 12px;
  background: #ffffff;
  display: flex;
  overflow: hidden;
  box-shadow: var(--mall-shadow-sm);
}

.search-control input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  padding: 0 18px;
  color: var(--mall-text);
  font-size: 15px;
}

.search-control button {
  width: 56px;
  border: none;
  background: var(--mall-primary);
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-control button:hover {
  background: var(--mall-primary-dark);
}
</style>
