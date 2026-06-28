# Project Scope and Objectives

## Project Title

**Development and Network Performance Evaluation of a Cloud-Based Small E-Commerce Platform**

---

## 1. Project Background

This project develops a cloud-based small e-commerce platform suitable for a Network Technology Final Year Project.

The system uses a modern e-commerce architecture with Spring Boot, Vue, MySQL, RESTful APIs, JWT authentication, and related management modules. The FYP does not focus on building a large commercial online shopping system. Instead, the system is designed as a controlled platform for studying network communication, cloud deployment, request handling, and performance evaluation under different user loads.

The final project will therefore focus on two main aspects:

1. **Developing a functional small-scale e-commerce platform**
2. **Evaluating its network performance in a cloud environment**

The e-commerce features are necessary to create realistic user transactions, while the main academic focus remains on Network Technology.

---

## 2. Project Scope

The project will implement and evaluate a small cloud-based e-commerce platform with selected core features only.

The system will include:

- User registration and login
- Product browsing
- Product searching or filtering
- Product details viewing
- Shopping cart management
- Order placement
- Simulated payment status
- Basic admin management for products and orders
- Cloud deployment
- HTTP/HTTPS communication
- Client-server-database request flow
- Reverse proxy routing using Nginx
- Network performance testing using Apache JMeter

The system will be deployed on a cloud server and tested under different levels of simulated user traffic.

---

## 3. Final FYP-NT Goal

The final goal of this project is:

> To develop a small cloud-based e-commerce platform and evaluate its network performance by analyzing response time, throughput, and error rate under different concurrent user loads.

This means the project is not judged mainly by how many shopping features it has. It is judged by whether the system can support realistic cloud-based e-commerce communication and whether its network performance can be measured and analyzed clearly.

---

## 4. Main Objectives

### Objective 1: To design and develop a cloud-based small e-commerce platform

The project will develop a small e-commerce system that supports basic online shopping operations, including user login, product browsing, cart management, order placement, and simulated payment.

The system will be based on a Spring Boot backend and Vue frontend. The backend will provide RESTful APIs, while the frontend will interact with the backend through HTTP/HTTPS requests.

This objective ensures that the project has a working application environment for network communication and performance testing.

---

### Objective 2: To implement and analyze the network communication mechanisms of the platform

The project will analyze how requests travel between the client, reverse proxy, application server, and database server.

The main network communication components include:

- Client browser to Vue frontend
- Vue frontend to Spring Boot REST API
- Spring Boot backend to MySQL database
- Nginx reverse proxy to backend service
- HTTP and HTTPS request handling
- Authentication-related request flow
- Order creation request flow

This objective connects the e-commerce application directly with the Network Technology domain.

---

### Objective 3: To evaluate network performance using Apache JMeter

The project will test the deployed system under different simulated user loads.

The performance evaluation will measure:

- Average response time
- Throughput
- Error rate
- Request success rate
- System behavior under increasing concurrency

Suggested test levels:

```text
50 users
100 users
200 users
300 users
500 users
```

The results will be analyzed to identify how the cloud-based e-commerce platform performs under different levels of traffic.

---

## 5. Strict Project Boundary

This project must remain a **Network Technology FYP**, not a full commercial e-commerce system.

Therefore, the following boundaries must be strictly followed.

---

## 6. Included Features

The final system will only include features that support the FYP objectives.

### 6.1 User Module

Included:

- User registration
- User login
- JWT-based authentication
- Basic user profile viewing
- Password validation
- User role distinction between normal user and admin

Not required:

- Social login
- OAuth login
- Phone number login
- Real-name identity verification
- Advanced user recommendation
- Membership or loyalty system

---

### 6.2 Product Module

Included:

- Product list
- Product details
- Product category
- Product search or filtering
- Admin product add/edit/delete

Not required:

- AI product recommendation
- Complex inventory forecasting
- Product review system
- Product rating algorithm
- Flash sale or promotion engine
- Seller-side multi-vendor system

---

### 6.3 Cart Module

Included:

- Add product to cart
- Update quantity
- Remove product from cart
- View cart

Not required:

- Coupon calculation
- Dynamic pricing
- Cross-selling recommendation
- Complex stock locking mechanism

---

### 6.4 Order Module

Included:

- Create order
- View order
- Update order status
- Admin order management
- Simulated payment status

Not required:

- Real online payment gateway
- Alipay / WeChat Pay / Stripe integration
- Refund system
- Delivery tracking
- Invoice generation
- Logistics company integration

---

### 6.5 Admin Module

Included:

- Admin login
- Manage users
- Manage products
- Manage orders
- View basic system data if already available

Not required:

- Advanced dashboard
- Financial reporting
- Sales prediction
- Customer behavior analytics
- Business intelligence module

---

### 6.6 Network and Deployment Module

Included:

- Cloud server deployment
- Spring Boot backend deployment
- Vue frontend deployment
- MySQL database deployment
- Nginx reverse proxy configuration
- HTTP/HTTPS access
- Basic firewall/security group configuration
- JMeter test environment

