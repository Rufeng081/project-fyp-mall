# Phase 6 JMeter Performance Evaluation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Plan the Phase 6 Apache JMeter performance evaluation for the cloud-deployed FYP mall system without executing load tests in this planning step.

**Architecture:** The test target is the public Google Cloud VM endpoint behind Nginx. JMeter will simulate HTTP users against the Vue storefront, Spring Boot REST APIs, Redis-backed login sessions, MySQL-backed product/cart/order flows, and uploaded resource routes. Results will be analyzed as network performance evidence for an academic cloud-based e-commerce prototype, not as commercial capacity proof.

**Tech Stack:** Apache JMeter, Google Cloud VM, Nginx reverse proxy, Spring Boot, MySQL, Redis, Vue frontend, HTTP API requests.

---

## 1. Fit With FYP Scope

Phase 6 is appropriate and required for this FYP because the project objective is not only to build a small e-commerce platform, but also to evaluate its network performance in a cloud environment.

This phase supports the documented FYP direction:

> Development and Network Performance Evaluation of a Cloud-Based Small E-Commerce Platform

The evaluation should prove that:

1. The system is deployed in a real cloud environment.
2. Client requests pass through Nginx to the Spring Boot backend.
3. Core e-commerce flows can be measured under simulated concurrent users.
4. Response time, throughput, success rate, and error rate can be collected.
5. System behavior changes can be explained as user load increases.

This phase should not claim that the system supports real commercial traffic. It is a controlled academic evaluation of a small cloud-based prototype.

## 2. Phase 6 Objectives

Phase 6 should answer these research-facing questions:

| Question | Evidence |
|---|---|
| How fast does the cloud mall respond under light, medium, and high simulated load? | Average, median, min, max, and 90th percentile response time. |
| How many requests can the deployed system process per second under each load? | Throughput from JMeter aggregate reports. |
| At what point do errors appear or increase? | Error rate and failed sampler details. |
| Which endpoint or user flow becomes slow first? | Per-sampler response-time comparison. |
| Is the system suitable for a small academic e-commerce demo? | Controlled conclusion based on measured data, not assumptions. |

## 3. Testing Boundary

### In Scope

- Public homepage loading through Nginx.
- Product browsing APIs.
- Product detail and product variant APIs.
- Demo user login and JWT token extraction.
- Authenticated order-history reads.
- Controlled add-to-cart, place-order, and simulated-payment mutation flows.
- Comparison of read-heavy and write-heavy behavior.
- Collection of response time, throughput, error rate, success rate, and percentile metrics.
- VM-side observation of service health and recent logs before and after tests.

### Out of Scope

- Real payment gateway testing.
- Email sending load tests.
- Admin dashboard load tests unless required later.
- Real commercial traffic claims.
- Kubernetes, Docker, CDN, autoscaling, or enterprise high-availability evaluation.
- Security or penetration testing.
- Long-duration soak testing beyond the FYP requirement.

## 4. Existing JMeter Assets

The repository already contains these JMeter plans:

| File | Flow | Data Risk |
|---|---|---|
| `01_homepage.jmx` | Homepage plus homepage API calls. | Read-only. |
| `02_product_list.jmx` | Product page/list API. | Read-only. |
| `03_product_detail.jmx` | Product detail and variants. | Read-only. |
| `04_login.jmx` | Demo user login and token extraction. | Redis session write only. |
| `05_add_to_cart.jmx` | Login and add one product variant to cart. | Mutates cart data. |
| `06_place_order.jmx` | Login, add cart item, read cart item, place order. | Mutates cart/order data. |
| `07_simulated_payment.jmx` | Login, add cart item, place order, simulated payment. | Mutates cart/order/stock/sales data. |
| `08_order_history.jmx` | Login and read order history. | Read-only after login. |

These plans match the FYP requirement because they cover both read-heavy browsing and transaction-like e-commerce operations.

