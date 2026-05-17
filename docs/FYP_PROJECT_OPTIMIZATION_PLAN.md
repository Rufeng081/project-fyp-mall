# FYP Project Optimization Plan

## Project Direction

This project should be optimized as a **cloud-based small e-commerce platform** for a Network Technology FYP.

Recommended FYP title direction:

> **Development and Network Performance Evaluation of a Cloud-Based Small E-Commerce Platform**

The goal is not to convert the project into a large-scale enterprise system. The goal is to make the current project stable, English-based, cloud-deployed, and suitable for network performance evaluation.

---

## Main Optimization Principles

The optimized project should focus on:

- A functional small e-commerce platform.
- English user interface.
- Malaysia-based address, phone, and currency format.
- Cloud deployment.
- Clear client-server-database communication.
- Nginx reverse proxy routing.
- Email verification during registration.
- Apache JMeter performance testing.
- Network performance metrics: response time, throughput, and error rate.

The project should avoid unnecessary advanced topics such as:

- Kubernetes.
- Docker-based deployment, unless explicitly required later.
- Microservices architecture.
- AI recommendation system.
- Real payment gateway integration.
- Large-scale high-concurrency architecture.
- Complex cybersecurity framework.
- Overly advanced enterprise-level features.

---

# Phase 1: System Localization and Interface Standardization

## Objective

Convert the project into an English-based and Malaysia-context e-commerce platform.

This phase prepares the system to be suitable for a UKM FYP presentation, report, and demonstration.

## Tasks

### 1. Convert UI Language to English

Convert all visible front-end text into English, including:

- Page titles.
- Navigation menus.
- Buttons.
- Form labels.
- Placeholder text.
- Validation messages.
- Error messages.
- Success messages.
- Dialog boxes.
- Product category names.
- Order status text.
- User role names.
- Admin panel text.

### 2. Standardize Currency

Replace China-based currency formats with Malaysia-based currency formats.

Use:

```text
RM / MYR
```

Example:

```text
RM 29.90
```

Avoid:

```text
¥
RMB
CNY
```

### 3. Adapt Address Format to Malaysia

Use Malaysia-style addresses.

Recommended address fields:

```text
Full Name
Phone Number
Address Line 1
Address Line 2
City
State
Postcode
Country
```

Example:

```text
LI RUFENG
+60 12-345 6789
Kolej Keris Mas, Universiti Kebangsaan Malaysia
Bangi
Selangor
43600
Malaysia
```

### 4. Adapt Phone Number Format

Use Malaysia phone number format.

Recommended examples:

```text
+60 12-345 6789
012-345 6789
011-1234 5678
```

### 5. Update Sample Data

Update database seed data and default display data.

Replace:

- Chinese names.
- China-based addresses.
- China-based phone numbers.
- RMB prices.
- Chinese product categories.

With:

- English names.
- Malaysia-based addresses.
- Malaysia phone numbers.
- MYR prices.
- English product categories.

Suggested product categories:

```text
Electronics
Stationery
Books
Daily Essentials
Clothing
Food and Beverages
```

## Expected Deliverables

After this phase, the system should have:

- Fully English user interface.
- Malaysia-based address format.
- Malaysia phone number format.
- MYR currency display.
- English sample data.
- Cleaner interface for FYP demonstration.

---

# Phase 2: Core E-Commerce Function Stabilization

## Objective

Ensure that the project works as a complete small e-commerce platform before adding cloud deployment or additional functions.

The system must support a complete user flow.

Recommended golden path:

```text
Register / Login → Browse Products → View Product Details → Add to Cart → Place Order → Simulated Payment → View Order History
```

## Required Core Modules

| Module | Required | Notes |
|---|---:|---|
| User registration | Yes | Basic user account creation |
| User login/logout | Yes | Basic authentication flow |
| Product browsing | Yes | Product listing must work properly |
| Product detail page | Yes | Product detail must be accessible |
| Shopping cart | Yes | Add, update, and remove items |
| Order placement | Yes | User can submit an order |
| Simulated payment | Yes | No real payment gateway needed |
| Order history | Recommended | Useful for demonstration |
| Admin product management | Optional | Useful but not the main focus |
| Real payment gateway | No | Avoid unnecessary complexity |
| Recommendation system | No | Not required for this FYP |

## Tasks

### 1. Verify Front-End Routing

Check that all main pages can be opened correctly:

- Home page.
- Login page.
- Register page.
- Product list page.
- Product detail page.
- Cart page.
- Order page.
- Payment simulation page.
- User profile page.
- Admin pages, if retained.