Not required:

- Docker
- Kubernetes
- Microservices
- Auto-scaling cluster
- CDN optimization
- Multi-region deployment
- Load balancer cluster
- High availability architecture

---

## 7. Excluded Scope

The following items are explicitly outside the project scope:

```text
Real payment gateway integration
Real delivery/logistics integration
AI recommendation system
Big data analytics
Microservices architecture
Docker/Kubernetes deployment
Mobile application development
Multi-vendor marketplace system
Advanced cybersecurity framework
Blockchain payment or traceability
Large-scale commercial optimization
```

These features may be mentioned as future work, but they should not be implemented in the final FYP system.

---

## 8. Technical Architecture Boundary

The final architecture should be kept simple and explainable.

### Final Architecture

```text
User Browser
   ↓
Vue Frontend
   ↓ HTTP/HTTPS
Nginx Reverse Proxy
   ↓
Spring Boot Backend
   ↓ JDBC/MyBatis
MySQL Database
```

Optional:

```text
Redis
```

Redis should only be kept if it is already required by the existing login/token mechanism. It should not become the main focus of the project.

If Redis is used, it should be described simply as:

> Redis is used to support token/session-related data handling, while the main project focus remains on HTTP/HTTPS communication and cloud-based request performance.

Redis should not be described as a major contribution of the project.

---

## 9. Technology Stack

### Backend

```text
Spring Boot
Java
MyBatis / MyBatis-Plus
RESTful API
JWT Authentication
```

### Frontend

```text
Vue 2
Element UI
Axios
```

### Database

```text
MySQL
```

### Web Server / Reverse Proxy

```text
Nginx
```

### Testing Tool

```text
Apache JMeter
```

### Deployment Environment

```text
Cloud server
Linux environment
Public IP or domain
HTTP/HTTPS access
```

---

## 10. Project Identity and Implementation Requirements

The project identity and implementation should consistently present this repository as an independent FYP project.

### 10.1 Project Identity Requirements

Required identity controls:

```text
Use a consistent project name
Use a project-owned package namespace where practical
Keep README aligned with current project status
Use a consistent system title
Use a project-appropriate database name where practical
Use project-owned metadata consistently
Update frontend branding
Update sample product data
```

Suggested new names:

```text
CloudCommerce
CloudMall
FYP Cloud E-Commerce
Small Cloud E-Commerce Platform
```

Recommended package name:

```text
com.rufeng.cloudcommerce
```

or:

```text
com.fyp.cloudcommerce
```

---

### 10.2 Functional Scope Control

The following modules should be reviewed and kept only when they support the FYP demonstration or administration workflow:

```text
Income statistics
Ranking charts
Complex file upload
Avatar management
Carousel management
Unnecessary dashboard features
```

These modules are not central to the Network Technology FYP. They can be simplified, hidden, or kept as non-core features if they do not distract from the main evaluation scope.

---

### 10.3 Network Performance Support

The project should add or document support for performance testing.

Recommended additions:

```text
A clear API list for JMeter testing
A stable test user account
A stable product dataset
A stable order placement flow
A test database initialization script
A performance testing README
A JMeter test plan file
```

Optional but useful:

```text
Request logging
API response time logging
Nginx access log analysis
Basic backend log timestamp
```

These additions make the project more clearly related to Network Technology.

---

## 11. Core API Flows for FYP Testing

The performance evaluation should focus on selected realistic user flows.

### Test Flow 1: User Login

```text
POST /login
```

Purpose:

```text
Measure authentication request performance.
```

---

### Test Flow 2: Product Browsing

```text
GET /goods
GET /goods/{id}
GET /categories
```

Purpose:

```text
Measure read-heavy request performance.
```

---

### Test Flow 3: Cart Operation

```text
POST /cart
GET /cart
PUT /cart
DELETE /cart/{id}
```

Purpose:

```text
Measure interactive user request performance.
```

---

### Test Flow 4: Order Placement

```text
POST /order
GET /order/user/{userId}
```

Purpose:

```text
Measure transaction-like request performance involving backend and database operations.
```

---

### Test Flow 5: Admin Product Management

```text
POST /admin/product
PUT /admin/product/{id}
DELETE /admin/product/{id}
```

Purpose:

```text
Measure backend management request performance.
```

This flow is optional and does not need to be the main testing scenario.

---

## 12. Performance Metrics

The project will measure the following metrics.

### 12.1 Response Time

Response time measures how long the system takes to respond to a user request.

It includes:

```text
Client request time
Network transmission time
Backend processing time
Database query time
Response return time
```

---

### 12.2 Throughput

Throughput measures how many requests the system can handle per second or per minute.

It helps evaluate whether the system can maintain stable service under increasing load.

---

### 12.3 Error Rate

Error rate measures the percentage of failed requests during testing.

Examples of failed requests:

