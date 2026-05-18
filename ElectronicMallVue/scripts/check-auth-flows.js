const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const loginVue = fs.readFileSync(path.join(root, "src/views/Login.vue"), "utf8");
const registerVue = fs.readFileSync(path.join(root, "src/views/Register.vue"), "utf8");

function assertContains(content, expected, message) {
  if (!content.includes(expected)) {
    throw new Error(message);
  }
}

function assertNotContains(content, unexpected, message) {
  if (content.includes(unexpected)) {
    throw new Error(message);
  }
}

assertContains(loginVue, 'v-model.trim="user.account"', "Login Account input must bind to user.account.");
assertContains(loginVue, 'account: ""', "Login form state must expose an account field.");
assertNotContains(loginVue, 'v-model.trim="user.username"', "Login Account input must not bind to user.username.");
assertContains(registerVue, 'localStorage.setItem("user", JSON.stringify(res.data))', "Registration success must store returned login state.");
assertContains(loginVue, 'localStorage.setItem("user", JSON.stringify(res.data))', "Password reset success must store returned login state.");

console.log("Auth flow checks passed.");