### 2. Verify Back-End API Functions

Check that the main API endpoints work correctly:

- User registration.
- User login.
- Product list query.
- Product detail query.
- Cart operations.
- Order creation.
- Payment simulation.
- Order history query.

### 3. Fix Critical Bugs

Fix issues that prevent the system from completing the golden path.

Priority should be given to:

- Login failure.
- Registration failure.
- Product page loading failure.
- Cart not updating.
- Order submission failure.
- Front-end API URL mismatch.
- Back-end database connection error.
- Incorrect response format.

### 4. Remove or Hide Unnecessary Features

If some features are too complex, incomplete, or unrelated to the FYP scope, remove or hide them from the user interface.

Avoid showing broken or unnecessary functions during demonstration.

### 5. Clean Local Running Instructions

Update the project README or documentation to explain:

- How to run the back-end locally.
- How to run the front-end locally.
- How to configure MySQL.
- How to configure Redis.
- How to import the database.
- What default accounts can be used for testing.

## Expected Deliverables

After this phase, the system should be able to complete this flow:

```text
User registers or logs in.
User browses products.
User adds products to cart.
User places an order.
User completes simulated payment.
User views order history.
```

---

# Phase 3: Account Verification Enhancement

## Objective

Add email verification during user registration.

This should be treated as a basic account validation mechanism, not as an advanced cybersecurity feature.

Suggested description for FYP report:

> Email verification is implemented to improve registration reliability and prevent invalid account creation.

## Registration Flow

Recommended registration flow:

```text
User enters registration information.
User enters email address.
System sends verification code to the email.
User enters verification code.
Back-end verifies the code.
Account is created or activated.
```

## Tasks

### 1. Add Email Verification API

Create or modify back-end endpoints for:

- Sending verification code.
- Verifying the code.
- Registering the user after successful verification.

Possible API design:

```text
POST /api/auth/send-verification-code
POST /api/auth/register
```

### 2. Add Email Service

Create an email service in the Spring Boot back-end.

Recommended component:

```text
EmailService
```

The service should be responsible for:

- Generating email content.
- Sending verification code.
- Handling email sending errors.

### 3. Store Verification Code Temporarily

Use Redis to store verification codes because the code is temporary data.

Recommended Redis key format:

```text
email:verification:{email}
```

Recommended expiry time:

```text
5 minutes
```

### 4. Add Resend Limit

Add basic resend control.

Recommended rule:

```text
The same email cannot request another code within 60 seconds.
```

### 5. Add Verification Failure Limit

Add basic failed attempt control.

Recommended rule:

```text
Maximum 5 failed attempts for one verification code.
```

### 6. Update Front-End Registration Page

Modify the registration page to include:

- Email input.
- Send code button.
- Verification code input.
- Register button.
- Countdown after sending code.
- Error message for invalid or expired code.

## Expected Deliverables

After this phase, the registration function should support:

- Email input.
- Verification code sending.
- Verification code checking.
- Code expiry.
- Basic resend control.
- Basic failure control.

---

# Phase 4: Cloud Deployment and Network Configuration

## Objective

Deploy the project to a cloud server and make it accessible through a public IP address or domain name.

This is one of the most important phases for the FYP because the project title focuses on a cloud-based system and network performance evaluation.

## Recommended Deployment Architecture

```text
User Browser
   ↓ HTTP / HTTPS
Nginx Reverse Proxy
   ↓
Vue Front-End Static Files
   ↓ API Request
Spring Boot Back-End
   ↓
MySQL Database
   ↓
Redis Cache / Verification Code Storage
```

## Recommended Cloud Server Specification

Minimum recommended specification:

```text
2 vCPU
2 GB RAM
40 GB storage
Ubuntu 22.04 LTS
```

A lower specification such as 1 vCPU and 1 GB RAM may work, but it may become unstable during JMeter testing.

## Tasks

### 1. Prepare Production Configuration

Update the Spring Boot configuration for cloud deployment.

Check or modify:

- Server port.
- MySQL host.
- MySQL username.
- MySQL password.
- Redis host.
- Redis port.
- Email SMTP configuration.
- File upload path, if applicable.

### 2. Configure Front-End API Base URL

Avoid hardcoding the back-end cloud server port in the front-end.

Avoid this:

```text
http://server-ip:9191
```

Prefer this:

```text
/api
```

Then use Nginx to forward `/api` requests to Spring Boot.

### 3. Build Vue Front-End

Build the front-end for production.

Typical command:

```bash
npm install
npm run build
```

The output should be served by Nginx.

### 4. Build Spring Boot Back-End

Build the back-end into a JAR file.

Typical command:

```bash
mvn clean package
```

### 5. Configure Nginx

Nginx should:

- Serve Vue static files.
- Forward API requests to Spring Boot.
- Optionally support HTTPS later.

Example structure:

```nginx
server {
    listen 80;
    server_name your-domain-or-server-ip;

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

### 6. Run Spring Boot as a Service

Use systemd to keep the Spring Boot back-end running.

The service should restart automatically if it stops.

### 7. Configure MySQL and Redis

On the cloud server:

- Install MySQL.
- Import the database script.
- Create a dedicated database user.
- Install Redis.
- Enable Redis service.
- Check database and Redis connectivity from Spring Boot.

### 8. Configure Firewall

Allow only necessary ports.

Recommended:

```text
22  - SSH
80  - HTTP
443 - HTTPS, if configured
```

The Spring Boot port should preferably remain internal and accessed through Nginx only.

## Expected Deliverables

After this phase, the system should:

- Run on a cloud server.
- Be accessible through public IP or domain name.
- Serve the Vue front-end through Nginx.
- Route API requests through Nginx reverse proxy.
- Connect to MySQL and Redis on the server.
- Be ready for network performance testing.

---

# Phase 5: System Documentation and Design Specification

## Objective

Prepare project documentation and diagrams so that the code changes can be clearly explained in the FYP report and presentation.

This phase is important because the project must be academically explainable, not only technically runnable.

## Recommended Documentation Files

Create or update the following files in the project:

```text
docs/
  PROJECT_SCOPE.md
  SYSTEM_REQUIREMENTS.md
  NETWORK_ARCHITECTURE.md
  API_ENDPOINTS.md
  DATABASE_DESIGN.md
  DEPLOYMENT_GUIDE.md
  TESTING_PLAN.md
  JMETER_TEST_RESULTS.md
