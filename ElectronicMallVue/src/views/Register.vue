<template>
  <div id="bk" class="auth-page">
    <section class="auth-card register-card">
      <div class="title">
        <span>Create Account</span>
        <h1>Register for R Mall</h1>
        <p>Email verification keeps demo accounts clear and trustworthy.</p>
      </div>

      <div class="verification-steps">
        <span class="active">1. Details</span>
        <span class="active">2. Email Code</span>
        <span>3. Start Shopping</span>
      </div>

      <el-form label-position="top">
        <el-form-item label="Username">
          <el-input v-model.trim="user.username" aria-required="true"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model.trim="user.email" aria-required="true"></el-input>
        </el-form-item>
        <el-form-item label="Code">
          <div class="code-row">
            <el-input v-model.trim="user.code" maxlength="6" aria-required="true"></el-input>
            <el-button
              type="primary"
              :disabled="sendingCode || countdown > 0"
              @click="sendCode"
            >
              {{ countdown > 0 ? countdown + "s" : "Send Code" }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model.trim="user.password" show-password aria-required="true"></el-input>
        </el-form-item>
        <el-form-item label="Confirm Password">
          <el-input v-model.trim="user.confirmPassword" show-password aria-required="true"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="auth-actions">
            <el-button type="primary" @click="onSubmit">
              <i class="iconfont icon-r-add"></i>
              Register
            </el-button>
            <el-button @click="$router.push('/login')">
              <i class="iconfont icon-r-left"></i>
              Back
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import md5 from "js-md5";

export default {
  name: "Register",
  data() {
    return {
      user: {
        username: "",
        email: "",
        code: "",
        password: "",
        confirmPassword: "",
      },
      sendingCode: false,
      countdown: 0,
      countdownTimer: null,
    };
  },
  beforeDestroy() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  },
  methods: {
    isValidEmail(email) {
      return /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/.test(email);
    },
    startCountdown() {
      this.countdown = 60;
      this.countdownTimer = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown <= 0) {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
        }
      }, 1000);
    },
    sendCode() {
      if (!this.user.email) {
        this.$message.error("Email is required");
        return false;
      }
      if (!this.isValidEmail(this.user.email)) {
        this.$message.error("Email format is invalid");
        return false;
      }
      this.sendingCode = true;
      this.request
        .post("/api/auth/send-email-code", {
          email: this.user.email,
          purpose: "register",
        })
        .then((res) => {
          if (res.code === "200") {
            this.$message.success("Verification code sent");
            this.startCountdown();
          } else {
            this.$message.error(res.msg);
          }
        })
        .finally(() => {
          this.sendingCode = false;
        });
    },
    onSubmit() {
      if (
        this.user.username === "" ||
        this.user.email === "" ||
        this.user.code === "" ||
        this.user.password === "" ||
        this.user.confirmPassword === ""
      ) {
        this.$message.error("Username, email, code and password are required");
        return false;
      }
      if (!this.isValidEmail(this.user.email)) {
        this.$message.error("Email format is invalid");
        return false;
      }
      if (this.user.password !== this.user.confirmPassword) {
        this.$message.error("Passwords do not match");
        return false;
      }
      const form = {
        username: this.user.username,
        email: this.user.email,
        code: this.user.code,
        password: md5(this.user.password),
      };
      this.request.post("/api/auth/register-by-email", form).then((res) => {
        if (res.code === "200") {
          this.$message.success("Registered successfully");
          localStorage.setItem("user", JSON.stringify(res.data));
          this.$router.push("/");
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
  padding: 40px 20px;
  background:
    linear-gradient(90deg, rgba(251, 249, 255, 0.96), rgba(255, 250, 244, 0.82)),
    url("../resource/01.jpg") center / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  width: min(560px, 100%);
  padding: 34px;
  border-radius: var(--mall-radius-lg);
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid var(--mall-border);
  box-shadow: var(--mall-shadow-md);
  backdrop-filter: blur(10px);
}

.title {
  margin-bottom: 18px;
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

.verification-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 22px;
}

.verification-steps span {
  padding: 7px 11px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid var(--mall-border);
  color: var(--mall-text-muted);
  font-size: 12px;
  font-weight: 900;
}

.verification-steps .active {
  background: var(--mall-primary-soft);
  color: var(--mall-primary);
}

.code-row {
  display: flex;
  gap: 10px;
}

.code-row .el-button {
  width: 120px;
  flex-shrink: 0;
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

@media (max-width: 520px) {
  .auth-actions,
  .code-row {
    grid-template-columns: 1fr;
    display: grid;
  }

  .code-row .el-button {
    width: 100%;
  }
}
</style>