```text
HTTP 4xx error
HTTP 5xx error
Timeout
Connection refused
Invalid response
```

---

### 12.4 Success Rate

Success rate measures the percentage of requests successfully completed.

This metric is useful for explaining system stability.

---

## 13. JMeter Testing Boundary

The JMeter test will not aim to prove that the system can support real commercial traffic.

The test will only evaluate the system under controlled academic conditions.

Suggested test settings:

```text
Number of users: 50, 100, 200, 300, 500
Ramp-up period: 30-60 seconds
Loop count: fixed or time-based
Test duration: 3-5 minutes per scenario
```

Recommended test scenarios:

```text
Scenario 1: Product browsing only
Scenario 2: Login + product browsing
Scenario 3: Login + cart operation
Scenario 4: Login + order placement
Scenario 5: Mixed user behavior
```

---

## 14. Expected Final Deliverables

The final FYP should produce the following deliverables.

### System Deliverables

```text
Modified Spring Boot backend
Modified Vue frontend
MySQL database script
Cloud deployment configuration
Nginx reverse proxy configuration
JMeter test plan
Performance test result files
```

### Documentation Deliverables

```text
Project proposal
System requirement specification
System design document
Network architecture diagram
Database design
API documentation
Deployment guide
Testing plan
Performance evaluation report
Final FYP report
```

---

## 15. What the Project Should Prove

The final project should prove the following:

1. A small e-commerce platform can be developed using Spring Boot and Vue.
2. The system can be deployed in a cloud environment.
3. The frontend, backend, reverse proxy, and database can communicate through a clear network architecture.
4. Apache JMeter can be used to simulate concurrent users.
5. Response time, throughput, and error rate can be measured.
6. The system behavior changes when user load increases.
7. Network performance results can be analyzed to identify limitations and possible improvements.

---

## 16. What the Project Should Not Claim

The project should not claim:

```text
The system is suitable for real commercial deployment
The system supports high-concurrency enterprise-level traffic
The system provides advanced cybersecurity protection
The system provides real payment processing
The system is a complete online marketplace
The system is optimized like Shopee, Lazada, or Amazon
The system uses microservices or container orchestration
```

Better wording:

```text
The system is a small-scale academic prototype for evaluating network performance in a cloud-based e-commerce environment.
```

---

## 17. Recommended Final Project Positioning

The final project should be positioned as:

> This project develops a small-scale cloud-based e-commerce prototype using Spring Boot and Vue. The system provides basic shopping functions such as user login, product browsing, cart management, and order placement. The main focus of the project is to deploy the system in a cloud environment and evaluate its network performance using Apache JMeter by measuring response time, throughput, and error rate under different concurrent user loads.

This positioning is strong because it keeps the modern technology stack while keeping the FYP focus within Network Technology.

---

## 18. Final Boundary Statement

The system is not positioned as a full commercial e-commerce platform. It is a controlled academic prototype whose purpose is to provide realistic network request flows for performance evaluation in a cloud environment.

The final project boundary is limited to:

```text
Small e-commerce functions
Cloud deployment
HTTP/HTTPS communication
Nginx reverse proxy routing
Spring Boot REST API handling
MySQL database interaction
JMeter-based performance evaluation
```

The final project boundary excludes:

```text
Real payment
Real logistics
AI recommendation
Microservices
Docker/Kubernetes
Large-scale commercial optimization
Advanced business analytics
```

---

## 19. Recommended One-Paragraph Version for Proposal

You can directly use the following paragraph in the proposal:

> This project aims to develop and evaluate a cloud-based small e-commerce platform using Spring Boot, Vue, MySQL, and Nginx. The system supports the core e-commerce functions required for this study, including user registration and login, product browsing, cart management, order placement, and basic admin management. The main focus of the project is not to build a full commercial online shopping system, but to analyze the network communication and performance of a cloud-deployed e-commerce application. Apache JMeter will be used to simulate different concurrent user loads, and the system performance will be evaluated using response time, throughput, and error rate. Advanced features such as real payment gateway integration, logistics tracking, AI recommendation, microservices, Docker, Kubernetes, and large-scale commercial optimization are excluded from the project scope.

---

## 20. Recommended Development Route

The recommended development route is:

```text
Define independent FYP scope and system identity
↓
Maintain consistent project branding
↓
Simplify or hide non-core commercial features
↓
Keep core e-commerce workflow
↓
Deploy to cloud server
↓
Configure Nginx reverse proxy
↓
Use JMeter to test network performance
↓
Analyze response time, throughput, and error rate
```

---

## 21. Final Decision Statement

This repository should be presented as a Network Technology FYP project with a modern Spring Boot and Vue architecture. The final project scope must remain strictly controlled around cloud deployment, HTTP/API behavior, and performance evaluation.

The final project should not be presented as an advanced commercial online shopping system. It should be presented as:

> A cloud-based small e-commerce platform for network performance evaluation.

This boundary ensures that the project remains aligned with the Network Technology field while still using a modern and practical software architecture.
