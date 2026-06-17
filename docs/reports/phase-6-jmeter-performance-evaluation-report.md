# Phase 6 JMeter Performance Evaluation Report

Date: 2026-06-16

## Purpose

Phase 6 evaluates whether the Google Cloud deployed FYP mall demo remains usable under controlled simulated user load. The goal is academic performance evidence for the final-year project, not a commercial capacity claim.

## Target System

| Item | Value |
|---|---|
| Public endpoint | `http://34.143.225.11/` |
| Deployment | Google Cloud VM `fyp-mall-vm`, zone `asia-southeast1-b` |
| Frontend | Vue served by Nginx |
| Backend | Spring Boot service behind Nginx |
| Data services | MySQL and Redis on the VM |
| JMeter version | Apache JMeter 5.6.3 |

## Scope

The executed JMeter plans covered:

- Homepage and homepage API loading.
- Product list and product detail browsing.
- Demo user login.
- Authenticated order-history retrieval.
- Controlled mutation flows: add to cart, place order, and simulated payment.

The approved planning document is [phase-6-jmeter-performance-evaluation-plan.md](../testing/jmeter/phase-6-jmeter-performance-evaluation-plan.md). The chronological execution record is [phase-6-jmeter-execution-record-2026-06-16.md](../records/phase-6-jmeter-execution-record-2026-06-16.md).

## Preparation

- Installed Apache JMeter 5.6.3 under ignored local tooling after verifying the official SHA512 checksum.
- Parameterized all eight `.jmx` plans with `THREADS`, `RAMP_UP`, and `LOOPS`.
- Added sampler-level assertions:
  - Homepage HTML must contain `id="app"`.
  - Backend JSON responses must contain `"code":"200"`.
- Validated JMX XML with `xmllint --noout docs/testing/jmeter/*.jmx`.
- Created a VM-side MySQL backup before mutation tests:
  - `/opt/project-fyp-mall/backups/electronic_mall_phase6_before_20260616_1452.sql`

## Execution Matrix

| Category | Plans | Concurrency |
|---|---|---|
| Smoke | `01` to `08` | 1 thread, 1 loop |
| Read-only load | `01_homepage`, `02_product_list`, `03_product_detail` | 10, 50, 100, 200 threads |
| Authenticated load | `04_login`, `08_order_history` | 10, 50, 100 threads |
| Controlled mutation | `05_add_to_cart`, `06_place_order`, `07_simulated_payment` | 1, 5, 10 threads |

Mutation was intentionally limited because the plans use the shared demo account and live product variant `good_id=3`, `standard=Chair`.

## Result Summary

Formal retained results are stored in:

- [aggregate-results.csv](../testing/jmeter/results/phase6-summary/aggregate-results.csv)
- [summary-tables.md](../testing/jmeter/results/phase6-summary/summary-tables.md)
- [p90-response-time-ms.svg](../testing/jmeter/results/phase6-summary/charts/p90-response-time-ms.svg)
- [throughput-per-second.svg](../testing/jmeter/results/phase6-summary/charts/throughput-per-second.svg)

Across the official Phase 6 smoke, load, authenticated, and controlled mutation runs:

| Metric | Result |
|---|---:|
| Total summarized result rows | 35 |
| Total JMeter sampler executions | 3197 |
| Total JMeter errors | 0 |
| Overall observed error rate | 0.00% |
| Load and mutation sampler executions | 3176 |
| Load and mutation errors | 0 |

Key observed performance points:

| Scenario | Highest tested threads | Samples | Error rate | Average ms | P90 ms | Throughput/s |
|---|---:|---:|---:|---:|---:|---:|
| Homepage | 200 | 800 | 0.00% | 1491.54 | 2457 | 12.32 |
| Product list | 200 | 200 | 0.00% | 1936.82 | 3400 | 3.28 |
| Product detail | 200 | 400 | 0.00% | 2302.22 | 3659 | 6.09 |
| Login | 100 | 100 | 0.00% | 2067.24 | 3116 | 2.32 |
| Order history | 100 | 200 | 0.00% | 1170.88 | 1986 | 4.61 |
| Add to cart | 10 | 20 | 0.00% | 949.70 | 2035 | 1.51 |
| Place order | 10 | 40 | 0.00% | 1320.25 | 1882 | 3.00 |
| Simulated payment | 10 | 50 | 0.00% | 254.82 | 441 | 4.79 |

## Database Impact

Mutation baseline before smoke/load:

| Metric | Before |
|---|---:|
| `t_order` rows | 3 |
| `cart` rows | 3 |
| Chair stock | 500 |

After smoke:

| Metric | Value |
|---|---:|
| `t_order` rows | 5 |
| `cart` rows | 4 |
| Chair stock | 499 |

After controlled mutation load:

| Metric | Value |
|---|---:|
| `t_order` rows | 37 |
| `cart` rows | 25 |
| Chair stock | 483 |
| Paid orders | 19 |
| Pending Payment orders | 17 |

The stock reduction from 499 to 483 matches the 16 simulated-payment threads from the 1/5/10 mutation matrix. Extra cart rows are expected because add-to-cart scenarios deliberately create cart data and the shared-account JMX flow does not clean every cart item.

## Interpretation

The deployed demo is usable for FYP demonstration and thesis evidence preparation:

- All eight user journeys executed successfully during smoke testing.
- Read-only browsing tolerated up to 200 simulated users in the tested ramp-up pattern with 0.00% error rate.
- Login and authenticated order-history retrieval tolerated up to 100 simulated users with 0.00% error rate.
- Controlled mutation flows worked at 1, 5, and 10 simulated users with 0.00% error rate.
- VM services remained active after read-only, authenticated, and mutation load phases.

Observed response times are acceptable for a small academic cloud prototype, but not optimized for commercial-scale claims. Homepage and product detail scenarios showed multi-second P90 values at higher load, so future work should focus on caching, asset optimization, SQL query tuning, and horizontal capacity only if the project scope expands beyond the FYP demo.

## Limitations

- The public VM uses HTTP, not HTTPS.
- The load generator ran from the local workstation, so internet route variability affects latency.
- Mutation plans share the same demo user and product variant; this is suitable for controlled FYP evidence but not a full production-grade order-concurrency benchmark.
- Raw `.jtl` and generated HTML report folders are retained locally but ignored by Git to avoid large repository artifacts. The retained CSV, Markdown, SVG charts, execution record, and this report are the canonical documentation evidence.

## Conclusion

Phase 6 is complete for the FYP demo standard. The system passed all planned smoke, read-only load, authenticated load, and controlled mutation JMeter tests with 0.00% observed error rate, and the resulting metrics are documented for thesis writing and final demonstration preparation.
