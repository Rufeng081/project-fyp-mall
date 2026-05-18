const http = require("http");

const host = process.env.FRONTEND_HOST || "localhost";
const port = Number(process.env.FRONTEND_PORT || 9192);

const routes = [
  "/",
  "/topview",
  "/login",
  "/register",
  "/goodList",
  "/goodView/3",
  "/cart",
  "/preOrder",
  "/pay",
  "/orderList",
  "/person",
  "/manage/home",
];

function requestRoute(path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host,
        port,
        path,
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          resolve({
            path,
            statusCode: res.statusCode,
            contentType: res.headers["content-type"] || "",
            body,
          });
        });
      }
    );

    req.on("error", reject);
    req.end();
  });
}

(async () => {
  const results = await Promise.all(routes.map(requestRoute));
  const failures = results.filter((result) => {
    return (
      result.statusCode !== 200 ||
      !result.contentType.includes("text/html") ||
      !result.body.includes('<div id="app"></div>')
    );
  });

  if (failures.length > 0) {
    console.error("History route fallback check failed:");
    failures.forEach((failure) => {
      console.error(
        `- ${failure.path}: status=${failure.statusCode}, content-type=${failure.contentType}`
      );
    });
    process.exit(1);
  }

  console.log(`History route fallback check passed for ${routes.length} routes.`);
})();
