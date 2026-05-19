const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const requestJs = fs.readFileSync(path.join(root, "src/utils/request.js"), "utf8");
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

console.log("Deployment config checks passed.");
