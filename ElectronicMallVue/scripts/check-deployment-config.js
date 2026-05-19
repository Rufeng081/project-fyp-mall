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
const repoRoot = path.resolve(root, "..");
const nginxConf = fs.readFileSync(path.join(repoRoot, "deploy/nginx/project-fyp-mall.conf"), "utf8");
const systemdServicePath = path.join(repoRoot, "deploy/systemd/project-fyp-mall-api.service");
const envExamplePath = path.join(repoRoot, "deploy/env/project-fyp-mall.env.example");
const deployReadmePath = path.join(repoRoot, "deploy/README.md");
const forbiddenProductionBackendUrls = [
  "http://localhost:9191",
  "localhost:9191",
  "127.0.0.1:9191",
];
const textFileExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".map",
  ".vue",
]);

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

function collectFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(entryPath);
    }
    return [entryPath];
  });
}

function isTextFile(filePath) {
  return textFileExtensions.has(path.extname(filePath));
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
assertContains(
  nginxConf,
  "root /var/www/project-fyp-mall;",
  "Nginx must serve production Vue dist files from /var/www/project-fyp-mall."
);
assertContains(
  nginxConf,
  "try_files $uri $uri/ /index.html;",
  "Nginx must use Vue history fallback."
);
assertContains(
  nginxConf,
  "proxy_pass http://127.0.0.1:9191/;",
  "Nginx must proxy /api/ to the local Spring Boot backend."
);

[
  [systemdServicePath, "Systemd service template is required."],
  [envExamplePath, "Environment example file is required."],
  [deployReadmePath, "Deployment README is required."],
].forEach(([filePath, message]) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(message);
  }
});

const systemdService = fs.readFileSync(systemdServicePath, "utf8");
const envExample = fs.readFileSync(envExamplePath, "utf8");
const deployReadme = fs.readFileSync(deployReadmePath, "utf8");

assertContains(
  systemdService,
  "EnvironmentFile=/etc/project-fyp-mall.env",
  "Systemd service must load /etc/project-fyp-mall.env."
);
assertContains(
  envExample,
  "MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads",
  "Environment example must document MALL_UPLOAD_DIR."
);
[
  "npm run build",
  "/var/www/project-fyp-mall",
  "project-fyp-mall-api.service",
  "uploads/file",
  "uploads/avatar",
  "ElectronicMallApi/file",
  "ElectronicMallApi/avatar",
  "localhost:9191",
].forEach((expected) => {
  assertContains(
    deployReadme,
    expected,
    `Deployment README must mention ${expected}.`
  );
});

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

[
  ...collectFiles(path.join(root, "src")).filter(isTextFile),
  path.join(root, ".env.production"),
].forEach((filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  forbiddenProductionBackendUrls.forEach((forbiddenUrl) => {
    assertNotContains(
      content,
      forbiddenUrl,
      `${path.relative(root, filePath)} must not contain ${forbiddenUrl}.`
    );
  });
});

const distPath = path.join(root, "dist");
if (fs.existsSync(distPath)) {
  collectFiles(distPath).filter(isTextFile).forEach((filePath) => {
    const content = fs.readFileSync(filePath, "utf8");
    forbiddenProductionBackendUrls.forEach((forbiddenUrl) => {
      assertNotContains(
        content,
        forbiddenUrl,
        `Built dist file ${path.relative(root, filePath)} must not contain ${forbiddenUrl}.`
      );
    });
  });
}

console.log("Deployment config checks passed.");
