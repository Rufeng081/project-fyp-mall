<template>
  <div class="profile-page mall-page">
    <el-card class="profile-card">
      <div class="profile-header">
        <div>
          <span class="eyebrow">User Center</span>
          <h2>Edit Profile</h2>
        </div>
      </div>

      <el-form label-position="top">
        <el-form-item label="Avatar">
          <el-upload
            class="avatar-uploader"
            :action="baseApi + '/avatar'"
            :headers="token"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="form.avatarUrl" :src="baseApi + form.avatarUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <div class="profile-grid">
          <el-form-item label="Nickname">
            <el-input v-model="form.nickname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Phone">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Address">
            <el-input v-model="form.address" autocomplete="off"></el-input>
          </el-form-item>
        </div>

        <div class="profile-actions">
          <el-button type="primary" @click="save">Confirm</el-button>
          <el-popover placement="top" width="280" trigger="click">
            <el-form label-position="top">
              <el-form-item label="New Password">
                <el-input
                  type="password"
                  v-model="resetPsw.newPassword"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="Confirm Password">
                <el-input
                  type="password"
                  v-model="resetPsw.confirmPassword"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-button type="primary" @click="toResetPassword">Confirm</el-button>
            </el-form>
            <el-button
              slot="reference"
              type="warning"
              @click="resetPsw = { newPassword: '', confirmPassword: '' }"
            >
              Reset Password
            </el-button>
          </el-popover>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import md5 from "js-md5";

export default {
  name: "Person",
  data() {
    return {
      form: {},
      baseApi: this.$store.state.baseApi,
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      resetPsw: {
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    toResetPassword() {
      if (this.resetPsw.newPassword.trim() == "") {
        this.$message.error("New password is required");
        return;
      }
      if (this.resetPsw.confirmPassword != this.resetPsw.newPassword) {
        this.$message.error("Passwords do not match");
        return;
      }
      this.request
        .get(
          "/user/resetPassword?id=" +
            this.user.id +
            "&newPassword=" +
            md5(this.resetPsw.newPassword)
        )
        .then((res) => {
          if (res.code === "200") {
            this.$message.success("Updated successfully");
            this.resetPsw = {
              newPassword: "",
              confirmPassword: "",
            };
          } else {
            alert(res.msg);
          }
        });
    },
    handleAvatarSuccess(res) {
      this.imageUrl = res.data;
      this.form.avatarUrl = this.imageUrl;
    },
    save() {
      this.request.post("/user", this.form).then((res) => {
        if (res.code === "200") {
          this.$message.success("Saved successfully");
          for (let key in this.form) {
            this.user[key] = this.form[key];
          }
          localStorage.setItem("user", JSON.stringify(this.user));
          this.$emit("refresh");
          this.$router.go(0);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  created() {
    this.request.get("/userinfo/" + this.user.username).then((res) => {
      if (res.code === "200") {
        this.form = res.data;
      } else {
        alert(res.msg);
      }
    });
  },
  computed: {
    token() {
      return { token: this.user.token };
    },
  },
};
</script>

<style scoped>
.profile-page {
  padding: 38px 0;
}

.profile-card {
  width: min(760px, 100%);
  margin: 0 auto;
  padding: 8px;
}

.profile-header {
  margin-bottom: 22px;
}

.eyebrow {
  color: var(--mall-primary);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.profile-header h2 {
  margin: 8px 0 0;
  color: var(--mall-text);
  font-size: 30px;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}

.avatar-uploader {
  padding-bottom: 10px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 18px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--mall-primary);
  box-shadow: 0 0 0 4px rgba(91, 43, 214, 0.1);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: var(--mall-primary);
  width: 138px;
  height: 138px;
  line-height: 138px;
  text-align: center;
  background: var(--mall-primary-soft);
}

.avatar {
  width: 138px;
  height: 138px;
  display: block;
  object-fit: cover;
}

.profile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}

.profile-actions .el-button {
  min-width: 150px;
  height: 44px;
  border-radius: 10px;
  font-weight: 900;
}

@media (max-width: 680px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
