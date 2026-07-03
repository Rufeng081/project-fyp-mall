# D5 Rewrite Context Pack - 2026-06-27

本文件用于提供给 GPT 或其他写作助手，作为重写 `report/D5_update_20260420_v1.md` 的事实基础和修改指引。请不要把本文件当作最终 D5 正文直接提交；它是“写作资料包”。

---

## 1. 本次 D5 重写的核心结论

旧版 D5 已经不适合当前项目状态。旧 D5 把项目写成“安全容器化高并发电商基础设施”，包含 Docker、OAuth 2.0、Alipay Sandbox、WeChat OAuth、HTTPS 对比、实时遥测、`Network_Trace_Log`、自定义 Secure Callback Processing 算法、容器桥接网络、负载均衡和实时网络仪表盘等内容。

当前项目的真实完成状态是：

- 项目名称方向：**Development and Network Performance Evaluation of a Cloud-Based Small E-Commerce Platform**
- 系统名称可写为：**R Mall**
- 项目类型：Network Technology FYP，方向属于 Cloud Computing / Network Application / Network Performance Evaluation。
- 当前实现是一个小型云端电商平台，不是商业级大规模电商，不是微服务，不是 Docker/Kubernetes 项目。
- 核心技术栈：Vue 2 + Spring Boot 2.5.6 + MyBatis/MyBatis-Plus + MySQL + Redis + Nginx + Google Cloud VM + Apache JMeter。
- 主要业务流程已完成：注册/登录、邮箱验证码注册、忘记密码重置、商品浏览、商品详情、购物车、下单、模拟支付、订单历史、基础后台管理。
- 云端部署已完成：Google Cloud VM 公开 HTTP 服务，Nginx 监听 80 端口，Vue 前端由 Nginx 提供，Spring Boot 后端运行在 9191 并由 Nginx 反向代理，MySQL/Redis 在 VM 内运行。
- JMeter 性能评估已完成：8 个 JMX 测试计划，官方汇总为 3,197 次 sampler 执行，0 个错误，整体错误率 0.00%。
- 当前生产/测试部署是 **HTTP only**。没有证据表明已经配置 HTTPS、TLS 证书、443 端口、HTTP 到 HTTPS 重定向，也没有执行 HTTP 与 HTTPS 性能对比。

D5 的写作目标应从“计划阶段虚构的高级架构”改成“已实现的小型云端电商平台及其网络性能评估方案/证据”。D5 仍是 Proposal Report，但现在应基于实际项目事实重写，避免继续保留未实现内容。

---

## 2. D5 指南要求

本地指南文件：`report/guidelines/d5-NT- guidelines.pdf`

PDF 中 D5 叫 **Proposal Report**，主要结构要求如下：

1. Abstract
2. Chapter 1: Project Planning，来自 D1
3. Chapter 2: Literature Review，来自 D2
4. Chapter 3: Methodology，来自 D3 和 D4
5. References
6. Appendix

指南还要求：

- D5 页数大约 30-50 页。
- References 至少 10 个，最近 5 年来源为主，使用 GAYA UKM / UKM style。
- Network Technology 项目需要说明网络协议、OSI 模型、网络拓扑、通信工具/技术/协议使用，并进行测试和分析。
- D5 应体现“构建应用、测试应用、通过不同参数产生结果、分析结果”的 Network Technology 特征。

因此，新 D5 不应该只写普通电商功能，而要强调：

- 浏览器、Nginx、Spring Boot、MySQL、Redis 之间的请求传输路径。
- HTTP request/response、RESTful API、TCP/IP、JSON payload、Nginx reverse proxy 的作用。
- 云端 VM 中服务端口、私有服务暴露边界、公开入口与内部后端之间的关系。
- JMeter 如何通过并发线程、ramp-up、loops 等参数测试响应时间、吞吐量和错误率。

---

## 3. 当前项目的准确信息

### 3.1 项目定位

建议在 D5 中统一使用以下定位：

> This project develops and evaluates R Mall, a cloud-based small e-commerce platform designed for a Network Technology Final Year Project. The platform provides realistic e-commerce user journeys so that client-server-database communication and cloud deployment performance can be tested under controlled simulated user loads.

不要把项目写成：

- commercial-scale marketplace
- microservice architecture
- Docker/Kubernetes cluster
- real payment system
- AI recommendation platform
- cybersecurity framework
- high-availability production architecture

### 3.2 当前仓库结构

根目录主要内容：

| 路径 | 作用 |
|---|---|
| `ElectronicMallVue/` | Vue 2 前端，包含客户页面、后台页面、路由、Axios、构建脚本 |
| `ElectronicMallApi/` | Spring Boot 后端，包含 controller、service、entity、mapper、配置、测试 |
| `database/` | MySQL 初始化 SQL 和迁移记录 |
| `deploy/` | Nginx、systemd、环境变量模板 |
| `docs/` | 项目目标、数据库、工程、部署、验证、JMeter、阶段报告 |
| `report/` | D5 旧版、D6 实现文档、指南和截图 |
| `tools/` | 验证和辅助脚本 |

写 D5 时应引用 `docs/` 和源码作为当前事实来源。根目录 `README.md` 有部分旧状态，例如仍写 JMeter planned，因此应以 `docs/README.md`、`docs/reports/`、`docs/testing/jmeter/`、`report/D6_Implementation.md` 为主。

### 3.3 当前技术栈

| 层次 | 当前技术 |
|---|---|
| Frontend | Vue 2.6.14, Vue Router 3.5.1, Vuex 3.6.2, Element UI, Axios 0.26.1, ECharts |
| Backend | Java 8, Spring Boot 2.5.6, Spring Web, MyBatis, MyBatis-Plus |
| Database | MySQL, schema name `electronic_mall` |
| Temporary state | Redis |
| Email | Spring Boot Mail + Brevo SMTP |
| Deployment | Google Cloud VM, Ubuntu 22.04 LTS, Nginx, systemd |
| Testing | Maven tests/package, npm build/check scripts, Node verification scripts, Apache JMeter 5.6.3 |

