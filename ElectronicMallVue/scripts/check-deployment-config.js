const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const requestJs = fs.readFileSync(path.join(root, "src/utils/request.js"), "utf8");
const routerJs = fs.readFileSync(path.join(root, "src/router/index.js"), "utf8");
const storeJs = fs.readFileSync(path.join(root, "src/store/index.js"), "utf8");
const frontVue = fs.readFileSync(path.join(root, "src/views/front/Front.vue"), "utf8");
const asideVue = fs.readFileSync(path.join(root, "src/components/Aside.vue"), "utf8");
const fileVue = fs.readFileSync(path.join(root, "src/views/manage/file/File.vue"), "utf8");
const productionEnv = fs.readFileSync(path.join(root, ".env.production"), "utf8");

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

assertContains(
  requestJs,
  "process.env.VUE_APP_API_BASE_URL",
  "Axios baseURL must use VUE_APP_API_BASE_URL for deployment."
);
assertNotContains(
  requestJs,
  "baseURL: 'http://localhost:9191'",
  "Axios baseURL must not be hardcoded to the local backend."
);
assertContains(
  productionEnv,
  "VUE_APP_API_BASE_URL=/api",
  "Production build must route API calls through the Nginx /api reverse proxy."
);
assertContains(
  productionEnv,
  "VUE_APP_RESOURCE_BASE_URL=/api",
  "Production build must resolve uploaded resources through the Nginx /api reverse proxy."
);

[
  ["src/router/index.js", routerJs],
  ["src/store/index.js", storeJs],
  ["src/views/front/Front.vue", frontVue],
  ["src/components/Aside.vue", asideVue],
  ["src/views/manage/file/File.vue", fileVue],
].forEach(([fileName, content]) => {
  assertNotContains(
    content,
    "http://localhost:9191",
    `${fileName} must not call the local backend directly in production code.`
  );
});

console.log("Deployment config checks passed.");