```

## Required Documentation Content

### 1. PROJECT_SCOPE.md

Should explain:

- Project title.
- Project objective.
- Target users.
- System scope.
- Included features.
- Excluded features.
- Reason for excluding advanced features.

### 2. SYSTEM_REQUIREMENTS.md

Should include:

- Functional requirements.
- Non-functional requirements.
- Hardware requirements.
- Software requirements.
- Network requirements.

### 3. NETWORK_ARCHITECTURE.md

Should explain:

- Client-server communication.
- Nginx reverse proxy routing.
- Front-end and back-end separation.
- Back-end and database communication.
- Redis usage for temporary verification code storage.
- Cloud server request flow.

### 4. API_ENDPOINTS.md

Should list important API endpoints, such as:

- User registration.
- Login.
- Email verification.
- Product list.
- Product detail.
- Cart operations.
- Order creation.
- Payment simulation.
- Order history.

### 5. DATABASE_DESIGN.md

Should explain:

- Main tables.
- Table relationships.
- User table.
- Product table.
- Cart table.
- Order table.
- Order item table.
- Address table.
- Verification-related data, if stored in MySQL.

### 6. DEPLOYMENT_GUIDE.md

Should explain:

- Cloud server setup.
- MySQL setup.
- Redis setup.
- Back-end build.
- Front-end build.
- Nginx configuration.
- Systemd service setup.
- Common deployment errors.

### 7. TESTING_PLAN.md

Should explain:

- Testing objective.
- Testing environment.
- JMeter test cases.
- Number of virtual users.
- Ramp-up period.
- Test duration.
- Metrics to collect.

### 8. JMETER_TEST_RESULTS.md

Should include:

- Test result tables.
- Response time results.
- Throughput results.
- Error rate results.
- Analysis.
- Limitations.
- Conclusion.

## Required Diagrams

Prepare the following diagrams:

| Diagram | Purpose |
|---|---|
| Use Case Diagram | Shows user and admin functions |
| System Architecture Diagram | Shows Vue, Spring Boot, MySQL, Redis, and Nginx |
| Network Topology Diagram | Shows client, cloud server, back-end, and database communication |
| Sequence Diagram | Shows login, registration, order, and payment flow |
| ERD | Shows database structure |
| Deployment Diagram | Shows cloud deployment structure |
| JMeter Test Flow Diagram | Shows performance testing process |

## Expected Deliverables

After this phase, the project should have:

- Clear documentation.
- FYP-aligned project scope.
- System architecture explanation.
- Network architecture explanation.
- API documentation.
- Database documentation.
- Deployment guide.
- Testing plan.
- Diagrams suitable for report and presentation.

---

# Phase 6: Network Performance Testing and Evaluation

## Objective

Use Apache JMeter to evaluate the network performance of the cloud-based e-commerce platform.

This phase supports the FYP research and evaluation component.

## Main Performance Metrics

Collect and analyze:

- Average response time.
- Median response time.
- 90th percentile response time.
- Throughput.
- Error rate.
- Minimum response time.
- Maximum response time.

## Recommended JMeter Test Cases

| Test Case | Request Type | Purpose |
|---|---|---|
| Home page loading | HTTP GET | Test basic page access |
| Product list | API GET | Test product browsing performance |
| Product detail | API GET | Test product detail query performance |
| Login | API POST | Test authentication request performance |
| Add to cart | API POST | Test cart operation performance |
| Place order | API POST | Test order creation performance |
| Simulated payment | API POST | Test payment simulation performance |
| Order history | API GET | Test order query performance |

## Recommended Test Load Design

| Test Round | Virtual Users | Ramp-Up Period | Duration |
|---|---:|---:|---:|
| Test 1 | 10 users | 10 seconds | 1 minute |
| Test 2 | 50 users | 30 seconds | 2 minutes |
| Test 3 | 100 users | 60 seconds | 3 minutes |
| Test 4 | 200 users | 120 seconds | 3 to 5 minutes |

If the server specification is low, reduce the maximum number of users.

The purpose is not to prove large-scale high concurrency. The purpose is to evaluate how the small cloud-based system behaves under different request loads.

## Testing Notes

JMeter testing should include:

- Correct request headers.
- Correct content type.
- Login token handling, if the system uses token-based authentication.
- Realistic test data.
- Separate test cases for read-heavy and write-heavy operations.
- Repeated tests for more reliable results.

## Analysis Focus

The final FYP analysis should explain:

- How response time changes when the number of users increases.
- How throughput changes under different loads.
- Which API endpoint has the highest response time.
- When the error rate starts to increase.
- How cloud server resource limitations affect performance.
- Whether the system is suitable for small-scale e-commerce use.
- How Nginx reverse proxy contributes to request routing.

## Expected Deliverables

After this phase, the project should have:

- JMeter test plan files.
- Test result screenshots.
- Result tables.
- Performance graphs.
- Written analysis.
- Network performance evaluation conclusion.

---

# Suggested Final Project Scope

The final optimized project should be described as:

> A cloud-based small e-commerce platform developed using Vue, Spring Boot, MySQL, and Redis. The system supports basic e-commerce functions including user registration, login, product browsing, shopping cart, order placement, simulated payment, and order history. The system is deployed on a cloud server using Nginx as a reverse proxy. Apache JMeter is used to evaluate network performance under different request loads by measuring response time, throughput, and error rate.

---

# Recommended Final Folder and Documentation Structure

```text
project-fyp-mall/
  ElectronicMallVue/
  ElectronicMallApi/
  database/
  docs/
    PROJECT_SCOPE.md
    SYSTEM_REQUIREMENTS.md
    NETWORK_ARCHITECTURE.md
    API_ENDPOINTS.md
    DATABASE_DESIGN.md
    DEPLOYMENT_GUIDE.md
    TESTING_PLAN.md
    JMETER_TEST_RESULTS.md
  jmeter/
    product-list-test.jmx
    login-test.jmx
    order-test.jmx
    full-flow-test.jmx
  README.md
```

---

# Codex Instruction Summary

Codex should optimize the project according to the following priority order:

```text
1. Convert the system to English and Malaysia-based context.
2. Stabilize the core e-commerce workflow.
3. Add email verification for registration.
4. Prepare the project for cloud deployment.
5. Add or update documentation and diagrams.
6. Prepare JMeter performance testing files and result documentation.
```

Codex should not add unnecessary advanced features unless explicitly requested.

The project must remain suitable for an undergraduate Network Technology FYP.

---

# Final Warning

Do not over-expand the project into an enterprise-level system.

The correct direction is:

```text
Small e-commerce platform
Cloud deployment
Nginx reverse proxy
Vue front-end
Spring Boot back-end
MySQL database
Redis for temporary verification code storage
JMeter performance testing
Response time / throughput / error rate analysis
```

The incorrect direction is:

```text
Large-scale enterprise e-commerce system
Microservices
Docker/Kubernetes cluster
AI recommendation
Real payment integration
Advanced security framework
High-concurrency distributed architecture
```