### 3.4 当前项目公共访问和部署事实

可写入 D5 的部署事实：

- VM 名称：`fyp-mall-vm`
- Zone：`asia-southeast1-b`
- OS：Ubuntu 22.04 LTS
- Machine type：`e2-medium`
- Public endpoint：`http://34.143.225.11/`
- Nginx public port：80
- Spring Boot internal port：9191
- Backend service：systemd 管理的 Spring Boot JAR
- Frontend：Vue production build 由 Nginx 静态提供
- Data services：MySQL + Redis 在 VM 内运行
- Persistent uploads：`MALL_UPLOAD_DIR=/opt/project-fyp-mall/uploads`

不要在 D5 中写任何真实密码、SMTP key、数据库密码、phpMyAdmin 密码或其他 secret。可以说“credentials are stored in environment variables and are not committed to the repository”。

### 3.5 当前 Nginx 网络路径

真实 Nginx 配置文件：`deploy/nginx/project-fyp-mall.conf`

当前配置要点：

```nginx
server {
    listen 80;
    root /var/www/project-fyp-mall;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:9191/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

写法建议：

- Nginx 是 public entry point。
- Nginx 同时负责 Vue SPA static file serving 和 `/api/` reverse proxy。
- `try_files` 支持 Vue Router history mode deep links。
- `/api/` 请求被转发到 `127.0.0.1:9191`。
- 后端端口不直接暴露给公网。
- `X-Real-IP` 和 `X-Forwarded-For` 让后端可以保留原始客户端信息。

当前外部路径有一个重要 legacy mapping：

| 后端路径类型 | 后端路径 | 当前公网路径 |
|---|---|---|
| backend root route | `/login` | `/api/login` |
| backend root route | `/userid` | `/api/userid` |
| backend `/api/*` route | `/api/good` | `/api/api/good` |
| backend `/api/*` route | `/api/order/...` | `/api/api/order/...` |
| file resource | `/file/<name>` | `/api/file/<name>` |
| avatar resource | `/avatar/<name>` | `/api/avatar/<name>` |

D5 可以简化说明为“production Axios base path is `/api`, and Nginx forwards the first `/api/` segment to the backend”。如果写具体 API URL，需要注意双 `/api` 映射。

---

## 4. 当前功能范围

### 4.1 客户端功能

当前客户侧功能包括：

- 用户注册
- 邮箱验证码注册
- 登录，支持 username 或 email
- 忘记密码，通过邮箱验证码重置
- 首页商品和轮播展示
- 商品分类和商品列表
- 商品搜索/过滤
- 商品详情
- 规格/variant 选择
- 加入购物车
- 购物车查看、更新和删除
- 确认订单
- 模拟支付
- 订单历史
- 个人资料
- 上传/显示头像

### 4.2 管理员功能

当前后台功能包括：

- 管理员登录
- Dashboard
- 用户管理
- 商品管理
- 商品规格管理
- 分类管理
- 轮播管理
- 订单管理
- 文件管理
- 头像管理
- 收入图表/排名视图

写 D5 时可以说 admin functions support demonstration and data maintenance, but they are not the main academic focus.

### 4.3 本项目不包含的功能

D5 必须明确排除：

- Real payment gateway integration
- Alipay / WeChat Pay / Stripe integration
- WeChat OAuth / OAuth login
- Docker deployment
- Kubernetes
- Microservices
- Horizontal load-balancing cluster
- CDN
- Auto-scaling
- AI recommendation
- Real delivery/logistics tracking
- Refund/invoice/commercial settlement
- Production-grade security hardening
- Production-grade concurrent order benchmark

---

## 5. 当前核心业务流程

建议 D5 反复围绕以下 golden path 写：

```text
Register / Login
-> Browse Products
-> View Product Details
-> Add to Cart
-> Place Order
-> Complete Simulated Payment
-> View Order History
```

这个流程的网络意义：

1. Browser loads Vue SPA from Nginx.
2. Vue sends Axios JSON requests through `/api`.
3. Nginx reverse-proxies API requests to Spring Boot on loopback port 9191.
4. Spring Boot controller receives the request and calls service logic.
5. Service layer queries or updates MySQL through MyBatis.
6. Redis is used for login session, email verification code, resend cooldown, and selected cached data.
7. Backend returns JSON result to Nginx, then to browser.
8. JMeter simulates the same public HTTP paths under different thread counts.

---

## 6. Backend implementation facts

### 6.1 Backend structure

Backend root：`ElectronicMallApi/`

Main application class：

- `ElectronicMallApi/src/main/java/com/rufeng/em/ElectronicMallApplication.java`

Important packages：

| Package / path | 作用 |
|---|---|
| `controller/` | REST endpoints |
| `service/` | business logic |
| `mapper/` | MyBatis mapper interfaces |
| `resources/mapper/` | SQL XML mappings |
| `entity/` | persistent entities |
| `entity/dto/` | request/response DTOs |
| `interceptor/` | JWT and authority interceptors |
| `config/` | CORS, Redis, MyBatis, interceptors, upload path, Swagger |
| `exception/` | global exception handling |

### 6.2 Main controllers

Current controllers：

- `AuthController`
- `UserController`
- `GoodController`
- `CategoryController`
- `IconController`
- `CarouselController`
- `CartController`
- `AddressController`
- `OrderController`
- `FileController`
- `AvatarController`
- `RoleController`
- `IncomeController`

Representative APIs：

| Endpoint | Method | Purpose |
|---|---|---|
| `/login` | POST | Login using username/email and password |
| `/register` | POST | Legacy/basic registration route |
| `/api/auth/send-email-code` | POST | Send verification code for registration or password reset |
| `/api/auth/register-by-email` | POST | Register after email code verification |
| `/api/auth/reset-password-by-email` | POST | Reset password after email code verification |
| `/api/good` | GET | Product data |
| `/api/good/page` | GET | Product page/search |
| `/api/good/{id}` | GET | Product detail |
| `/api/good/standard/{id}` | GET | Product variants |
| `/api/cart` | POST/PUT/DELETE | Cart operations |
| `/api/cart/userid/{userId}` | GET | User cart |
| `/api/order` | POST | Create order |
| `/api/order/paid/{orderNo}` | GET | Simulated payment |
| `/api/order/userid/{userid}` | GET | User order history |
| `/file/{fileName}` | GET | Product image download |
| `/avatar/{fileName}` | GET | Avatar download |

### 6.3 Authentication and Redis session

Important files：

- `ElectronicMallApi/src/main/java/com/rufeng/em/service/UserService.java`
- `ElectronicMallApi/src/main/java/com/rufeng/em/interceptor/JwtInterceptor.java`
- `ElectronicMallApi/src/main/java/com/rufeng/em/config/InterceptorConfig.java`

Facts：

- Login accepts an `account` value or `username`; account can be username or email.
- Password comparison follows existing MD5-from-frontend compatibility.
- After login/registration/reset, backend returns a `UserDTO` containing token.
- Token is JWT-generated.
- The corresponding user session is stored in Redis under a token key.
- Redis session TTL is refreshed on authenticated requests.
- Missing or invalid token returns a session-expired style error.
- Public endpoints include login, register, auth email endpoints, product/category/icon/carousel browsing, and file/avatar resources.
- Admin routes are checked through authority logic.

Limitations to state：

- Password hashing is not production-grade. The project uses existing frontend MD5 for demo compatibility.
- Future work should use server-side salted hashing such as bcrypt or Argon2.

### 6.4 Email verification

Important files：

- `ElectronicMallApi/src/main/java/com/rufeng/em/service/EmailVerificationService.java`
- `ElectronicMallApi/src/main/java/com/rufeng/em/controller/AuthController.java`
- `ElectronicMallApi/src/main/java/com/rufeng/em/entity/dto/EmailCodeRequest.java`
- `ElectronicMallApi/src/main/java/com/rufeng/em/entity/dto/EmailRegisterRequest.java`
- `ElectronicMallApi/src/main/java/com/rufeng/em/entity/dto/EmailPasswordResetRequest.java`

Facts：

- Uses Spring Boot Mail with Brevo SMTP.
- SMTP credentials are read from environment variables:
  - `BREVO_SMTP_USERNAME`
  - `BREVO_SMTP_KEY`
  - `BREVO_SENDER_EMAIL`
- Generates 6-digit verification codes.
- Code TTL: 5 minutes.
- Resend cooldown: 60 seconds.
- Redis key format:
  - `auth:email:code:{purpose}:{email}`
  - `auth:email:cooldown:{purpose}:{email}`
- Purpose is `register` or `reset`.
- Code is deleted after successful verification.
- Redis code and cooldown keys are removed if SMTP sending fails.
- Duplicate email registration is rejected.
- Password reset only works for an existing email.
- Email subject: `[FYP-UKM] R Mall Demo Verification Code`

This module is a better fit for D5 than old OAuth/WeChat claims. Replace all WeChat OAuth sections with email verification + JWT/Redis session flow.

### 6.5 Order and simulated payment

Important files：

- `ElectronicMallApi/src/main/java/com/rufeng/em/service/OrderService.java`
- `ElectronicMallApi/src/main/java/com/rufeng/em/controller/OrderController.java`
- `ElectronicMallApi/src/main/resources/mapper/Order.xml`
- `ElectronicMallApi/src/main/resources/mapper/OrderGoods.xml`

Facts：

- `saveOrder()` is transactional.
- It sets current user ID from token/current user context.
- It generates an order number from datetime + random digits.
- It inserts order header into `t_order`.
- It parses selected goods and inserts line items into `order_goods`.
- It removes the selected cart entry.
- `payOrder()` is transactional.
- It marks the order as paid.
- It retrieves product variant and quantity.
- It checks stock.
- It deducts stock from `good_standard`.
- It updates sales count and sale amount in `good`.
- It updates cached Redis product sales when applicable.
- This is simulated payment only; no external payment gateway exists.

Replace old Alipay Sandbox / webhook / secure callback algorithm with this transactional simulated payment flow.

---

## 7. Frontend implementation facts

### 7.1 Frontend structure

Frontend root：`ElectronicMallVue/`

Important files：

- `ElectronicMallVue/src/router/index.js`
- `ElectronicMallVue/src/utils/request.js`
- `ElectronicMallVue/src/views/Login.vue`
- `ElectronicMallVue/src/views/Register.vue`
- `ElectronicMallVue/src/views/front/TopView.vue`
- `ElectronicMallVue/src/views/front/good/GoodList.vue`
- `ElectronicMallVue/src/views/front/good/GoodView.vue`
- `ElectronicMallVue/src/views/front/good/Cart.vue`
- `ElectronicMallVue/src/views/front/order/PreOrder.vue`
- `ElectronicMallVue/src/views/front/order/Pay.vue`
- `ElectronicMallVue/src/views/front/order/OrderList.vue`
- `ElectronicMallVue/src/views/manage/Manage.vue`

### 7.2 Current frontend behavior

Facts：

- Vue Router uses history mode.
- Customer route group is under `/`, redirecting to `/topview`.
- Protected customer pages include profile, cart, confirm order, payment, and order list.
- Admin route group is `/manage`, protected by role check.
- Unauthenticated protected customer pages redirect to `/login`.
- Production Axios base URL defaults to `/api`.
- Axios request interceptor injects `token` header from `localStorage.user`.
- Axios response interceptor handles invalid session codes and redirects to login.
- Frontend localizes visible UI into English.
- Prices display in RM.
- Simulated payment view calls the paid-order endpoint and routes to order history.

### 7.3 UI/localization facts

Current UI has been localized for FYP demo:

- English visible text.
- Malaysia-style addresses.
- Malaysia phone format.
- RM currency.
- Simulated payment instead of China payment labels.
- Product catalog expanded with culturally respectful products.

Evidence：

- `docs/reports/phase-1-2-localization-stabilization-report.md`
- `docs/records/product-catalog-image-review-cloud-sync-2026-06-27.md`
- screenshots in `report/screenshot/`
- verified screenshot: `docs/assets/phase-2-order-history-verified.png`

---

## 8. Database facts

Canonical SQL：

- `database/electronic_mall.sql`

Current database：

- Database name：`electronic_mall`
- Tables：13 `CREATE TABLE` statements
- Product rows：58 `good` rows
- Product variant rows：115 `good_standard` rows

Current tables：

1. `address`
2. `avatar`
3. `carousel`
4. `cart`
5. `category`
6. `good`
7. `good_standard`
8. `icon`
9. `icon_category`
10. `order_goods`
11. `sys_file`
12. `sys_user`
13. `t_order`

Important design facts：

- `sys_user` stores customers/admins and has a unique email index.
- `address` stores delivery address information for users.
- `category`, `icon`, and `icon_category` support category navigation.
- `good` stores product master data.
- `good_standard` stores product variants, prices, and stock.
- `cart` stores user cart rows.
- `t_order` stores order headers.
- `order_goods` stores order line items.
- `carousel` stores homepage carousel product links.
- `sys_file` and `avatar` store media metadata.
- There is no `Network_Trace_Log` table in the current schema.
- There is no telemetry-domain database table for WAN/container latency logging.

Use this database design instead of old D5 tables such as Users/Products/Orders/Order_Items plus `Network_Trace_Log`.

Evidence：

- `docs/database/DATABASE_DESIGN.md`
- `docs/database/ERD_EXPLANATION.md`
- `database/electronic_mall.sql`

---

## 9. JMeter and performance evaluation facts

### 9.1 JMeter files

JMeter plans：

- `docs/testing/jmeter/01_homepage.jmx`
- `docs/testing/jmeter/02_product_list.jmx`
- `docs/testing/jmeter/03_product_detail.jmx`
- `docs/testing/jmeter/04_login.jmx`
- `docs/testing/jmeter/05_add_to_cart.jmx`
- `docs/testing/jmeter/06_place_order.jmx`
- `docs/testing/jmeter/07_simulated_payment.jmx`
- `docs/testing/jmeter/08_order_history.jmx`

Results：

- `docs/testing/jmeter/results/phase6-summary/summary-tables.md`
- `docs/testing/jmeter/results/phase6-summary/aggregate-results.csv`
- `docs/testing/jmeter/results/phase6-summary/charts/p90-response-time-ms.svg`
- `docs/testing/jmeter/results/phase6-summary/charts/throughput-per-second.svg`

Report：

- `docs/reports/phase-6-jmeter-performance-evaluation-report.md`

### 9.2 JMeter target

All JMX files use:

- `BASE_PROTOCOL=http`
- `BASE_HOST=34.143.225.11`
- `BASE_PORT=80`
- `API_PREFIX=/api`

This proves the executed JMeter evaluation is HTTP only.

### 9.3 Executed matrix

| Category | Plans | Threads |
|---|---|---|
| Smoke | 01 to 08 | 1 thread, 1 loop |
| Read-only load | homepage, product list, product detail | 10, 50, 100, 200 |
| Authenticated load | login, order history | 10, 50, 100 |
| Controlled mutation | add to cart, place order, simulated payment | 1, 5, 10 |

### 9.4 Key results

Official Phase 6 summary：

- Total summarized result rows：35
- Total JMeter sampler executions：3,197
- Total JMeter errors：0
- Overall observed error rate：0.00%
- Load and mutation sampler executions：3,176
- Load and mutation errors：0

Selected highest-concurrency results：

| Scenario | Highest threads | Samples | Error rate | Average ms | P90 ms | Throughput/s |
|---|---:|---:|---:|---:|---:|---:|
| Homepage | 200 | 800 | 0.00% | 1491.54 | 2457 | 12.32 |
| Product list | 200 | 200 | 0.00% | 1936.82 | 3400 | 3.28 |
| Product detail | 200 | 400 | 0.00% | 2302.22 | 3659 | 6.09 |
| Login | 100 | 100 | 0.00% | 2067.24 | 3116 | 2.32 |
| Order history | 100 | 200 | 0.00% | 1170.88 | 1986 | 4.61 |
| Add to cart | 10 | 20 | 0.00% | 949.70 | 2035 | 1.51 |
| Place order | 10 | 40 | 0.00% | 1320.25 | 1882 | 3.00 |
| Simulated payment | 10 | 50 | 0.00% | 254.82 | 441 | 4.79 |

Correct interpretation：

- The system is usable for FYP demonstration and controlled thesis evidence.
- Read-only browsing tolerated up to 200 simulated users in the tested pattern with 0 errors.
- Login and order-history tolerated up to 100 simulated users with 0 errors.
- Mutation flows were intentionally limited to 10 users because they affect live cart/order/stock data.
- High-load P90 response times are multi-second for browsing scenarios, so D5 should not claim commercial-scale optimization.
- Future work can include caching, SQL optimization, frontend asset optimization, HTTPS setup, and scalable architecture.

### 9.5 Database impact during mutation tests

Phase 6 mutation tests changed live data:

- Before baseline：`t_order` rows 3, `cart` rows 3, Chair stock 500.
- After smoke：`t_order` rows 5, `cart` rows 4, Chair stock 499.
- After controlled mutation：`t_order` rows 37, `cart` rows 25, Chair stock 483, paid orders 19, pending payment orders 17.

This is important for D5 limitations and methodology:

- Mutation tests are controlled.
- Backup was created before mutation.
- Shared demo account/product variant means this is FYP evidence, not production-grade concurrency testing.

---

## 10. Verification evidence

Use the following as current verification evidence:

| Evidence | File |
|---|---|
| Phase 1/2 localization and core flow | `docs/reports/phase-1-2-localization-stabilization-report.md` |
| Phase 3 email verification | `docs/reports/phase-3-email-verification-report.md` |
| Phase 4 cloud deployment | `docs/reports/phase-4-cloud-deployment-report.md` |
| Phase 6 JMeter evaluation | `docs/reports/phase-6-jmeter-performance-evaluation-report.md` |
| Verification workflow | `docs/verification/verification-workflow.md` |
| Database design | `docs/database/DATABASE_DESIGN.md` |
| D6 implementation summary | `report/D6_Implementation.md` |
| Product catalog/image update | `docs/records/product-catalog-image-review-cloud-sync-2026-06-27.md` |

Current acceptance snapshot includes:

- Backend tests passed.
- Backend package build passed.
- Frontend auth check passed.
- Frontend route check passed.
- Frontend production build passed.
- Database schema static validation passed.
- Public homepage loaded successfully.
- Public demo login and authenticated read APIs passed.
- JMeter smoke/load/authenticated/mutation tests completed with 0.00% error rate.

Do not overstate this as full production security certification or commercial load testing.

---

## 11. Old D5 content that must be changed

### 11.1 Abstract / Abstrak

旧版 Malay abstract 需要大改。它目前提到：

- containerized infrastructure
- OAuth 2.0
- Alipay Sandbox
- Docker orchestration
- custom telemetry module
- `Network_Trace_Log`
- real-time analytics dashboard
- fault tolerance improvement

这些都不符合当前实现。应改成：

- cloud-based small e-commerce platform
- Vue + Spring Boot + MySQL + Redis
- Nginx reverse proxy on Google Cloud VM
- email verification by SMTP/Redis
- simulated payment
- Apache JMeter performance test
- response time, throughput, error rate
- HTTP-only deployment limitation

English abstract 旧版相对接近，但仍必须删除或改写：

- “particular attention to HTTP and HTTPS communication”
- “comparisons between HTTP and HTTPS communication”

改成：

- “HTTP communication through Nginx reverse proxy”
- “future work may add HTTPS for secure public deployment”

### 11.2 Chapter 1 Problem Statement

旧版 problem statement 过度强调：

- monolithic vs Docker/containerization
- peak high-concurrency commercial traffic
- third-party WAN payment/API dependency
- OAuth/Alipay latency
- Docker and microservice throughput

新 D5 应改成：

- Small e-commerce platforms need stable cloud access and measurable request performance.
- Even a small platform involves multiple network components: browser, reverse proxy, backend API, database, Redis, and external SMTP.
- Functional success alone is insufficient; response time, throughput, and error rate under concurrent access must be evaluated.
- Undergraduate Network Technology project requires a built network application plus controlled parameter-based testing.
- The challenge is to build a bounded but realistic cloud e-commerce workload and evaluate it under simulated traffic.

### 11.3 Chapter 1 Proposed Solution

删除或替换：

- Docker containerized architecture
- Docker bridge network
- Nginx as ingress controller with TLS termination/load balancing
- Round Robin multiple app instances
- Alipay Sandbox
- WeChat OAuth
- HTTPS external channels
- internal vs external WAN latency separation

新 solution 应写：

- Implement a small e-commerce platform using Vue frontend and Spring Boot REST backend.
- Use MySQL for relational business data and Redis for temporary session/email code state.
- Deploy on Google Cloud VM.
- Use Nginx to serve Vue static files and reverse proxy API/resource requests.
- Use email-code registration and password reset via Brevo SMTP with Redis TTL/cooldown.
- Use simulated payment for FYP-safe order completion.
- Use Apache JMeter to test homepage, product list, detail, login, cart, order, payment, and order history under controlled thread levels.

### 11.4 Chapter 1 Objectives

Recommended objectives:

1. To design and develop a cloud-based small e-commerce platform that supports core online shopping functions, including user authentication, product browsing, cart management, order placement, and simulated payment.
2. To implement and analyse the network communication mechanisms between the client browser, Nginx reverse proxy, Spring Boot application server, MySQL database, and Redis temporary-state service in a cloud VM environment.
3. To evaluate the deployed platform's network performance using Apache JMeter by measuring response time, throughput, and error rate under different concurrent user loads.

Do not include HTTP-vs-HTTPS comparison as an achieved objective unless HTTPS is implemented and tested later.

### 11.5 Chapter 1 Scope

Included scope should be:

- Vue web frontend.
- Spring Boot REST backend.
- MySQL relational database.
- Redis session/email-code state.
- Brevo SMTP email verification.
- Nginx reverse proxy.
- Google Cloud VM deployment.
- Core shopping golden path.
- Basic admin management.
- JMeter performance evaluation.
- HTTP request flow, response time, throughput, error rate.

Excluded scope should be:

- Real payment gateway.
- Alipay/WeChat Pay/Stripe.
- OAuth login.
- Docker/Kubernetes.
- Microservices.
- Auto-scaling/high availability.
- Real logistics/refund/invoice.
- AI recommendation.
- Commercial-scale capacity testing.

### 11.6 Chapter 1 Restrictions

Replace old restrictions about Alipay/WeChat/OAuth/GSM with:

- Cloud VM resource limit: single VM and academic budget.
- Public deployment uses HTTP only because no domain/certificate is configured.
- SMTP credentials cannot be stored in the repository.
- JMeter mutation tests are limited to protect live database stock/order data.
- Shared demo account limits production-grade concurrency interpretation.
- Internet route variability from local JMeter machine affects latency measurements.
- Password hashing is demo-compatible MD5 and not production-grade.
- phpMyAdmin is for administrative convenience and should not be treated as final security design.

### 11.7 Chapter 1 Methodology / Schedule

Current actual development phases:

1. System localization and core flow stabilization.
2. Email verification and authentication improvement.
3. Cloud deployment preparation and VM build.
4. Cloud runtime debugging for image/resource routing and upload storage.
5. Database/readiness audit and live database optimization.
6. JMeter performance evaluation.
7. Product catalog/image cleanup and cloud/database sync.

Methodology can still be Iterative Incremental Development, but rewrite increments as:

- Increment 1: localize and stabilize base e-commerce flow.
- Increment 2: strengthen authentication with email verification and Redis state.
- Increment 3: deploy frontend/backend/data services on Google Cloud VM behind Nginx.
- Increment 4: run verification and fix cloud resource/API path issues.
- Increment 5: execute JMeter tests and interpret network metrics.

### 11.8 Chapter 2 Literature Review

Old Chapter 2 likely focuses too much on Docker, microservices, external gateways and container overhead. The new literature review should focus on:

- Cloud-hosted small web applications.
- Client-server architecture for web systems.
- Reverse proxy and Nginx in web deployment.
- RESTful API communication and JSON over HTTP.
- MySQL relational database for transactional web systems.
- Redis for session/temporary state and caching.
- Email verification / OTP via SMTP as an account verification mechanism.
- Performance testing using Apache JMeter.
- Metrics: response time, throughput, error rate, concurrency.
- Limitations of single-VM cloud deployment.

Possible source types:

- Spring Boot official docs.
- Vue 2 official guide.
- MySQL official reference.
- Redis official docs.
- Nginx reverse proxy docs.
- Apache JMeter user manual.
- Recent papers/articles on web application performance testing, reverse proxy, cloud performance, and e-commerce system evaluation.

### 11.9 Chapter 3 Methodology / Requirements

Replace old requirements:

- FR-01 OAuth 2.0 Integration -> Email-code registration/login/session management.
- FR-02 Docker Round Robin routing -> Nginx static serving and reverse proxy routing to Spring Boot.
- FR-03 low-latency retrieval target <50 ms -> product/category/order APIs should return valid JSON and be measurable by JMeter.
- FR-04 Alipay payment -> simulated payment state transition.
- FR-05 500 concurrent users -> actual tested matrix up to 200 read-only, 100 authenticated, 10 mutation.

Recommended functional requirements:

| ID | Requirement |
|---|---|
| FR-01 | The system shall allow users to register, log in, and reset passwords through email verification. |
| FR-02 | The system shall display product lists, product details, categories, and carousel data. |
| FR-03 | The system shall allow authenticated users to manage carts and place orders. |
| FR-04 | The system shall support simulated payment and update order state, stock, and sales records. |
| FR-05 | The system shall provide basic administrator management for users, products, categories, files, and orders. |
| FR-06 | The system shall deploy to a cloud VM through Nginx reverse proxy. |
| FR-07 | The system shall provide JMeter test plans for smoke, read-only load, authenticated load, and controlled mutation scenarios. |

Recommended non-functional requirements:

| ID | Requirement |
|---|---|
| NFR-01 | The public web application shall be accessible through the Google Cloud VM public IP over HTTP. |
| NFR-02 | The backend service shall not be exposed directly to the public internet; API traffic shall pass through Nginx. |
| NFR-03 | Email verification codes shall expire after 5 minutes and resend attempts shall be limited by a 60-second cooldown. |
| NFR-04 | JMeter tests shall measure response time, throughput, and error rate under defined thread levels. |
| NFR-05 | Mutation tests shall be limited and backed up because they modify cart, order, and stock data. |

### 11.10 Chapter 3 Network / OSI requirements

Current accurate OSI/protocol explanation:

- Layer 7 Application: HTTP/1.1, RESTful APIs, JSON, SMTP for outgoing email, Vue SPA assets.
- Layer 4 Transport: TCP for HTTP, MySQL connection, Redis connection, SMTP.
- Layer 3 Network: IPv4, Google Cloud public IP, loopback/private VM communication.
- Layer 2/Data Link and below: abstracted by Google Cloud infrastructure and local network.
- Security/session: JWT token in HTTP header, Redis-backed session TTL, email verification code TTL/cooldown.

Do not claim:

- TLS termination by Nginx.
- HTTPS production deployment.
- Docker bridge private subnet.
- container IPs like `172.17.0.x`.
- OAuth 2.0 state validation.
- Alipay RSA callback verification.

### 11.11 Chapter 3 System Model

Use these models:

- Use Case Diagram:
  - Actors: Customer, Administrator, Researcher/Test Operator, External SMTP Service.
  - Customer use cases: register, verify email, login, browse products, manage cart, place order, simulate payment, view order history.
  - Administrator use cases: manage users/products/categories/orders/files.
  - Researcher/Test Operator: run JMeter tests, collect response time/throughput/error rate.

- Sequence Diagram:
  1. Login/session validation sequence.
  2. Email verification registration sequence.
  3. Product browsing request through Nginx.
  4. Cart/order/simulated payment sequence.
  5. JMeter load test request flow.

- Activity Diagram:
  - Golden path from register/login through simulated payment and order history.

- Network Communication Diagram:
  - Browser/JMeter -> Nginx port 80 -> Spring Boot 9191 -> MySQL 3306 / Redis 6379.
  - Spring Boot -> Brevo SMTP for outgoing email.

### 11.12 Chapter 3 Architecture

Current accurate architecture:

- Vue SPA presentation layer.
- Axios communication layer.
- Nginx public web server and reverse proxy.
- Spring Boot controller-service-mapper backend.
- MySQL relational persistence.
- Redis temporary state.
- Brevo SMTP for email verification.
- JMeter load generator.

Use “Layered architecture + client-server deployment + reverse proxy” rather than “containerized microservice architecture”.

### 11.13 Chapter 3 Database

Use current database design from Section 8 of this context pack. Include ERD based on:

- `sys_user`
- `address`
- `category`
- `icon`
- `icon_category`
- `good`
- `good_standard`
- `cart`
- `t_order`
- `order_goods`
- `carousel`
- `sys_file`
- `avatar`

Do not include:

- `Network_Trace_Log`
- OAuth token fields as core schema
- Alipay callback fields
- telemetry tables that do not exist

### 11.14 Chapter 3 Algorithm

Replace old Secure Callback Processing algorithm with one or more of:

1. Email verification algorithm:
   - normalize email
   - check purpose
   - check cooldown
   - generate 6-digit code
   - store Redis code with 5-minute TTL
   - store cooldown with 60-second TTL
   - send email through SMTP
   - clean Redis keys if sending fails
   - verify code and delete after success

2. JWT/Redis session validation algorithm:
   - read token header
   - find user session in Redis
   - refresh TTL
   - verify JWT signature
   - store current user in request context

3. Order and simulated payment algorithm:
   - create order header
   - insert order goods
   - remove cart row
   - mark order paid
   - verify stock
   - deduct stock
   - update sales and cache

### 11.15 Chapter 3 Interface

Use actual UI screenshots, not old generated UI with network telemetry indicators.

Possible screenshots:

- `report/screenshot/main page.png`
- `report/screenshot/products page.png`
- `report/screenshot/login page.png`
- `report/screenshot/righter page.png` (likely register page; verify label before final use)
- `report/screenshot/admin page.png`
- `docs/assets/phase-2-order-history-verified.png`
- JMeter charts:
  - `docs/testing/jmeter/results/phase6-summary/charts/p90-response-time-ms.svg`
  - `docs/testing/jmeter/results/phase6-summary/charts/throughput-per-second.svg`

Do not use old D5 images that describe:

- OAuth interface
- Alipay gateway
- real-time latency dashboard
- custom 503 load balancer page
- Docker topology unless redrawn to match current deployment

---

## 12. Suggested new D5 structure

Use this structure when asking GPT to write the final D5:

```text
ABSTRAK
ABSTRACT

CHAPTER 1 PROJECT PLANNING
1.1 Introduction
1.2 Problem Statement
1.3 Proposed Solution
1.4 Project Objectives
1.5 Project Scope
1.6 Constraints / Restrictions
1.7 Methodology
1.8 Implementation Schedule
1.9 Conclusion

CHAPTER 2 LITERATURE REVIEW
2.1 Introduction
2.2 Cloud-Based Web Application Deployment
2.3 Client-Server and RESTful Communication
2.4 Reverse Proxy and Nginx in Web Systems
2.5 Database and Temporary State Management
2.6 E-Commerce Workload and User Transaction Flow
2.7 Network Performance Testing with Apache JMeter
2.8 Comparison and Research Gap
2.9 Conclusion

CHAPTER 3 METHODOLOGY
3.1 Introduction
3.2 User Needs and Stakeholders
3.3 Functional Requirements
3.4 Non-Functional and Network Requirements
3.5 OSI / Protocol Specification
3.6 System Model
3.7 Architecture Design
3.8 Database Design
3.9 Algorithm Design
3.10 Interface Design
3.11 Performance Evaluation Method
3.12 Conclusion

REFERENCES
APPENDIX
```

Because D5 is Proposal Report, Chapter 3 can include performance evaluation method and planned/actual JMeter design, but the final thesis evaluation results should later be expanded in D6/D7 depending on course structure. Since current project already has results, D5 can mention the completed evaluation evidence carefully as implementation readiness evidence.

---

## 13. Suggested abstract content

Use this as content basis, not necessarily exact final wording:

> With the increasing use of cloud-hosted web systems, small e-commerce platforms must provide not only functional shopping features but also stable client-server communication under concurrent access. This project develops R Mall, a cloud-based small e-commerce platform for a Network Technology Final Year Project. The system supports user registration and login, email verification, product browsing, cart management, order placement, simulated payment, order history, and basic administrator management. It is implemented using Vue 2, Spring Boot, MySQL, Redis, and Nginx, and is deployed on a Google Cloud VM. From the network technology perspective, the project analyses the HTTP request path between the browser, Nginx reverse proxy, Spring Boot application server, MySQL database, and Redis temporary-state service. Apache JMeter is used to evaluate response time, throughput, and error rate under controlled concurrent user loads. The completed testing evidence shows that the deployed prototype can support the selected FYP demonstration workloads with zero recorded JMeter errors, while also revealing multi-second response times under higher browsing loads. The project provides a practical cloud-based e-commerce testbed and demonstrates how network performance evaluation can be integrated into undergraduate web application development.

Malay abstract should mirror this content and must not mention Docker/OAuth/Alipay/Network_Trace_Log.

---

## 14. Suggested Chapter 1 wording direction

### 14.1 Problem statement themes

Write around these problems:

- Small e-commerce systems require reliable cloud access, but many student projects stop at local functionality.
- Cloud deployment introduces extra network components and possible latency: browser, public IP, Nginx, backend, database, cache.
- Without measurement, it is hard to know whether the system remains usable under multiple concurrent users.
- Response time, throughput, and error rate are important Network Technology indicators.
- A realistic but bounded e-commerce workload is needed to evaluate network performance without expanding into enterprise-level e-commerce.

### 14.2 Proposed solution themes

Write around these solution components:

- Build R Mall as a small cloud e-commerce platform.
- Use Vue frontend and Spring Boot REST backend.
- Use MySQL and Redis.
- Add email verification for registration/reset.
- Deploy to Google Cloud VM behind Nginx.
- Use Apache JMeter to test important user journeys under controlled thread levels.
- Analyse network path and performance metrics.

### 14.3 Objectives

Use the three objectives from Section 11.4.

### 14.4 Scope

Split scope into:

- Application scope.
- Network/deployment scope.
- Performance evaluation scope.
- Excluded scope.

---

## 15. Suggested Chapter 2 literature review direction

Important: D5 should not over-focus on Docker or microservices. It should discuss technologies actually used:

1. Cloud computing and VM-based web deployment.
2. Nginx reverse proxy and static file serving.
3. RESTful API and JSON over HTTP.
4. Spring Boot for backend web services.
5. Vue SPA for web frontend.
6. MySQL relational schema for transactional e-commerce data.
7. Redis for session and temporary verification state.
8. Email verification/OTP concepts.
9. JMeter and web performance metrics.
10. Response time, throughput, error rate, and concurrent user simulation.

Possible critique / research gap:

- Many web projects focus on feature completion but provide limited network performance evidence.
- Many performance studies use synthetic endpoints instead of complete user journeys.
- This project fills the gap by using a real but bounded e-commerce workflow and testing both read-only and mutation scenarios through a public cloud endpoint.

---

## 16. Suggested Chapter 3 figures and tables

### 16.1 Figures

Recommended figures:

1. Overall architecture:
   - Browser / JMeter
   - Nginx on Google Cloud VM
   - Vue static files
   - Spring Boot API 9191
   - MySQL
   - Redis
   - Brevo SMTP

2. Network request flow:
   - Browser -> public IP:80 -> Nginx -> 127.0.0.1:9191 -> MySQL/Redis -> response.

3. Use case diagram:
   - Customer/Admin/Researcher.

4. Sequence diagram:
   - Email registration.
   - Order + simulated payment.
   - JMeter request flow.

5. ERD:
   - Current schema from `docs/database/DATABASE_DESIGN.md`.

6. Interface screenshots:
   - login/register/home/product/order/admin.

7. JMeter chart:
   - P90 response time.
   - throughput.

### 16.2 Tables

Recommended tables:

1. Technology stack.
2. Functional requirements.
3. Non-functional/network requirements.
4. OSI protocol mapping.
5. API endpoints.
6. Database dictionary summary.
7. JMeter matrix.
8. JMeter highest-concurrency result summary.
9. Limitations and future work.

---

## 17. Exact caveats that must be included

Write these caveats clearly:

- Current public deployment uses HTTP, not HTTPS.
- No HTTP-vs-HTTPS performance comparison was executed.
- Nginx configuration listens on port 80 only.
- JMeter plans use `BASE_PROTOCOL=http` and `BASE_PORT=80`.
- Real payment is not implemented; payment is simulated.
- OAuth login is not implemented.
- Docker/Kubernetes/microservices are outside scope.
- JMeter mutation tests used a shared demo account and selected product variant, so they are controlled FYP evidence, not a production-grade order-concurrency benchmark.
- Raw JMeter `.jtl` and HTML reports are not tracked in Git; retained evidence is CSV/Markdown/SVG/report.
- Password security is demo-compatible and should be improved in future production work.

---

## 18. Files GPT should use as evidence

Give GPT these paths if it can inspect local files:

```text
report/D5_update_20260420_v1.md
report/D6_Implementation.md
docs/README.md
docs/project/project-scope-and-objectives.md
docs/project/implementation-roadmap.md
docs/reports/phase-1-2-localization-stabilization-report.md
docs/reports/phase-3-email-verification-report.md
docs/reports/phase-4-cloud-deployment-report.md
docs/reports/phase-6-jmeter-performance-evaluation-report.md
docs/database/DATABASE_DESIGN.md
docs/testing/jmeter/results/phase6-summary/summary-tables.md
docs/testing/jmeter/results/phase6-summary/aggregate-results.csv
deploy/nginx/project-fyp-mall.conf
deploy/systemd/project-fyp-mall-api.service
deploy/env/project-fyp-mall.env.example
ElectronicMallVue/src/router/index.js
ElectronicMallVue/src/utils/request.js
ElectronicMallVue/src/views/Register.vue
ElectronicMallVue/src/views/Login.vue
ElectronicMallVue/src/views/front/order/Pay.vue
ElectronicMallApi/src/main/java/com/rufeng/em/service/UserService.java
ElectronicMallApi/src/main/java/com/rufeng/em/service/EmailVerificationService.java
ElectronicMallApi/src/main/java/com/rufeng/em/service/OrderService.java
ElectronicMallApi/src/main/java/com/rufeng/em/interceptor/JwtInterceptor.java
ElectronicMallApi/src/main/java/com/rufeng/em/config/InterceptorConfig.java
database/electronic_mall.sql
```

---

## 19. One-paragraph instruction to give GPT

You can paste the following instruction together with this context pack:

> Please rewrite my D5 Proposal Report based on the current completed project facts in this context pack. The old D5 contains outdated and unimplemented content such as Docker, OAuth 2.0, Alipay Sandbox, HTTPS comparison, Network_Trace_Log, real-time telemetry, microservices, and secure callback processing; remove or replace those claims. The new D5 should describe R Mall as a cloud-based small e-commerce platform for a Network Technology FYP, implemented with Vue 2, Spring Boot, MySQL, Redis, Nginx, Google Cloud VM, email verification, simulated payment, and Apache JMeter performance testing. Keep the academic proposal-report structure required by D5: Abstract, Chapter 1 Project Planning, Chapter 2 Literature Review, Chapter 3 Methodology, References, and Appendix. Emphasize network communication through browser, Nginx reverse proxy, backend, database and Redis, and performance metrics including response time, throughput, and error rate. Do not invent HTTPS deployment, real payment, OAuth, Docker/Kubernetes, or commercial-scale performance claims.

---

## 20. Final writing checklist

Before accepting the rewritten D5, check:

- [ ] Abstract and Abstrak match current implementation.
- [ ] Project title is consistent.
- [ ] No Docker/Kubernetes/microservice claim remains.
- [ ] No OAuth/WeChat login claim remains.
- [ ] No Alipay/real payment/webhook claim remains.
- [ ] No `Network_Trace_Log` or custom telemetry-table claim remains.
- [ ] No HTTP-vs-HTTPS result is claimed.
- [ ] HTTP-only limitation is stated.
- [ ] Nginx reverse proxy is described accurately.
- [ ] Vue/Spring Boot/MySQL/Redis/Brevo/JMeter stack is described accurately.
- [ ] Objectives match current completed project.
- [ ] Scope excludes commercial e-commerce features.
- [ ] Database tables match current SQL.
- [ ] JMeter matrix and results match Phase 6 report.
- [ ] References include current official docs and recent literature.
- [ ] No secrets/passwords are included.
