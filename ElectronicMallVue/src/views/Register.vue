<!--
 * @Description: 
 * @Author: Rabbiter
 * @Date: 2023-03-26 15:27:05
-->
<template>
    <div id="bk" class="wrapper">
        <div class="login-box">
            <div class="title">
                <b>Register</b>
            </div>
            <div style="margin-top: 30px">
                <el-form label-width="70px">
                    <el-form-item label="Username">
                        <el-input
                            v-model.trim="user.username"
                            aria-required="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="Password" style="margin-top: 25px">
                        <el-input
                            v-model.trim="user.password"
                            show-password
                            aria-required="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="Confirm Password" style="margin-top: 25px">
                        <el-input
                            v-model.trim="user.confirmPassword"
                            show-password
                            aria-required="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item style="text-align: center;">
                        <el-button
                            type="success"
                            @click="onSubmit"
                            style="font-size: 22px"
                        >
                            <i
                                class="iconfont icon-r-add"
                                style="font-size: 22px"
                            ></i
                            >Register</el-button
                        >
                        <el-button
                            @click="$router.push('/login')"
                            style="font-size: 22px"
                        >
                            <i
                                class="iconfont icon-r-left"
                                style="font-size: 22px"
                            ></i
                            >Back</el-button
                        >
                    </el-form-item>
                </el-form>
            </div>
        </div>
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
                password: "",
                confirmPassword: "",
            },
        };
    },
    methods: {
        onSubmit() {
            if (
                this.user.username === "" ||
                this.user.password === "" ||
                this.user.confirmPassword === ""
            ) {
                this.$message.error("Account and password are required");
                return false;
            }
            if (this.user.password !== this.user.confirmPassword) {
                this.$message.error("Passwords do not match");
                return false;
            }
            const form = {
                username: this.user.username,
                password: md5(this.user.password),
            };
            this.request.post("/register", form).then((res) => {
                if (res.code === "200") {
                    this.$message.success("Registered successfully");
                    this.$router.push("/login");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
    },
};
</script>

<style scoped>
.wrapper {
    height: 100vh;
    /* background-image: linear-gradient(to top right,#42b983,#B3C0D1); */
    background-color: #006400;
    overflow: auto;
}
.login-box {
    margin: 220px auto;
    padding: 40px;
    width: 450px;
    height: 310px;
    background-color: #ffffff;
    border-radius: 10px;
}
.title {
    text-align: center;
    margin-top: 10px;
    font-size: 25px;
    color: #006400;
}

#bk {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    overflow-y: auto;
    height: 100%;
    background: url("../resource/01.jpg") center top / cover no-repeat;
}
</style>