## 5. Public Endpoint Mapping

The current cloud endpoint is:

```text
http://34.143.225.11
```

The current Nginx configuration strips the first public `/api/` segment before proxying to Spring Boot. The existing JMeter plans are compatible with this behavior:

| Backend route | JMeter public path |
|---|---|
| `/login` | `${API_PREFIX}/login` with `API_PREFIX=/api` |
| `/userid` | `${API_PREFIX}/userid` with `API_PREFIX=/api` |
| `/api/good` | `${API_PREFIX}/api/good` with `API_PREFIX=/api` |
| `/api/cart` | `${API_PREFIX}/api/cart` with `API_PREFIX=/api` |
| `/api/order` | `${API_PREFIX}/api/order` with `API_PREFIX=/api` |

Manual public checks should use `/api/api/good` for backend `/api/good`. Direct `/api/good` is not a valid product-list check under the current Nginx template.

## 6. Test Strategy

Phase 6 should be executed in four layers.

### Layer 1: Environment Readiness

Purpose: confirm the target system is healthy before load testing.

- [ ] Confirm VM is running.
- [ ] Confirm Nginx, Spring Boot, MySQL, and Redis are active.
- [ ] Confirm public homepage returns HTTP 200.
- [ ] Confirm read-only APIs return `code=200`.
- [ ] Confirm demo login returns a token.
- [ ] Back up the live database before mutation tests.

Suggested VM checks:

```bash
gcloud compute instances list --filter=name=fyp-mall-vm
gcloud compute ssh fyp-mall-vm --zone=asia-southeast1-b --command "systemctl is-active nginx"
gcloud compute ssh fyp-mall-vm --zone=asia-southeast1-b --command "systemctl is-active project-fyp-mall.service"
gcloud compute ssh fyp-mall-vm --zone=asia-southeast1-b --command "systemctl is-active mysql"
gcloud compute ssh fyp-mall-vm --zone=asia-southeast1-b --command "systemctl is-active redis-server"
```

### Layer 2: Smoke Testing

Purpose: prove each JMeter plan works with one virtual user before increasing load.

Execution order:

1. `01_homepage.jmx`
2. `02_product_list.jmx`
3. `03_product_detail.jmx`
4. `04_login.jmx`
5. `08_order_history.jmx`
6. `05_add_to_cart.jmx`
7. `06_place_order.jmx`
8. `07_simulated_payment.jmx`

Mutation plans should run only after the database has been backed up.

Example smoke command:

```bash
jmeter -n -t docs/testing/jmeter/04_login.jmx -l docs/testing/jmeter/results/phase6-smoke-login.jtl -e -o docs/testing/jmeter/results/phase6-smoke-login-html
```

### Layer 3: Controlled Load Testing

Purpose: collect comparable metrics under increasing concurrent users.

Recommended load matrix:

| Round | Virtual Users | Ramp-Up | Duration | Purpose |
|---|---:|---:|---:|---|
| Baseline | 1 | 1 second | 1 minute | Confirm clean baseline behavior. |
| Light | 10 | 10 seconds | 1 minute | Confirm stable low-load response. |
| Moderate | 50 | 30 seconds | 2 minutes | Match common FYP lower-bound load. |
| High | 100 | 60 seconds | 3 minutes | Observe response-time growth. |
| Stress | 200 | 120 seconds | 3-5 minutes | Identify bottlenecks on the e2-medium VM. |
| Optional Stress+ | 300 | 180 seconds | 3-5 minutes | Run only if 200 users is stable. |
| Optional Limit Probe | 500 | 300 seconds | 3-5 minutes | Run only with explicit backup and acceptance of high error risk. |

For the final report, 10, 50, 100, and 200 users are enough if the VM becomes unstable at higher loads. The optional 300 and 500 user rounds exist because the project scope mentions them, but they should not be forced if they only produce VM overload rather than useful analysis.

### Layer 4: Result Analysis

