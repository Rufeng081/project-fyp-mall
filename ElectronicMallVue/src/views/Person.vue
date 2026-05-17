<template>
  <el-card class="card">
    <div style="text-align: center; margin-bottom: 30px">
      <b>Edit Profile</b>
    </div>

    <el-form label-width="60px">
      <el-form-item label="Avatar">
        <el-upload
          class="avatar-uploader"
          :action="baseApi + '/avatar'"
          :headers="token"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img
            v-if="form.avatarUrl"
            :src="baseApi + form.avatarUrl"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

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
      <el-button
        type="primary"
        style="margin-left: 190px; margin-top: 20px"
        @click="save"
        >Confirm</el-button
      >
    </el-form>
    <el-popover placement="right" width="200" trigger="click">
      <el-form>
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
        <el-button style="font-size: 15px;" type="primary" @click="toResetPassword"
          >Confirm</el-button
        >
      </el-form>
      <el-button
        slot="reference"
        type="warning"
        style="margin-left: 190px; margin-top: 20px"
        @click="resetPsw = { newPassword: '', confirmPassword: '' }"
        >Reset Password</el-button
      >
    </el-popover>
  </el-card>
</template>

<script>
import md5 from "js-md5";

export default {
  name: "Person",
  data() {
    return {
      form: {},
      baseApi: this.$store.state.baseApi,
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {},
      resetPsw: {
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    toResetPassword() {
      // Reset Password
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
    //Image upload success hook
    handleAvatarSuccess(res) {
      this.imageUrl = res.data;
      this.form.avatarUrl = this.imageUrl;
    },
    //Submit event
    save() {
      //Send the form to the API and save it
      this.request.post("/user", this.form).then((res) => {
        if (res.code === "200") {
          this.$message.success("Saved successfully");
          //Update local user data with form values
          for (let key in this.form) {
            this.user[key] = this.form[key];
          }
          //Update localStorage user
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
    // this.form = this.user;
  },
  computed: {
    token() {
      return { token: this.user.token };
    },
  },
};
</script>

<style scoped>
.card {
  width: 500px;
  margin: 80px auto;
  padding: 30px;
}
.avatar-uploader {
  padding-bottom: 10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 138px;
  height: 138px;
  line-height: 138px;
  text-align: center;
}
.avatar {
  width: 138px;
  height: 138px;
  display: block;
}
</style>
