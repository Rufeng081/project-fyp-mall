const http = require("http");

const host = process.env.API_HOST || "localhost";
const port = Number(process.env.API_PORT || 9191);
const defaultPasswordHash = "e10adc3949ba59abbe56e057f20f883e";

function request(method, path, body, token, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : "";
    const headers = {
      "Content-Type": "application/json",
      ...extraHeaders,
    };

    if (token) {
      headers.token = token;
    }
    if (payload) {
      headers["Content-Length"] = Buffer.byteLength(payload);
    }

    const req = http.request({ host, port, path, method, headers }, (res) => {
      let responseBody = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        let parsedBody = responseBody;
        try {
          parsedBody = responseBody ? JSON.parse(responseBody) : null;
        } catch (error) {
          // Keep raw response text for diagnostics.
        }
        resolve({
          statusCode: res.statusCode,
          contentType: res.headers["content-type"] || "",
          body: parsedBody,
        });
      });
    });

    req.on("error", reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

function assert(condition, message, details) {
  if (!condition) {
    const suffix = details ? `\n${JSON.stringify(details, null, 2)}` : "";
    throw new Error(`${message}${suffix}`);
  }
}

async function expectResult(method, path, body, token) {
  const response = await request(method, path, body, token);
  assert(response.statusCode === 200, `${method} ${path} did not return HTTP 200`, response);
  assert(response.body && response.body.code === "200", `${method} ${path} did not return code 200`, response);
  return response.body.data;
}

(async () => {
  const goods = await expectResult("GET", "/api/good");
  assert(Array.isArray(goods) && goods.length > 0, "Product list is empty", goods);
  assert(goods.some((good) => good.name === "Study Desk and Chair Set"), "Localized product seed not found", goods);

  const categories = await expectResult("GET", "/api/icon");
  assert(JSON.stringify(categories).includes("Food and Beverages"), "Localized category seed not found", categories);

  const carousel = await expectResult("GET", "/api/carousel");
  assert(Array.isArray(carousel) && carousel.length > 0, "Carousel list is empty", carousel);

  const goodDetail = await expectResult("GET", "/api/good/3");
  assert(goodDetail.name === "Study Desk and Chair Set", "Product detail returned unexpected product", goodDetail);

  const standardsJson = await expectResult("GET", "/api/good/standard/3");
  const standards = JSON.parse(standardsJson);
  assert(standards.some((standard) => standard.value === "Chair"), "Expected product variant not found", standards);

  const imageResponse = await request("GET", goods[0].imgs);
  assert(imageResponse.statusCode === 200, "Product image endpoint did not return HTTP 200", imageResponse);

  const registrationUsername = `phase12check_${Date.now()}`;
  const registration = await expectResult("POST", "/register", {
    username: registrationUsername,
    password: defaultPasswordHash,
  });
  assert(registration.username === registrationUsername, "Registration returned unexpected username", registration);

  const registeredLogin = await expectResult("POST", "/login", {
    username: registrationUsername,
    password: defaultPasswordHash,
  });
  assert(registeredLogin.role === "user", "Registered login returned unexpected role", registeredLogin);

  const login = await expectResult("POST", "/login", {
    username: "user",
    password: defaultPasswordHash,
  });
  assert(login.id === 2 && login.role === "user", "Default demo user login returned unexpected data", login);

  const token = login.token;
  const userId = await request("GET", "/userid", null, token);
  assert(userId.statusCode === 200 && userId.body === 2, "Authenticated user ID check failed", userId);

  const addresses = await expectResult("GET", "/api/address/2", null, token);
  assert(Array.isArray(addresses) && addresses.length > 0, "Demo user has no address data", addresses);
  assert(addresses[0].linkPhone.startsWith("+60"), "Demo address phone is not Malaysia-style", addresses[0]);
  assert(addresses[0].linkAddress.includes("Malaysia"), "Demo address is not Malaysia-context", addresses[0]);

  await expectResult("POST", "/api/cart", {
    count: 1,
    goodId: 3,
    standard: "Chair",
    userId: 2,
  }, token);

  const cartItems = await expectResult("GET", "/api/cart/userid/2", null, token);
  const cartItem = cartItems
    .filter((item) => item.goodId === 3 && item.standard === "Chair" && item.userId === 2)
    .sort((a, b) => b.id - a.id)[0];
  assert(cartItem, "Created cart item was not returned by cart query", cartItems);

  const orderNo = await expectResult("POST", "/api/order", {
    totalPrice: 50.0,
    linkUser: addresses[0].linkUser,
    linkPhone: addresses[0].linkPhone,
    linkAddress: addresses[0].linkAddress,
    state: "Pending Payment",
    goods: JSON.stringify([{ id: 3, standard: "Chair", num: 1 }]),
    cartId: cartItem.id,
  }, token);
  assert(/^\d{20}$/.test(orderNo), "Order creation returned an unexpected order number", orderNo);

  await expectResult("GET", `/api/order/paid/${orderNo}`, null, token);

  const orderHistory = await expectResult("GET", "/api/order/userid/2", null, token);
  const paidOrder = orderHistory.find((order) => order.order_no === orderNo);
  assert(paidOrder && paidOrder.state === "Paid", "Paid order was not found in order history", {
    orderNo,
    paidOrder,
  });

  const visibleBusinessPayload = JSON.stringify({
    goods,
    categories,
    carousel,
    goodDetail,
    addresses,
    paidOrder,
  });
  assert(!/[\u4e00-\u9fff]/.test(visibleBusinessPayload), "Visible business API payload contains Chinese characters");

  console.log(JSON.stringify({
    productCount: goods.length,
    categoryGroups: categories.length,
    carouselItems: carousel.length,
    registeredUser: registrationUsername,
    demoUser: login.username,
    cartItemId: cartItem.id,
    orderNo,
    orderState: paidOrder.state,
    deliveryPhone: paidOrder.link_phone,
  }, null, 2));
})().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
