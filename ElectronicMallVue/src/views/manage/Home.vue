<template>
  <div class="admin-home">
    <section class="admin-welcome mall-card">
      <span class="eyebrow">Administrator</span>
      <h1>Welcome to the Admin Dashboard</h1>
      <p>Manage products, orders, users, files and revenue reports for the Rufeng Mall FYP demonstration.</p>
      <div class="admin-highlights">
        <div>
          <i class="el-icon-goods"></i>
          <strong>Product Control</strong>
        </div>
        <div>
          <i class="el-icon-s-order"></i>
          <strong>Order Review</strong>
        </div>
        <div>
          <i class="el-icon-data-analysis"></i>
          <strong>Revenue View</strong>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Home.vue",
};
</script>

<style scoped>
.admin-home {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.admin-welcome {
  width: min(820px, 100%);
  padding: 38px;
  background:
    radial-gradient(circle at 100% 0%, rgba(47, 191, 155, 0.15), transparent 32%),
    #ffffff;
}

.eyebrow {
  color: var(--mall-primary);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.admin-welcome h1 {
  margin: 10px 0 12px;
  color: var(--mall-text);
  font-size: clamp(34px, 5vw, 52px);
  line-height: 1.08;
}

.admin-welcome p {
  max-width: 620px;
  margin: 0;
  color: var(--mall-text-muted);
  font-size: 16px;
  line-height: 1.7;
}

.admin-highlights {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 30px;
}

.admin-highlights div {
  min-height: 96px;
  border-radius: var(--mall-radius-md);
  background: var(--mall-primary-soft);
  color: var(--mall-primary);
  display: grid;
  place-items: center;
  gap: 8px;
  text-align: center;
}

.admin-highlights i {
  font-size: 28px;
}

@media (max-width: 680px) {
  .admin-home {
    padding: 20px;
  }

  .admin-highlights {
    grid-template-columns: 1fr;
  }
}
</style>