Purpose: convert raw JMeter output into FYP evidence.

For each scenario and load level, collect:

- Average response time.
- Median response time.
- 90th percentile response time.
- Minimum response time.
- Maximum response time.
- Throughput.
- Error rate.
- Success rate.
- Failed sampler names and failure causes.

Then compare:

- Read-only flows vs mutation flows.
- Login vs product browsing.
- Product detail vs product list.
- Order placement/payment vs order history.
- Low-load metrics vs high-load metrics.

## 7. Recommended Scenario Set

### Scenario A: Read-Only Browsing

Plans:

- `01_homepage.jmx`
- `02_product_list.jmx`
- `03_product_detail.jmx`

Purpose:

- Measure public browsing performance.
- Avoid database mutation.
- Establish stable baseline for the report.

Recommended load levels:

```text
10, 50, 100, 200 users
```

### Scenario B: Authentication and Read Flow

Plans:

- `04_login.jmx`
- `08_order_history.jmx`

Purpose:

- Measure login/session behavior.
- Confirm token extraction and authenticated API performance.
- Exercise Redis-backed session state.

Recommended load levels:

```text
10, 50, 100 users
```

Avoid starting at 200+ login users because repeated login creates many Redis session keys and may distort the main HTTP performance analysis.

### Scenario C: Transaction-Like Flow

Plans:

- `05_add_to_cart.jmx`
- `06_place_order.jmx`
- `07_simulated_payment.jmx`

Purpose:

- Measure write-heavy e-commerce behavior.
- Exercise Spring Boot, MySQL inserts/updates, stock updates, and order history data.

Recommended load levels:

```text
1, 10, 25, 50 users
```

This flow should use lower concurrency than read-only tests because it mutates demo data. Running hundreds of payment simulations can create excessive orders and reduce product stock.

### Scenario D: Mixed User Behavior

Purpose:

- Simulate a more realistic demo workload by combining mostly browsing with a smaller share of login/order operations.

Recommended composition:

| Flow Type | Weight |
|---|---:|
| Homepage/product list/product detail | 70% |
| Login/order history | 20% |
| Add-to-cart/place-order/payment | 10% |

This scenario can be built later as a combined JMeter plan or executed as separate JMeter plans in coordinated rounds. It is useful for the final thesis discussion but not required before the single-flow results are understood.

## 8. Data Protection Rules

Before mutation tests:

- [ ] Back up the live MySQL database.
- [ ] Record current product stock for selected test product/variant.
- [ ] Record current order count.
- [ ] Keep JMeter thread counts low for mutation plans.
- [ ] Do not run mutation plans repeatedly without cleanup.

Suggested backup command on the VM:

```bash
sudo mysqldump electronic_mall > ~/electronic_mall_phase6_before_$(date +%Y%m%d_%H%M%S).sql
```

Do not store database dumps in Git.

After mutation tests:

- [ ] Record new order count.
- [ ] Record stock changes.
- [ ] Decide whether to keep test records as evidence or restore from backup.

## 9. Result File Organization

Store Phase 6 generated evidence under:

```text
docs/testing/jmeter/results/
```

Recommended structure:

```text
docs/testing/jmeter/results/
  phase6-smoke/
    01_homepage.jtl
    04_login.jtl
    screenshots/
  phase6-load/
    read-only-10u.jtl
    read-only-50u.jtl
    read-only-100u.jtl
    read-only-200u.jtl
    login-10u.jtl
    login-50u.jtl
    transaction-10u.jtl
  phase6-summary/
    aggregate-results.csv
    response-time-table.md
    throughput-error-rate-table.md
    charts/
```

Large raw files may be excluded from Git if they become too large. Keep summarized tables, selected screenshots, and final result documents in `/docs`.

## 10. Execution Commands

Smoke test:

