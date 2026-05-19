<template>
    <div id="bk" class="wrapper">
        <div class="login-box">
            <div class="title">
                <b>Register</b>
            </div>
            <div style="margin-top: 30px">
                <el-form label-width="130px">
                    <el-form-item label="Username">
                        <el-input
                            v-model.trim="user.username"
                            aria-required="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="Email" style="margin-top: 20px">
                        <el-input
                            v-model.trim="user.email"
                            aria-required="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="Code" style="margin-top: 20px">
                        <div class="code-row">
                            <el-input
                                v-model.trim="user.code"
                                maxlength="6"
                                aria-required="true"
                            ></el-input>
                            <el-button
                                type="primary"
                                :disabled="sendingCode || countdown > 0"
                                @click="sendCode"
                            >
                                {{ countdown > 0 ? countdown + "s" : "Send Code" }}
                            </el-button>
                        </div>
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
.wrapper {
    height: 100vh;
    /* background-image: linear-gradient(to top right,#42b983,#B3C0D1); */
    background-color: #006400;
    overflow: auto;
}
.login-box {
    margin: 130px auto;
    padding: 40px;
    width: 520px;
    min-height: 430px;
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
.code-row {
    display: flex;
    gap: 10px;
}
.code-row .el-button {
    width: 120px;
    flex-shrink: 0;
}
</style>
