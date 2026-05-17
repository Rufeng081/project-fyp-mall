<!--
 * @Description: 
 * @Author: Rabbiter
 * @Date: 2023-03-26 15:27:05
-->
<template>
    <div id="bk" class="wrapper">
        <div class="login-box">
            <div class="title">
                <img
                    src="@/resource/03.png"
                    style="
                        width: 30px;
                        height: 30px;
                        margin: 0 5px -5px 0;
                        -webkit-user-drag: none;
                        -khtml-user-drag: none;
                        -moz-user-drag: none;
                        user-drag: none;
                    "
                />
                <b style="font-size: 28px">Login - Online Mall</b>
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
                    <el-form-item style="text-align: center;">
                        <el-button
                            type="success"
                            @click="onSubmit"
                            style="font-size: 22px"
                        >
                            <i
                                class="iconfont icon-r-yes"
                                style="font-size: 22px"
                            ></i
                            >Login</el-button
                        >
                        <el-button
                            @click="$router.push('/register')"
                            style="font-size: 22px"
                            >
                            <i
                                class="iconfont icon-r-add"
                                style="font-size: 22px"
                            ></i
                            >Register</el-button
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
    name: "Login",
    data() {
        return {
            to: "/", //Login success redirect target
            user: {
                username: "",
                password: "",
            },
        };
    },
    created() {
        this.to = this.$route.query.to ? this.$route.query.to : "/";
    },
    methods: {
        onSubmit() {
            if (this.user.username === "" || this.user.password === "") {
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
.wrapper {
    height: 100vh;
    background-color: rgb(161, 202, 220);
    overflow: auto;
}
.login-box {
    margin: 220px auto;
    padding: 40px;
    width: 450px;
    height: 280px;
    background-color: #ffffff;
    border-radius: 10px;
}
.title {
    text-align: center;
    margin: 30px auto;
    font-size: 25px;
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