```bash
jmeter -n -t docs/testing/jmeter/01_homepage.jmx -l docs/testing/jmeter/results/phase6-smoke/01_homepage.jtl -e -o docs/testing/jmeter/results/phase6-smoke/01_homepage-html
```

Read-only load test example:

```bash
jmeter -n -t docs/testing/jmeter/02_product_list.jmx -JTHREADS=50 -JRAMP_UP=30 -JDURATION=120 -l docs/testing/jmeter/results/phase6-load/product-list-50u.jtl -e -o docs/testing/jmeter/results/phase6-load/product-list-50u-html
```

If the existing `.jmx` files do not yet expose `THREADS`, `RAMP_UP`, and `DURATION` as properties, update the plans before load execution or adjust the Thread Group values inside the JMeter GUI.

## 11. Acceptance Criteria

Phase 6 is complete when:

- [ ] JMeter is installed and can run in non-GUI mode.
- [ ] All eight existing `.jmx` plans pass one-user smoke checks.
- [ ] Read-only scenarios have results for at least 10, 50, 100, and 200 users.
- [ ] Authentication scenarios have results for at least 10, 50, and 100 users.
- [ ] Mutation scenarios have controlled results for at least 1, 10, and 25 or 50 users.
- [ ] JMeter aggregate reports include response time, throughput, and error rate.
- [ ] Result tables and charts are created under `/docs/testing/jmeter/results/phase6-summary/`.
- [ ] VM service health and error logs are checked before and after testing.
- [ ] The final analysis explains bottlenecks and limitations without claiming enterprise-scale performance.

## 12. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Public VM overload | Test results become unstable or service becomes temporarily unavailable. | Increase load gradually; stop when error rate rises sharply. |
| Mutation tests create too many records | Demo database becomes noisy. | Back up first; keep mutation concurrency low; clean or restore after tests. |
| Product stock reaches zero | Payment tests fail. | Use a product variant with high stock and record stock before testing. |
| Redis token buildup | Login tests may create many session keys. | Keep login concurrency controlled; restart/clean Redis only if planned and documented. |
| Nginx path confusion | JMeter requests hit wrong endpoint and return 401. | Keep `API_PREFIX=/api`; use `${API_PREFIX}/api/...` for backend `/api/...` routes. |
| Misleading thesis claims | Evaluation may overstate project capability. | State that results apply to a small academic prototype on one cloud VM. |

## 13. Report-Ready Interpretation Guide

Use cautious language in the thesis:

- "The system was evaluated under controlled simulated user loads."
- "The results show how response time and throughput changed as concurrency increased."
- "The test identifies bottlenecks in the deployed VM environment."
- "The system is suitable for small-scale academic demonstration under the tested load range."

Avoid unsupported language:

- "The system is production-ready."
- "The system supports real commercial traffic."
- "The system is scalable for enterprise use."
- "The payment module is equivalent to a real payment gateway."

## 14. Phase 6 Task Checklist

- [ ] Install or confirm Apache JMeter availability.
- [ ] Create `docs/testing/jmeter/results/` directory structure.
- [ ] Back up live MySQL before mutation tests.
- [ ] Run one-user smoke checks for all eight plans.
- [ ] Run read-only load rounds.
- [ ] Run login/authenticated read load rounds.
- [ ] Run controlled mutation load rounds.
- [ ] Export aggregate reports and HTML reports.
- [ ] Create summary tables for response time, throughput, error rate, and success rate.
- [ ] Capture screenshots of key JMeter reports.
- [ ] Check VM service status and error logs after each major round.
- [ ] Write Phase 6 result report under `docs/reports/`.
- [ ] Update `docs/README.md` and `docs/records/project-work-log.md` with final execution evidence.

## 15. Planning Decision

This plan is suitable for the FYP because it directly supports the network performance evaluation objective using the already deployed cloud e-commerce system. It keeps the scope academic, measurable, and realistic for a single Google Cloud VM. It also protects the demo database by separating read-only, authentication, and mutation tests.

