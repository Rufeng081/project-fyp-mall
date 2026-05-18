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
                    <el-form-item label="Account">
                        <el-input
                            v-model.trim="user.account"
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
                    <div class="forgot-link" @click="resetDialogVisible = true">
                        Forgot password?
                    </div>
                </el-form>
            </div>
        </div>
        <el-dialog
            title="Reset Password"
            :visible.sync="resetDialogVisible"
            width="420px"
            @close="clearResetForm"
        >
            <el-form label-width="120px">
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
                <el-button type="success" @click="resetPassword">Reset Password</el-button>
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
            to: "/", //Login success redirect target
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
.forgot-link {
    margin-top: 8px;
    text-align: center;
    color: #006400;
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
</style>
