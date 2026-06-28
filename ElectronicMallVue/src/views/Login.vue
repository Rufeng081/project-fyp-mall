<template>
  <div id="bk" class="auth-page">
    <section class="auth-card">
      <button class="back-button" type="button" @click="goBack" aria-label="Back">
        <i class="iconfont icon-r-left"></i>
        Back
      </button>
      <div class="brand-mark">
        <img src="@/resource/03.png" alt="Rufeng Mall logo" />
      </div>
      <div class="title">
        <span>Welcome back</span>
        <h1>Login to Rufeng Mall</h1>
        <p>Access your cart, orders and profile for the FYP-UKM demo store.</p>
      </div>

      <el-form label-position="top">
        <el-form-item label="Account">
          <el-input v-model.trim="user.account" aria-required="true"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model.trim="user.password" show-password aria-required="true"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="auth-actions">
            <el-button type="primary" @click="onSubmit">
              <i class="iconfont icon-r-yes"></i>
              Login
            </el-button>
            <el-button @click="$router.push('/register')">
              <i class="iconfont icon-r-add"></i>
              Register
            </el-button>
          </div>
        </el-form-item>
        <button class="forgot-link" type="button" @click="resetDialogVisible = true">
          Forgot password?
        </button>
      </el-form>
    </section>

    <el-dialog
      title="Reset Password"
      :visible.sync="resetDialogVisible"
      width="420px"
      @close="clearResetForm"
    >
      <el-form label-position="top">
        <el-form-item label="Email">
          <el-input v-model.trim="resetForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Code">
          <div class="code-row">
            <el-input v-model.trim="resetForm.code" maxlength="6"></el-input>
            <el-button
              type="primary"
              :disabled="sendingResetCode || resetCountdown > 0"
              @click="sendResetCode"
            >
              {{ resetCountdown > 0 ? resetCountdown + "s" : "Send Code" }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="New Password">
          <el-input v-model.trim="resetForm.newPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="Confirm">
          <el-input v-model.trim="resetForm.confirmPassword" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="resetPassword">Reset Password</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import md5 from "js-md5";

export default {
  name: "Login",
  data() {
    return {
      to: "/",
      user: {
        account: "",
        password: "",
      },
      resetDialogVisible: false,
      resetForm: {
        email: "",
        code: "",
        newPassword: "",
        confirmPassword: "",
      },
      sendingResetCode: false,
      resetCountdown: 0,
      resetCountdownTimer: null,
    };
  },
  created() {
    this.to = this.$route.query.to ? this.$route.query.to : "/";
  },
  beforeDestroy() {
    if (this.resetCountdownTimer) {
      clearInterval(this.resetCountdownTimer);
    }
  },
  methods: {
    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
    isValidEmail(email) {
      return /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/.test(email);
    },
    startResetCountdown() {
      this.resetCountdown = 60;
      this.resetCountdownTimer = setInterval(() => {
        this.resetCountdown -= 1;
        if (this.resetCountdown <= 0) {
          clearInterval(this.resetCountdownTimer);
          this.resetCountdownTimer = null;
        }
      }, 1000);
    },
    clearResetForm() {
      this.resetForm = {
        email: "",
        code: "",
        newPassword: "",
        confirmPassword: "",
      };
    },
    sendResetCode() {
      if (!this.resetForm.email) {
        this.$message.error("Email is required");
        return false;
      }
      if (!this.isValidEmail(this.resetForm.email)) {
        this.$message.error("Email format is invalid");
        return false;
      }
      this.sendingResetCode = true;
      this.request
        .post("/api/auth/send-email-code", {
          email: this.resetForm.email,
          purpose: "reset",
        })
        .then((res) => {
          if (res.code === "200") {
            this.$message.success("Verification code sent");
            this.startResetCountdown();
          } else {
            this.$message.error(res.msg);
          }
        })
        .finally(() => {
          this.sendingResetCode = false;
        });
    },
    resetPassword() {
      if (
        this.resetForm.email === "" ||
        this.resetForm.code === "" ||
        this.resetForm.newPassword === "" ||
        this.resetForm.confirmPassword === ""
      ) {
        this.$message.error("Email, code and new password are required");
        return false;
      }
      if (!this.isValidEmail(this.resetForm.email)) {
        this.$message.error("Email format is invalid");
        return false;
      }
      if (this.resetForm.newPassword !== this.resetForm.confirmPassword) {
        this.$message.error("Passwords do not match");
        return false;
      }
      this.request
        .post("/api/auth/reset-password-by-email", {
          email: this.resetForm.email,
          code: this.resetForm.code,
          newPassword: md5(this.resetForm.newPassword),
        })
        .then((res) => {
          if (res.code === "200") {
            this.$message.success("Password reset successfully");
            localStorage.setItem("user", JSON.stringify(res.data));
            this.resetDialogVisible = false;
            this.$router.push(this.to);
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    onSubmit() {
      if (this.user.account === "" || this.user.password === "") {
        this.$message.error("Account and password are required");
        return false;
      }
      let form = {};
      Object.assign(form, this.user);
      form.password = md5(this.user.password);
      this.request.post("/login", form).then((res) => {
        if (res.code === "200") {
          this.$message.success({
            message: "Login successful",
            showClose: true,
          });
          this.$router.push(this.to);
          localStorage.setItem("user", JSON.stringify(res.data));
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  padding: 48px 20px;
  background:
    linear-gradient(90deg, rgba(251, 249, 255, 0.96), rgba(255, 250, 244, 0.82)),
    url("../resource/01.jpg") center / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  width: min(460px, 100%);
  padding: 34px;
  border-radius: var(--mall-radius-lg);
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid var(--mall-border);
  box-shadow: var(--mall-shadow-md);
  backdrop-filter: blur(10px);
}

.back-button {
  min-height: 38px;
  margin: -8px 0 18px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--mall-text-muted);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
}

.back-button:hover {
  color: var(--mall-primary);
}

.brand-mark {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: var(--mall-primary-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-mark img {
  width: 32px;
  height: 32px;
}

.title {
  margin: 22px 0 24px;
}

.title span {
  color: var(--mall-primary);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.title h1 {
  margin: 8px 0;
  color: var(--mall-text);
  font-size: 30px;
}

.title p {
  margin: 0;
  color: var(--mall-text-muted);
  line-height: 1.6;
}

.auth-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 8px;
}

.auth-actions .el-button {
  height: 44px;
  border-radius: 10px;
  font-weight: 900;
}

.forgot-link {
  width: 100%;
  min-height: 40px;
  border: none;
  background: transparent;
  color: var(--mall-primary);
  font-weight: 900;
  cursor: pointer;
}

.forgot-link:hover {
  text-decoration: underline;
}

.code-row {
  display: flex;
  gap: 10px;
}

.code-row .el-button {
  width: 120px;
  flex-shrink: 0;
}

@media (max-width: 520px) {
  .auth-actions {
    grid-template-columns: 1fr;
  }
}
</style>
